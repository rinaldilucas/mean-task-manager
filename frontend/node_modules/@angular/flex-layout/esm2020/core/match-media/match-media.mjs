/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MediaChange } from '../media-change';
import * as i0 from "@angular/core";
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
export class MatchMedia {
    constructor(_zone, _platformId, _document) {
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        /** Initialize source with 'all' so all non-responsive APIs trigger style updates */
        this.source = new BehaviorSubject(new MediaChange(true));
        this.registry = new Map();
        this.pendingRemoveListenerFns = [];
        this._observable$ = this.source.asObservable();
    }
    /**
     * Publish list of all current activations
     */
    get activations() {
        const results = [];
        this.registry.forEach((mql, key) => {
            if (mql.matches) {
                results.push(key);
            }
        });
        return results;
    }
    /**
     * For the specified mediaQuery?
     */
    isActive(mediaQuery) {
        const mql = this.registry.get(mediaQuery);
        return mql?.matches ?? this.registerQuery(mediaQuery).some(m => m.matches);
    }
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * Use deferred registration process to register breakpoints only on subscription
     * This logic also enforces logic to register all mediaQueries BEFORE notify
     * subscribers of notifications.
     */
    observe(mqList, filterOthers = false) {
        if (mqList && mqList.length) {
            const matchMedia$ = this._observable$.pipe(filter((change) => !filterOthers ? true : (mqList.indexOf(change.mediaQuery) > -1)));
            const registration$ = new Observable((observer) => {
                const matches = this.registerQuery(mqList);
                if (matches.length) {
                    const lastChange = matches.pop();
                    matches.forEach((e) => {
                        observer.next(e);
                    });
                    this.source.next(lastChange); // last match is cached
                }
                observer.complete();
            });
            return merge(registration$, matchMedia$);
        }
        return this._observable$;
    }
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique
     * mediaQuery. Each listener emits specific MediaChange data to observers
     */
    registerQuery(mediaQuery) {
        const list = Array.isArray(mediaQuery) ? mediaQuery : [mediaQuery];
        const matches = [];
        buildQueryCss(list, this._document);
        list.forEach((query) => {
            const onMQLEvent = (e) => {
                this._zone.run(() => this.source.next(new MediaChange(e.matches, query)));
            };
            let mql = this.registry.get(query);
            if (!mql) {
                mql = this.buildMQL(query);
                mql.addListener(onMQLEvent);
                this.pendingRemoveListenerFns.push(() => mql.removeListener(onMQLEvent));
                this.registry.set(query, mql);
            }
            if (mql.matches) {
                matches.push(new MediaChange(true, query));
            }
        });
        return matches;
    }
    ngOnDestroy() {
        let fn;
        while (fn = this.pendingRemoveListenerFns.pop()) {
            fn();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        return constructMql(query, isPlatformBrowser(this._platformId));
    }
}
MatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
MatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatchMedia, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatchMedia, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};
/**
 * For Webkit engines that only trigger the MediaQueryList Listener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param mediaQueries
 * @param _document
 */
