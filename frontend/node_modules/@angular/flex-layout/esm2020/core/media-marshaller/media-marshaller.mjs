/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { sortDescendingPriority } from '../utils/sort';
import { mergeAlias } from '../add-alias';
import * as i0 from "@angular/core";
import * as i1 from "../match-media/match-media";
import * as i2 from "../breakpoints/break-point-registry";
import * as i3 from "./print-hook";
/**
 * MediaMarshaller - register responsive values from directives and
 *                   trigger them based on media query events
 */
export class MediaMarshaller {
    constructor(matchMedia, breakpoints, hook) {
        this.matchMedia = matchMedia;
        this.breakpoints = breakpoints;
        this.hook = hook;
        this._useFallbacks = true;
        this._activatedBreakpoints = [];
        this.elementMap = new Map();
        this.elementKeyMap = new WeakMap();
        this.watcherMap = new WeakMap(); // special triggers to update elements
        this.updateMap = new WeakMap(); // callback functions to update styles
        this.clearMap = new WeakMap(); // callback functions to clear styles
        this.subject = new Subject();
        this.observeActivations();
    }
    get activatedAlias() {
        return this.activatedBreakpoints[0]?.alias ?? '';
    }
    set activatedBreakpoints(bps) {
        this._activatedBreakpoints = [...bps];
    }
    get activatedBreakpoints() {
        return [...this._activatedBreakpoints];
    }
    set useFallbacks(value) {
        this._useFallbacks = value;
    }
    /**
     * Update styles on breakpoint activates or deactivates
     * @param mc
     */
    onMediaChange(mc) {
        const bp = this.findByQuery(mc.mediaQuery);
        if (bp) {
            mc = mergeAlias(mc, bp);
            const bpIndex = this.activatedBreakpoints.indexOf(bp);
            if (mc.matches && bpIndex === -1) {
                this._activatedBreakpoints.push(bp);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
            else if (!mc.matches && bpIndex !== -1) {
                // Remove the breakpoint when it's deactivated
                this._activatedBreakpoints.splice(bpIndex, 1);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
        }
    }
    /**
     * initialize the marshaller with necessary elements for delegation on an element
     * @param element
     * @param key
     * @param updateFn optional callback so that custom bp directives don't have to re-provide this
     * @param clearFn optional callback so that custom bp directives don't have to re-provide this
     * @param extraTriggers other triggers to force style updates (e.g. layout, directionality, etc)
     */
    init(element, key, updateFn, clearFn, extraTriggers = []) {
        initBuilderMap(this.updateMap, element, key, updateFn);
        initBuilderMap(this.clearMap, element, key, clearFn);
        this.buildElementKeyMap(element, key);
        this.watchExtraTriggers(element, key, extraTriggers);
    }
    /**
     * get the value for an element and key and optionally a given breakpoint
     * @param element
     * @param key
     * @param bp
     */
    getValue(element, key, bp) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = bp !== undefined ? bpMap.get(bp) : this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key);
            }
        }
        return undefined;
    }
    /**
     * whether the element has values for a given key
     * @param element
     * @param key
     */
    hasValue(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key) !== undefined || false;
            }
        }
        return false;
    }
    /**
     * Set the value for an input on a directive
     * @param element the element in question
     * @param key the type of the directive (e.g. flex, layout-gap, etc)
     * @param bp the breakpoint suffix (empty string = default)
     * @param val the value for the breakpoint
     */
    setValue(element, key, val, bp) {
        let bpMap = this.elementMap.get(element);
        if (!bpMap) {
            bpMap = new Map().set(bp, new Map().set(key, val));
            this.elementMap.set(element, bpMap);
        }
        else {
            const values = (bpMap.get(bp) ?? new Map()).set(key, val);
            bpMap.set(bp, values);
            this.elementMap.set(element, bpMap);
        }
        const value = this.getValue(element, key);
        if (value !== undefined) {
            this.updateElement(element, key, value);
        }
    }
    /** Track element value changes for a specific key */
    trackValue(element, key) {
        return this.subject
            .asObservable()
            .pipe(filter(v => v.element === element && v.key === key));
    }
    /** update all styles for all elements on the current breakpoint */
    updateStyles() {
        this.elementMap.forEach((bpMap, el) => {
            const keyMap = new Set(this.elementKeyMap.get(el));
            let valueMap = this.getActivatedValues(bpMap);
            if (valueMap) {
                valueMap.forEach((v, k) => {
                    this.updateElement(el, k, v);
                    keyMap.delete(k);
                });
            }
            keyMap.forEach(k => {
                valueMap = this.getActivatedValues(bpMap, k);
                if (valueMap) {
                    const value = valueMap.get(k);
                    this.updateElement(el, k, value);
                }
                else {
                    this.clearElement(el, k);
                }
            });
        });
    }
    /**
     * clear the styles for a given element
     * @param element
     * @param key
     */
    clearElement(element, key) {
        const builders = this.clearMap.get(element);
        if (builders) {
            const clearFn = builders.get(key);
            if (!!clearFn) {
                clearFn();
                this.subject.next({ element, key, value: '' });
            }
        }
    }
    /**
     * update a given element with the activated values for a given key
     * @param element
     * @param key
     * @param value
     */
    updateElement(element, key, value) {
        const builders = this.updateMap.get(element);
        if (builders) {
            const updateFn = builders.get(key);
            if (!!updateFn) {
                updateFn(value);
                this.subject.next({ element, key, value });
            }
        }
    }
    /**
     * release all references to a given element
     * @param element
     */
    releaseElement(element) {
        const watcherMap = this.watcherMap.get(element);
        if (watcherMap) {
            watcherMap.forEach(s => s.unsubscribe());
            this.watcherMap.delete(element);
        }
        const elementMap = this.elementMap.get(element);
        if (elementMap) {
            elementMap.forEach((_, s) => elementMap.delete(s));
            this.elementMap.delete(element);
        }
    }
    /**
     * trigger an update for a given element and key (e.g. layout)
     * @param element
     * @param key
     */
    triggerUpdate(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const valueMap = this.getActivatedValues(bpMap, key);
            if (valueMap) {
                if (key) {
                    this.updateElement(element, key, valueMap.get(key));
                }
                else {
                    valueMap.forEach((v, k) => this.updateElement(element, k, v));
                }
            }
        }
    }
    /** Cross-reference for HTMLElement with directive key */
    buildElementKeyMap(element, key) {
        let keyMap = this.elementKeyMap.get(element);
        if (!keyMap) {
            keyMap = new Set();
            this.elementKeyMap.set(element, keyMap);
        }
        keyMap.add(key);
    }
    /**
     * Other triggers that should force style updates:
     * - directionality
     * - layout changes
     * - mutationobserver updates
     */
    watchExtraTriggers(element, key, triggers) {
        if (triggers && triggers.length) {
            let watchers = this.watcherMap.get(element);
            if (!watchers) {
                watchers = new Map();
                this.watcherMap.set(element, watchers);
            }
            const subscription = watchers.get(key);
            if (!subscription) {
                const newSubscription = merge(...triggers).subscribe(() => {
                    const currentValue = this.getValue(element, key);
                    this.updateElement(element, key, currentValue);
                });
                watchers.set(key, newSubscription);
            }
        }
    }
    /** Breakpoint locator by mediaQuery */
    findByQuery(query) {
        return this.breakpoints.findByQuery(query);
    }
    /**
     * get the fallback breakpoint for a given element, starting with the current breakpoint
     * @param bpMap
     * @param key
     */
    getActivatedValues(bpMap, key) {
        for (let i = 0; i < this.activatedBreakpoints.length; i++) {
            const activatedBp = this.activatedBreakpoints[i];
            const valueMap = bpMap.get(activatedBp.alias);
            if (valueMap) {
                if (key === undefined || (valueMap.has(key) && valueMap.get(key) != null)) {
                    return valueMap;
                }
            }
        }
        // On the server, we explicitly have an "all" section filled in to begin with.
        // So we don't need to aggressively find a fallback if no explicit value exists.
        if (!this._useFallbacks) {
            return undefined;
        }
        const lastHope = bpMap.get('');
        return (key === undefined || lastHope && lastHope.has(key)) ? lastHope : undefined;
    }
    /**
     * Watch for mediaQuery breakpoint activations
     */
    observeActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        this.hook.registerBeforeAfterPrintHooks(this);
        this.matchMedia
            .observe(this.hook.withPrintQuery(queries))
            .pipe(tap(this.hook.interceptEvents(this)), filter(this.hook.blockPropagation()))
            .subscribe(this.onMediaChange.bind(this));
    }
}
MediaMarshaller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaMarshaller, deps: [{ token: i1.MatchMedia }, { token: i2.BreakPointRegistry }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable });
MediaMarshaller.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaMarshaller, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaMarshaller, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.MatchMedia }, { type: i2.BreakPointRegistry }, { type: i3.PrintHook }]; } });
function initBuilderMap(map, element, key, input) {
    if (input !== undefined) {
        const oldMap = map.get(element) ?? new Map();
        oldMap.set(key, input);
        map.set(element, oldMap);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWFyc2hhbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU1yRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQW9CeEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGVBQWU7SUEyQjFCLFlBQXNCLFVBQXNCLEVBQ3RCLFdBQStCLEVBQy9CLElBQWU7UUFGZixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixTQUFJLEdBQUosSUFBSSxDQUFXO1FBNUI3QixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQiwwQkFBcUIsR0FBaUIsRUFBRSxDQUFDO1FBQ3pDLGVBQVUsR0FBZSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25DLGtCQUFhLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDN0MsZUFBVSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBSyxzQ0FBc0M7UUFDbEYsY0FBUyxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTSxzQ0FBc0M7UUFDbEYsYUFBUSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTyxxQ0FBcUM7UUFFakYsWUFBTyxHQUE0QixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBcUJ2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T0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7QnJlYWtQb2ludH0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQnO1xuaW1wb3J0IHtzb3J0RGVzY2VuZGluZ1ByaW9yaXR5fSBmcm9tICcuLi91dGlscy9zb3J0JztcbmltcG9ydCB7QnJlYWtQb2ludFJlZ2lzdHJ5fSBmcm9tICcuLi9icmVha3BvaW50cy9icmVhay1wb2ludC1yZWdpc3RyeSc7XG5pbXBvcnQge01hdGNoTWVkaWF9IGZyb20gJy4uL21hdGNoLW1lZGlhL21hdGNoLW1lZGlhJztcbmltcG9ydCB7TWVkaWFDaGFuZ2V9IGZyb20gJy4uL21lZGlhLWNoYW5nZSc7XG5cbmltcG9ydCB7UHJpbnRIb29rLCBIb29rVGFyZ2V0fSBmcm9tICcuL3ByaW50LWhvb2snO1xuaW1wb3J0IHttZXJnZUFsaWFzfSBmcm9tICcuLi9hZGQtYWxpYXMnO1xuXG50eXBlIENsZWFyQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xudHlwZSBVcGRhdGVDYWxsYmFjayA9ICh2YWw6IGFueSkgPT4gdm9pZDtcbnR5cGUgQnVpbGRlciA9IFVwZGF0ZUNhbGxiYWNrIHwgQ2xlYXJDYWxsYmFjaztcblxudHlwZSBWYWx1ZU1hcCA9IE1hcDxzdHJpbmcsIHN0cmluZz47XG50eXBlIEJyZWFrcG9pbnRNYXAgPSBNYXA8c3RyaW5nLCBWYWx1ZU1hcD47XG50eXBlIEVsZW1lbnRNYXAgPSBNYXA8SFRNTEVsZW1lbnQsIEJyZWFrcG9pbnRNYXA+O1xudHlwZSBFbGVtZW50S2V5TWFwID0gV2Vha01hcDxIVE1MRWxlbWVudCwgU2V0PHN0cmluZz4+O1xudHlwZSBTdWJzY3JpcHRpb25NYXAgPSBNYXA8c3RyaW5nLCBTdWJzY3JpcHRpb24+O1xudHlwZSBXYXRjaGVyTWFwID0gV2Vha01hcDxIVE1MRWxlbWVudCwgU3Vic2NyaXB0aW9uTWFwPjtcbnR5cGUgQnVpbGRlck1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIE1hcDxzdHJpbmcsIEJ1aWxkZXI+PjtcblxuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50TWF0Y2hlciB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBrZXk6IHN0cmluZztcbiAgdmFsdWU6IGFueTtcbn1cblxuLyoqXG4gKiBNZWRpYU1hcnNoYWxsZXIgLSByZWdpc3RlciByZXNwb25zaXZlIHZhbHVlcyBmcm9tIGRpcmVjdGl2ZXMgYW5kXG4gKiAgICAgICAgICAgICAgICAgICB0cmlnZ2VyIHRoZW0gYmFzZWQgb24gbWVkaWEgcXVlcnkgZXZlbnRzXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1lZGlhTWFyc2hhbGxlciB7XG4gIHByaXZhdGUgX3VzZUZhbGxiYWNrcyA9IHRydWU7XG4gIHByaXZhdGUgX2FjdGl2YXRlZEJyZWFrcG9pbnRzOiBCcmVha1BvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBlbGVtZW50TWFwOiBFbGVtZW50TWFwID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGVsZW1lbnRLZXlNYXA6IEVsZW1lbnRLZXlNYXAgPSBuZXcgV2Vha01hcCgpO1xuICBwcml2YXRlIHdhdGNoZXJNYXA6IFdhdGNoZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgLy8gc3BlY2lhbCB0cmlnZ2VycyB0byB1cGRhdGUgZWxlbWVudHNcbiAgcHJpdmF0ZSB1cGRhdGVNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgIC8vIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byB1cGRhdGUgc3R5bGVzXG4gIHByaXZhdGUgY2xlYXJNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnMgdG8gY2xlYXIgc3R5bGVzXG5cbiAgcHJpdmF0ZSBzdWJqZWN0OiBTdWJqZWN0PEVsZW1lbnRNYXRjaGVyPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZ2V0IGFjdGl2YXRlZEFsaWFzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHNbMF0/LmFsaWFzID8/ICcnO1xuICB9XG5cbiAgc2V0IGFjdGl2YXRlZEJyZWFrcG9pbnRzKGJwczogQnJlYWtQb2ludFtdKSB7XG4gICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMgPSBbLi4uYnBzXTtcbiAgfVxuXG4gIGdldCBhY3RpdmF0ZWRCcmVha3BvaW50cygpOiBCcmVha1BvaW50W10ge1xuICAgIHJldHVybiBbLi4udGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHNdO1xuICB9XG5cbiAgc2V0IHVzZUZhbGxiYWNrcyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3VzZUZhbGxiYWNrcyA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG1hdGNoTWVkaWE6IE1hdGNoTWVkaWEsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFJlZ2lzdHJ5LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaG9vazogUHJpbnRIb29rKSB7XG4gICAgdGhpcy5vYnNlcnZlQWN0aXZhdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgc3R5bGVzIG9uIGJyZWFrcG9pbnQgYWN0aXZhdGVzIG9yIGRlYWN0aXZhdGVzXG4gICAqIEBwYXJhbSBtY1xuICAgKi9cbiAgb25NZWRpYUNoYW5nZShtYzogTWVkaWFDaGFuZ2UpIHtcbiAgICBjb25zdCBicDogQnJlYWtQb2ludCB8IG51bGwgPSB0aGlzLmZpbmRCeVF1ZXJ5KG1jLm1lZGlhUXVlcnkpO1xuXG4gICAgaWYgKGJwKSB7XG4gICAgICBtYyA9IG1lcmdlQWxpYXMobWMsIGJwKTtcblxuICAgICAgY29uc3QgYnBJbmRleCA9IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMuaW5kZXhPZihicCk7XG5cbiAgICAgIGlmIChtYy5tYXRjaGVzICYmIGJwSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzLnB1c2goYnApO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZWRCcmVha3BvaW50cy5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3R5bGVzKCk7XG4gICAgICB9IGVsc2UgaWYgKCFtYy5tYXRjaGVzICYmIGJwSW5kZXggIT09IC0xKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgYnJlYWtwb2ludCB3aGVuIGl0J3MgZGVhY3RpdmF0ZWRcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMuc3BsaWNlKGJwSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZWRCcmVha3BvaW50cy5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3R5bGVzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluaXRpYWxpemUgdGhlIG1hcnNoYWxsZXIgd2l0aCBuZWNlc3NhcnkgZWxlbWVudHMgZm9yIGRlbGVnYXRpb24gb24gYW4gZWxlbWVudFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSB1cGRhdGVGbiBvcHRpb25hbCBjYWxsYmFjayBzbyB0aGF0IGN1c3RvbSBicCBkaXJlY3RpdmVzIGRvbid0IGhhdmUgdG8gcmUtcHJvdmlkZSB0aGlzXG4gICAqIEBwYXJhbSBjbGVhckZuIG9wdGlvbmFsIGNhbGxiYWNrIHNvIHRoYXQgY3VzdG9tIGJwIGRpcmVjdGl2ZXMgZG9uJ3QgaGF2ZSB0byByZS1wcm92aWRlIHRoaXNcbiAgICogQHBhcmFtIGV4dHJhVHJpZ2dlcnMgb3RoZXIgdHJpZ2dlcnMgdG8gZm9yY2Ugc3R5bGUgdXBkYXRlcyAoZS5nLiBsYXlvdXQsIGRpcmVjdGlvbmFsaXR5LCBldGMpXG4gICAqL1xuICBpbml0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgIHVwZGF0ZUZuPzogVXBkYXRlQ2FsbGJhY2ssXG4gICAgICAgY2xlYXJGbj86IENsZWFyQ2FsbGJhY2ssXG4gICAgICAgZXh0cmFUcmlnZ2VyczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXSk6IHZvaWQge1xuXG4gICAgaW5pdEJ1aWxkZXJNYXAodGhpcy51cGRhdGVNYXAsIGVsZW1lbnQsIGtleSwgdXBkYXRlRm4pO1xuICAgIGluaXRCdWlsZGVyTWFwKHRoaXMuY2xlYXJNYXAsIGVsZW1lbnQsIGtleSwgY2xlYXJGbik7XG5cbiAgICB0aGlzLmJ1aWxkRWxlbWVudEtleU1hcChlbGVtZW50LCBrZXkpO1xuICAgIHRoaXMud2F0Y2hFeHRyYVRyaWdnZXJzKGVsZW1lbnQsIGtleSwgZXh0cmFUcmlnZ2Vycyk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSB2YWx1ZSBmb3IgYW4gZWxlbWVudCBhbmQga2V5IGFuZCBvcHRpb25hbGx5IGEgZ2l2ZW4gYnJlYWtwb2ludFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSBicFxuICAgKi9cbiAgZ2V0VmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCBicD86IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgYnBNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChicE1hcCkge1xuICAgICAgY29uc3QgdmFsdWVzID0gYnAgIT09IHVuZGVmaW5lZCA/IGJwTWFwLmdldChicCkgOiB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiB3aGV0aGVyIHRoZSBlbGVtZW50IGhhcyB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGhhc1ZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGJwTWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnBNYXApIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrZXkpO1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gdmFsdWVzLmdldChrZXkpICE9PSB1bmRlZmluZWQgfHwgZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZhbHVlIGZvciBhbiBpbnB1dCBvbiBhIGRpcmVjdGl2ZVxuICAgKiBAcGFyYW0gZWxlbWVudCB0aGUgZWxlbWVudCBpbiBxdWVzdGlvblxuICAgKiBAcGFyYW0ga2V5IHRoZSB0eXBlIG9mIHRoZSBkaXJlY3RpdmUgKGUuZy4gZmxleCwgbGF5b3V0LWdhcCwgZXRjKVxuICAgKiBAcGFyYW0gYnAgdGhlIGJyZWFrcG9pbnQgc3VmZml4IChlbXB0eSBzdHJpbmcgPSBkZWZhdWx0KVxuICAgKiBAcGFyYW0gdmFsIHRoZSB2YWx1ZSBmb3IgdGhlIGJyZWFrcG9pbnRcbiAgICovXG4gIHNldFZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdmFsOiBhbnksIGJwOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgYnBNYXA6IEJyZWFrcG9pbnRNYXAgfCB1bmRlZmluZWQgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICghYnBNYXApIHtcbiAgICAgIGJwTWFwID0gbmV3IE1hcCgpLnNldChicCwgbmV3IE1hcCgpLnNldChrZXksIHZhbCkpO1xuICAgICAgdGhpcy5lbGVtZW50TWFwLnNldChlbGVtZW50LCBicE1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IChicE1hcC5nZXQoYnApID8/IG5ldyBNYXAoKSkuc2V0KGtleSwgdmFsKTtcbiAgICAgIGJwTWFwLnNldChicCwgdmFsdWVzKTtcbiAgICAgIHRoaXMuZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgYnBNYXApO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoZWxlbWVudCwga2V5KTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUcmFjayBlbGVtZW50IHZhbHVlIGNoYW5nZXMgZm9yIGEgc3BlY2lmaWMga2V5ICovXG4gIHRyYWNrVmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxFbGVtZW50TWF0Y2hlcj4ge1xuICAgIHJldHVybiB0aGlzLnN1YmplY3RcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKGZpbHRlcih2ID0+IHYuZWxlbWVudCA9PT0gZWxlbWVudCAmJiB2LmtleSA9PT0ga2V5KSk7XG4gIH1cblxuICAvKiogdXBkYXRlIGFsbCBzdHlsZXMgZm9yIGFsbCBlbGVtZW50cyBvbiB0aGUgY3VycmVudCBicmVha3BvaW50ICovXG4gIHVwZGF0ZVN0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnRNYXAuZm9yRWFjaCgoYnBNYXAsIGVsKSA9PiB7XG4gICAgICBjb25zdCBrZXlNYXAgPSBuZXcgU2V0KHRoaXMuZWxlbWVudEtleU1hcC5nZXQoZWwpISk7XG4gICAgICBsZXQgdmFsdWVNYXAgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCk7XG5cbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICB2YWx1ZU1hcC5mb3JFYWNoKCh2LCBrKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsLCBrLCB2KTtcbiAgICAgICAgICBrZXlNYXAuZGVsZXRlKGspO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAga2V5TWFwLmZvckVhY2goayA9PiB7XG4gICAgICAgIHZhbHVlTWFwID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGspO1xuICAgICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlTWFwLmdldChrKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWwsIGssIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsZWFyRWxlbWVudChlbCwgayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNsZWFyIHRoZSBzdHlsZXMgZm9yIGEgZ2l2ZW4gZWxlbWVudFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBjbGVhckVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYnVpbGRlcnMgPSB0aGlzLmNsZWFyTWFwLmdldChlbGVtZW50KTtcblxuICAgIGlmIChidWlsZGVycykge1xuICAgICAgY29uc3QgY2xlYXJGbjogQ2xlYXJDYWxsYmFjayA9IGJ1aWxkZXJzLmdldChrZXkpIGFzIENsZWFyQ2FsbGJhY2s7XG4gICAgICBpZiAoISFjbGVhckZuKSB7XG4gICAgICAgIGNsZWFyRm4oKTtcbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoe2VsZW1lbnQsIGtleSwgdmFsdWU6ICcnfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZSBhIGdpdmVuIGVsZW1lbnQgd2l0aCB0aGUgYWN0aXZhdGVkIHZhbHVlcyBmb3IgYSBnaXZlbiBrZXlcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHVwZGF0ZUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgYnVpbGRlcnMgPSB0aGlzLnVwZGF0ZU1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJ1aWxkZXJzKSB7XG4gICAgICBjb25zdCB1cGRhdGVGbjogVXBkYXRlQ2FsbGJhY2sgPSBidWlsZGVycy5nZXQoa2V5KSBhcyBVcGRhdGVDYWxsYmFjaztcbiAgICAgIGlmICghIXVwZGF0ZUZuKSB7XG4gICAgICAgIHVwZGF0ZUZuKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoe2VsZW1lbnQsIGtleSwgdmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmVsZWFzZSBhbGwgcmVmZXJlbmNlcyB0byBhIGdpdmVuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIHJlbGVhc2VFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3Qgd2F0Y2hlck1hcCA9IHRoaXMud2F0Y2hlck1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHdhdGNoZXJNYXApIHtcbiAgICAgIHdhdGNoZXJNYXAuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gICAgICB0aGlzLndhdGNoZXJNYXAuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50TWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoZWxlbWVudE1hcCkge1xuICAgICAgZWxlbWVudE1hcC5mb3JFYWNoKChfLCBzKSA9PiBlbGVtZW50TWFwLmRlbGV0ZShzKSk7XG4gICAgICB0aGlzLmVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0cmlnZ2VyIGFuIHVwZGF0ZSBmb3IgYSBnaXZlbiBlbGVtZW50IGFuZCBrZXkgKGUuZy4gbGF5b3V0KVxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICB0cmlnZ2VyVXBkYXRlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBicE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJwTWFwKSB7XG4gICAgICBjb25zdCB2YWx1ZU1hcCA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrZXkpO1xuICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwga2V5LCB2YWx1ZU1hcC5nZXQoa2V5KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVNYXAuZm9yRWFjaCgodiwgaykgPT4gdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGssIHYpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDcm9zcy1yZWZlcmVuY2UgZm9yIEhUTUxFbGVtZW50IHdpdGggZGlyZWN0aXZlIGtleSAqL1xuICBwcml2YXRlIGJ1aWxkRWxlbWVudEtleU1hcChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpIHtcbiAgICBsZXQga2V5TWFwID0gdGhpcy5lbGVtZW50S2V5TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoIWtleU1hcCkge1xuICAgICAga2V5TWFwID0gbmV3IFNldCgpO1xuICAgICAgdGhpcy5lbGVtZW50S2V5TWFwLnNldChlbGVtZW50LCBrZXlNYXApO1xuICAgIH1cbiAgICBrZXlNYXAuYWRkKGtleSk7XG4gIH1cblxuICAvKipcbiAgICogT3RoZXIgdHJpZ2dlcnMgdGhhdCBzaG91bGQgZm9yY2Ugc3R5bGUgdXBkYXRlczpcbiAgICogLSBkaXJlY3Rpb25hbGl0eVxuICAgKiAtIGxheW91dCBjaGFuZ2VzXG4gICAqIC0gbXV0YXRpb25vYnNlcnZlciB1cGRhdGVzXG4gICAqL1xuICBwcml2YXRlIHdhdGNoRXh0cmFUcmlnZ2VycyhlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJzOiBPYnNlcnZhYmxlPGFueT5bXSkge1xuICAgIGlmICh0cmlnZ2VycyAmJiB0cmlnZ2Vycy5sZW5ndGgpIHtcbiAgICAgIGxldCB3YXRjaGVycyA9IHRoaXMud2F0Y2hlck1hcC5nZXQoZWxlbWVudCk7XG4gICAgICBpZiAoIXdhdGNoZXJzKSB7XG4gICAgICAgIHdhdGNoZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLndhdGNoZXJNYXAuc2V0KGVsZW1lbnQsIHdhdGNoZXJzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHdhdGNoZXJzLmdldChrZXkpO1xuICAgICAgaWYgKCFzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgbmV3U3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4udHJpZ2dlcnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5nZXRWYWx1ZShlbGVtZW50LCBrZXkpO1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrZXksIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3YXRjaGVycy5zZXQoa2V5LCBuZXdTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBCcmVha3BvaW50IGxvY2F0b3IgYnkgbWVkaWFRdWVyeSAqL1xuICBwcml2YXRlIGZpbmRCeVF1ZXJ5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShxdWVyeSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBmYWxsYmFjayBicmVha3BvaW50IGZvciBhIGdpdmVuIGVsZW1lbnQsIHN0YXJ0aW5nIHdpdGggdGhlIGN1cnJlbnQgYnJlYWtwb2ludFxuICAgKiBAcGFyYW0gYnBNYXBcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXA6IEJyZWFrcG9pbnRNYXAsIGtleT86IHN0cmluZyk6IFZhbHVlTWFwIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGFjdGl2YXRlZEJwID0gdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50c1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlTWFwID0gYnBNYXAuZ2V0KGFjdGl2YXRlZEJwLmFsaWFzKTtcblxuICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCAodmFsdWVNYXAuaGFzKGtleSkgJiYgdmFsdWVNYXAuZ2V0KGtleSkgIT0gbnVsbCkpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVNYXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPbiB0aGUgc2VydmVyLCB3ZSBleHBsaWNpdGx5IGhhdmUgYW4gXCJhbGxcIiBzZWN0aW9uIGZpbGxlZCBpbiB0byBiZWdpbiB3aXRoLlxuICAgIC8vIFNvIHdlIGRvbid0IG5lZWQgdG8gYWdncmVzc2l2ZWx5IGZpbmQgYSBmYWxsYmFjayBpZiBubyBleHBsaWNpdCB2YWx1ZSBleGlzdHMuXG4gICAgaWYgKCF0aGlzLl91c2VGYWxsYmFja3MpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEhvcGUgPSBicE1hcC5nZXQoJycpO1xuICAgIHJldHVybiAoa2V5ID09PSB1bmRlZmluZWQgfHwgbGFzdEhvcGUgJiYgbGFzdEhvcGUuaGFzKGtleSkpID8gbGFzdEhvcGUgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2ggZm9yIG1lZGlhUXVlcnkgYnJlYWtwb2ludCBhY3RpdmF0aW9uc1xuICAgKi9cbiAgcHJpdmF0ZSBvYnNlcnZlQWN0aXZhdGlvbnMoKSB7XG4gICAgY29uc3QgcXVlcmllcyA9IHRoaXMuYnJlYWtwb2ludHMuaXRlbXMubWFwKGJwID0+IGJwLm1lZGlhUXVlcnkpO1xuXG4gICAgdGhpcy5ob29rLnJlZ2lzdGVyQmVmb3JlQWZ0ZXJQcmludEhvb2tzKHRoaXMpO1xuICAgIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAub2JzZXJ2ZSh0aGlzLmhvb2sud2l0aFByaW50UXVlcnkocXVlcmllcykpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFwKHRoaXMuaG9vay5pbnRlcmNlcHRFdmVudHModGhpcykpLFxuICAgICAgICAgICAgZmlsdGVyKHRoaXMuaG9vay5ibG9ja1Byb3BhZ2F0aW9uKCkpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLm9uTWVkaWFDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBpbml0QnVpbGRlck1hcChtYXA6IEJ1aWxkZXJNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ/OiBCdWlsZGVyKTogdm9pZCB7XG4gIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb2xkTWFwID0gbWFwLmdldChlbGVtZW50KSA/PyBuZXcgTWFwKCk7XG4gICAgb2xkTWFwLnNldChrZXksIGlucHV0KTtcbiAgICBtYXAuc2V0KGVsZW1lbnQsIG9sZE1hcCk7XG4gIH1cbn1cblxuIl19