function buildQueryCss(mediaQueries, _document) {
    const list = mediaQueries.filter(it => !ALL_STYLES[it]);
    if (list.length > 0) {
        const query = list.join(', ');
        try {
            const styleEl = _document.createElement('style');
            styleEl.setAttribute('type', 'text/css');
            if (!styleEl.styleSheet) {
                const cssText = `
/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
`;
                styleEl.appendChild(_document.createTextNode(cssText));
            }
            _document.head.appendChild(styleEl);
            // Store in private global registry
            list.forEach(mq => ALL_STYLES[mq] = styleEl);
        }
        catch (e) {
            console.error(e);
        }
    }
}
function constructMql(query, isBrowser) {
    const canListen = isBrowser && !!window.matchMedia('all').addListener;
    return canListen ? window.matchMedia(query) : {
        matches: query === 'all' || query === '',
        media: query,
        addListener: () => {
        },
        removeListener: () => {
        },
        onchange: null,
        addEventListener() {
        },
        removeEventListener() {
        },
        dispatchEvent() {
            return false;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtbWVkaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWF0Y2gtbWVkaWEvbWF0Y2gtbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQXFCLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFXLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7O0FBRTVDOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxVQUFVO0lBTXJCLFlBQXNCLEtBQWEsRUFDUSxXQUFtQixFQUN0QixTQUFjO1FBRmhDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDUSxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUN0QixjQUFTLEdBQVQsU0FBUyxDQUFLO1FBUHRELG9GQUFvRjtRQUMzRSxXQUFNLEdBQUcsSUFBSSxlQUFlLENBQWMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRSxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFDNUIsNkJBQXdCLEdBQXNCLEVBQUUsQ0FBQztRQW9IeEQsaUJBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBL0dwRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFdBQVc7UUFDYixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMs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QztRQUN0RCxPQUFPLEVBQUUsS0FBSyxLQUFLLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRTtRQUN4QyxLQUFLLEVBQUUsS0FBSztRQUNaLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDbEIsQ0FBQztRQUNELGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDckIsQ0FBQztRQUNELFFBQVEsRUFBRSxJQUFJO1FBQ2QsZ0JBQWdCO1FBQ2hCLENBQUM7UUFDRCxtQkFBbUI7UUFDbkIsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FDZ0IsQ0FBQztBQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3ksIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG1lcmdlLCBPYnNlcnZlcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG4vKipcbiAqIE1lZGlhTW9uaXRvciBjb25maWd1cmVzIGxpc3RlbmVycyB0byBtZWRpYVF1ZXJ5IGNoYW5nZXMgYW5kIHB1Ymxpc2hlcyBhbiBPYnNlcnZhYmxlIGZhY2FkZSB0b1xuICogY29udmVydCBtZWRpYVF1ZXJ5IGNoYW5nZSBjYWxsYmFja3MgdG8gc3Vic2NyaWJlciBub3RpZmljYXRpb25zLiBUaGVzZSBub3RpZmljYXRpb25zIHdpbGwgYmVcbiAqIHBlcmZvcm1lZCB3aXRoaW4gdGhlIG5nIFpvbmUgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9ucyBhbmQgY29tcG9uZW50IHVwZGF0ZXMuXG4gKlxuICogTk9URTogYm90aCBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIGFuZCBkZS1hY3RpdmF0aW9ucyBhcmUgYW5ub3VuY2VkIGluIG5vdGlmaWNhdGlvbnNcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWF0Y2hNZWRpYSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBJbml0aWFsaXplIHNvdXJjZSB3aXRoICdhbGwnIHNvIGFsbCBub24tcmVzcG9uc2l2ZSBBUElzIHRyaWdnZXIgc3R5bGUgdXBkYXRlcyAqL1xuICByZWFkb25seSBzb3VyY2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE1lZGlhQ2hhbmdlPihuZXcgTWVkaWFDaGFuZ2UodHJ1ZSkpO1xuICByZWdpc3RyeSA9IG5ldyBNYXA8c3RyaW5nLCBNZWRpYVF1ZXJ5TGlzdD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBwZW5kaW5nUmVtb3ZlTGlzdGVuZXJGbnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF96b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByb3RlY3RlZCBfcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcm90ZWN0ZWQgX2RvY3VtZW50OiBhbnkpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaXNoIGxpc3Qgb2YgYWxsIGN1cnJlbnQgYWN0aXZhdGlvbnNcbiAgICovXG4gIGdldCBhY3RpdmF0aW9ucygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0czogc3RyaW5nW10gPSBbXTtcbiAgICB0aGlzLnJlZ2lzdHJ5LmZvckVhY2goKG1xbDogTWVkaWFRdWVyeUxpc3QsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAobXFsLm1hdGNoZXMpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICAvKipcbiAgICogRm9yIHRoZSBzcGVjaWZpZWQgbWVkaWFRdWVyeT9cbiAgICovXG4gIGlzQWN0aXZlKG1lZGlhUXVlcnk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1xbCA9IHRoaXMucmVnaXN0cnkuZ2V0KG1lZGlhUXVlcnkpO1xuICAgIHJldHVybiBtcWw/Lm1hdGNoZXMgPz8gdGhpcy5yZWdpc3RlclF1ZXJ5KG1lZGlhUXVlcnkpLnNvbWUobSA9PiBtLm1hdGNoZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIG9ic2VydmVycyBjYW4gd2F0Y2ggZm9yIGFsbCAob3IgYSBzcGVjaWZpYykgbXFsIGNoYW5nZXMuXG4gICAqXG4gICAqIElmIGEgbWVkaWFRdWVyeSBpcyBub3Qgc3BlY2lmaWVkLCB0aGVuIEFMTCBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIHdpbGxcbiAgICogYmUgYW5ub3VuY2VkLlxuICAgKi9cbiAgb2JzZXJ2ZSgpOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlPjtcbiAgb2JzZXJ2ZShtZWRpYVF1ZXJpZXM6IHN0cmluZ1tdKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT47XG4gIG9ic2VydmUobWVkaWFRdWVyaWVzOiBzdHJpbmdbXSwgZmlsdGVyT3RoZXJzOiBib29sZWFuKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT47XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIG9ic2VydmVycyBjYW4gd2F0Y2ggZm9yIGFsbCAob3IgYSBzcGVjaWZpYykgbXFsIGNoYW5nZXMuXG4gICAqIFR5cGljYWxseSB1c2VkIGJ5IHRoZSBNZWRpYVF1ZXJ5QWRhcHRvcjsgb3B0aW9uYWxseSBhdmFpbGFibGUgdG8gY29tcG9uZW50c1xuICAgKiB3aG8gd2lzaCB0byB1c2UgdGhlIE1lZGlhTW9uaXRvciBhcyBtZWRpYU1vbml0b3IkIG9ic2VydmFibGUgc2VydmljZS5cbiAgICpcbiAgICogVXNlIGRlZmVycmVkIHJlZ2lzdHJhdGlvbiBwcm9jZXNzIHRvIHJlZ2lzdGVyIGJyZWFrcG9pbnRzIG9ubHkgb24gc3Vic2NyaXB0aW9uXG4gICAqIFRoaXMgbG9naWMgYWxzbyBlbmZvcmNlcyBsb2dpYyB0byByZWdpc3RlciBhbGwgbWVkaWFRdWVyaWVzIEJFRk9SRSBub3RpZnlcbiAgICogc3Vic2NyaWJlcnMgb2Ygbm90aWZpY2F0aW9ucy5cbiAgICovXG4gIG9ic2VydmUobXFMaXN0Pzogc3RyaW5nW10sIGZpbHRlck90aGVycyA9IGZhbHNlKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT4ge1xuICAgIGlmIChtcUxpc3QgJiYgbXFMaXN0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgbWF0Y2hNZWRpYSQ6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+ID0gdGhpcy5fb2JzZXJ2YWJsZSQucGlwZShcbiAgICAgICAgICBmaWx0ZXIoKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+XG4gICAgICAgICAgICAhZmlsdGVyT3RoZXJzID8gdHJ1ZSA6IChtcUxpc3QuaW5kZXhPZihjaGFuZ2UubWVkaWFRdWVyeSkgPiAtMSkpXG4gICAgICApO1xuICAgICAgY29uc3QgcmVnaXN0cmF0aW9uJDogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT4gPSBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IE9ic2VydmVyPE1lZGlhQ2hhbmdlPikgPT4geyAgLy8gdHNsaW50OmRpc2FibGUtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgY29uc3QgbWF0Y2hlczogQXJyYXk8TWVkaWFDaGFuZ2U+ID0gdGhpcy5yZWdpc3RlclF1ZXJ5KG1xTGlzdCk7XG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IGxhc3RDaGFuZ2UgPSBtYXRjaGVzLnBvcCgpITtcbiAgICAgICAgICBtYXRjaGVzLmZvckVhY2goKGU6IE1lZGlhQ2hhbmdlKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuc291cmNlLm5leHQobGFzdENoYW5nZSk7IC8vIGxhc3QgbWF0Y2ggaXMgY2FjaGVkXG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1lcmdlKHJlZ2lzdHJhdGlvbiQsIG1hdGNoTWVkaWEkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb2JzZXJ2YWJsZSQ7XG4gIH1cblxuICAvKipcbiAgICogQmFzZWQgb24gdGhlIEJyZWFrUG9pbnRSZWdpc3RyeSBwcm92aWRlciwgcmVnaXN0ZXIgaW50ZXJuYWwgbGlzdGVuZXJzIGZvciBlYWNoIHVuaXF1ZVxuICAgKiBtZWRpYVF1ZXJ5LiBFYWNoIGxpc3RlbmVyIGVtaXRzIHNwZWNpZmljIE1lZGlhQ2hhbmdlIGRhdGEgdG8gb2JzZXJ2ZXJzXG4gICAqL1xuICByZWdpc3RlclF1ZXJ5KG1lZGlhUXVlcnk6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgbGlzdCA9IEFycmF5LmlzQXJyYXkobWVkaWFRdWVyeSkgPyBtZWRpYVF1ZXJ5IDogW21lZGlhUXVlcnldO1xuICAgIGNvbnN0IG1hdGNoZXM6IE1lZGlhQ2hhbmdlW10gPSBbXTtcblxuICAgIGJ1aWxkUXVlcnlDc3MobGlzdCwgdGhpcy5fZG9jdW1lbnQpO1xuXG4gICAgbGlzdC5mb3JFYWNoKChxdWVyeTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBvbk1RTEV2ZW50ID0gKGU6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4gdGhpcy5zb3VyY2UubmV4dChuZXcgTWVkaWFDaGFuZ2UoZS5tYXRjaGVzLCBxdWVyeSkpKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBtcWwgPSB0aGlzLnJlZ2lzdHJ5LmdldChxdWVyeSk7XG4gICAgICBpZiAoIW1xbCkge1xuICAgICAgICBtcWwgPSB0aGlzLmJ1aWxkTVFMKHF1ZXJ5KTtcbiAgICAgICAgbXFsLmFkZExpc3RlbmVyKG9uTVFMRXZlbnQpO1xuICAgICAgICB0aGlzLnBlbmRpbmdSZW1vdmVMaXN0ZW5lckZucy5wdXNoKCgpID0+IG1xbCEucmVtb3ZlTGlzdGVuZXIob25NUUxFdmVudCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5LnNldChxdWVyeSwgbXFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1xbC5tYXRjaGVzKSB7XG4gICAgICAgIG1hdGNoZXMucHVzaChuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgcXVlcnkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaGVzO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgbGV0IGZuO1xuICAgIHdoaWxlIChmbiA9IHRoaXMucGVuZGluZ1JlbW92ZUxpc3RlbmVyRm5zLnBvcCgpKSB7XG4gICAgICBmbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHdpbmRvdy5tYXRjaE1lZGlhKCkgdG8gYnVpbGQgYSBNZWRpYVF1ZXJ5TGlzdDsgd2hpY2hcbiAgICogc3VwcG9ydHMgMC4ubiBsaXN0ZW5lcnMgZm9yIGFjdGl2YXRpb24vZGVhY3RpdmF0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgYnVpbGRNUUwocXVlcnk6IHN0cmluZyk6IE1lZGlhUXVlcnlMaXN0IHtcbiAgICByZXR1cm4gY29uc3RydWN0TXFsKHF1ZXJ5LCBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX29ic2VydmFibGUkID0gdGhpcy5zb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG59XG5cbi8qKlxuICogUHJpdmF0ZSBnbG9iYWwgcmVnaXN0cnkgZm9yIGFsbCBkeW5hbWljYWxseS1jcmVhdGVkLCBpbmplY3RlZCBzdHlsZSB0YWdzXG4gKiBAc2VlIHByZXBhcmUocXVlcnkpXG4gKi9cbmNvbnN0IEFMTF9TVFlMRVM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuLyoqXG4gKiBGb3IgV2Via2l0IGVuZ2luZXMgdGhhdCBvbmx5IHRyaWdnZXIgdGhlIE1lZGlhUXVlcnlMaXN0IExpc3RlbmVyXG4gKiB3aGVuIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSByZXNwZWN0aXZlIG1lZGlhIHF1ZXJ5LlxuICpcbiAqIEBwYXJhbSBtZWRpYVF1ZXJpZXNcbiAqIEBwYXJhbSBfZG9jdW1lbnRcbiAqL1xuZnVuY3Rpb24gYnVpbGRRdWVyeUNzcyhtZWRpYVF1ZXJpZXM6IHN0cmluZ1tdLCBfZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gIGNvbnN0IGxpc3QgPSBtZWRpYVF1ZXJpZXMuZmlsdGVyKGl0ID0+ICFBTExfU1RZTEVTW2l0XSk7XG4gIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBxdWVyeSA9IGxpc3Quam9pbignLCAnKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdHlsZUVsID0gX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICAgIHN0eWxlRWwuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICBpZiAoIShzdHlsZUVsIGFzIGFueSkuc3R5bGVTaGVldCkge1xuICAgICAgICBjb25zdCBjc3NUZXh0ID0gYFxuLypcbiAgQGFuZ3VsYXIvZmxleC1sYXlvdXQgLSB3b3JrYXJvdW5kIGZvciBwb3NzaWJsZSBicm93c2VyIHF1aXJrIHdpdGggbWVkaWFRdWVyeSBsaXN0ZW5lcnNcbiAgc2VlIGh0dHA6Ly9iaXQubHkvMnNkNEhNUFxuKi9cbkBtZWRpYSAke3F1ZXJ5fSB7LmZ4LXF1ZXJ5LXRlc3R7IH19XG5gO1xuICAgICAgICBzdHlsZUVsLmFwcGVuZENoaWxkKF9kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gICAgICB9XG5cbiAgICAgIF9kb2N1bWVudC5oZWFkIS5hcHBlbmRDaGlsZChzdHlsZUVsKTtcblxuICAgICAgLy8gU3RvcmUgaW4gcHJpdmF0ZSBnbG9iYWwgcmVnaXN0cnlcbiAgICAgIGxpc3QuZm9yRWFjaChtcSA9PiBBTExfU1RZTEVTW21xXSA9IHN0eWxlRWwpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uc3RydWN0TXFsKHF1ZXJ5OiBzdHJpbmcsIGlzQnJvd3NlcjogYm9vbGVhbik6IE1lZGlhUXVlcnlMaXN0IHtcbiAgY29uc3QgY2FuTGlzdGVuID0gaXNCcm93c2VyICYmICEhKDxXaW5kb3c+d2luZG93KS5tYXRjaE1lZGlhKCdhbGwnKS5hZGRMaXN0ZW5lcjtcblxuICByZXR1cm4gY2FuTGlzdGVuID8gKDxXaW5kb3c+d2luZG93KS5tYXRjaE1lZGlhKHF1ZXJ5KSA6IHtcbiAgICBtYXRjaGVzOiBxdWVyeSA9PT0gJ2FsbCcgfHwgcXVlcnkgPT09ICcnLFxuICAgIG1lZGlhOiBxdWVyeSxcbiAgICBhZGRMaXN0ZW5lcjogKCkgPT4ge1xuICAgIH0sXG4gICAgcmVtb3ZlTGlzdGVuZXI6ICgpID0+IHtcbiAgICB9LFxuICAgIG9uY2hhbmdlOiBudWxsLFxuICAgIGFkZEV2ZW50TGlzdGVuZXIoKSB7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyKCkge1xuICAgIH0sXG4gICAgZGlzcGF0Y2hFdmVudCgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gYXMgTWVkaWFRdWVyeUxpc3Q7XG59XG4iXX0=