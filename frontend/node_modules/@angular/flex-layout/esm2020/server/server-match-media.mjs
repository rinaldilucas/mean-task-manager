/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ɵMatchMedia as MatchMedia, BREAKPOINTS, LAYOUT_CONFIG } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class ServerMediaQueryList {
    constructor(_mediaQuery, _isActive = false) {
        this._mediaQuery = _mediaQuery;
        this._isActive = _isActive;
        this._listeners = [];
        this.onchange = null;
    }
    get matches() {
        return this._isActive;
    }
    get media() {
        return this._mediaQuery;
    }
    /**
     * Destroy the current list by deactivating the
     * listeners and clearing the internal list
     */
    destroy() {
        this.deactivate();
        this._listeners = [];
    }
    /** Notify all listeners that 'matches === TRUE' */
    activate() {
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Notify all listeners that 'matches === false' */
    deactivate() {
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Add a listener to our internal list to activate later */
    addListener(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            const cb = listener;
            cb.call(this, { matches: this.matches, media: this.media });
        }
    }
    /** Don't need to remove listeners in the server environment */
    removeListener() {
    }
    addEventListener() {
    }
    removeEventListener() {
    }
    dispatchEvent(_) {
        return false;
    }
}
/**
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
export class ServerMatchMedia extends MatchMedia {
    constructor(_zone, _platformId, _document, breakpoints, layoutConfig) {
        super(_zone, _platformId, _document);
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this.breakpoints = breakpoints;
        this.layoutConfig = layoutConfig;
        this._activeBreakpoints = [];
        const serverBps = layoutConfig.ssrObserveBreakpoints;
        if (serverBps) {
            this._activeBreakpoints = serverBps
                .reduce((acc, serverBp) => {
                const foundBp = breakpoints.find(bp => serverBp === bp.alias);
                if (!foundBp) {
                    console.warn(`FlexLayoutServerModule: unknown breakpoint alias "${serverBp}"`);
                }
                else {
                    acc.push(foundBp);
                }
                return acc;
            }, []);
        }
    }
    /** Activate the specified breakpoint if we're on the server, no-op otherwise */
    activateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.activate();
        }
    }
    /** Deactivate the specified breakpoint if we're on the server, no-op otherwise */
    deactivateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.deactivate();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        const isActive = this._activeBreakpoints.some(ab => ab.mediaQuery === query);
        return new ServerMediaQueryList(query, isActive);
    }
}
ServerMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: BREAKPOINTS }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
ServerMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [BREAKPOINTS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLW1hdGNoLW1lZGlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9zZXJ2ZXIvc2VydmVyLW1hdGNoLW1lZGlhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBVSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUVMLFdBQVcsSUFBSSxVQUFVLEVBQ3pCLFdBQVcsRUFDWCxhQUFhLEVBRWQsTUFBTSwyQkFBMkIsQ0FBQzs7QUFFbkM7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxvQkFBb0I7SUFXL0IsWUFBb0IsV0FBbUIsRUFBVSxZQUFZLEtBQUs7UUFBOUMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBVjFELGVBQVUsR0FBNkIsRUFBRSxDQUFDO1FBc0VsRCxhQUFRLEdBQTJCLElBQUksQ0FBQztJQTVENkIsQ0FBQztJQVJ0RSxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBSUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsbURBQW1EO0lBQ25ELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEs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O1NBQ1Y7SUFDSCxDQUFDO0lBRUQsZ0ZBQWdGO0lBQ2hGLGtCQUFrQixDQUFDLEVBQWM7UUFDL0IsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUF5QixDQUFDO1FBQ2xGLElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQsa0ZBQWtGO0lBQ2xGLG9CQUFvQixDQUFDLEVBQWM7UUFDakMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUF5QixDQUFDO1FBQ2xGLElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ2dCLFFBQVEsQ0FBQyxLQUFhO1FBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBRTdFLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7NkdBakRVLGdCQUFnQix3Q0FJUCxXQUFXLGFBQ1gsUUFBUSxhQUNSLFdBQVcsYUFDWCxhQUFhO2lIQVB0QixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVTsrRUFLd0QsTUFBTTswQkFBMUQsTUFBTTsyQkFBQyxXQUFXOzswQkFDbEIsTUFBTTsyQkFBQyxRQUFROzswQkFDZixNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCcmVha1BvaW50LFxuICDJtU1hdGNoTWVkaWEgYXMgTWF0Y2hNZWRpYSxcbiAgQlJFQUtQT0lOVFMsXG4gIExBWU9VVF9DT05GSUcsXG4gIExheW91dENvbmZpZ09wdGlvbnNcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbi8qKlxuICogU3BlY2lhbCBzZXJ2ZXItb25seSBjbGFzcyB0byBzaW11bGF0ZSBhIE1lZGlhUXVlcnlMaXN0IGFuZFxuICogLSBzdXBwb3J0cyBtYW51YWwgYWN0aXZhdGlvbiB0byBzaW11bGF0ZSBtZWRpYVF1ZXJ5IG1hdGNoaW5nXG4gKiAtIG1hbmFnZXMgbGlzdGVuZXJzXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdCBpbXBsZW1lbnRzIE1lZGlhUXVlcnlMaXN0IHtcbiAgcHJpdmF0ZSBfbGlzdGVuZXJzOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyW10gPSBbXTtcblxuICBnZXQgbWF0Y2hlcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNBY3RpdmU7XG4gIH1cblxuICBnZXQgbWVkaWEoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVkaWFRdWVyeTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lZGlhUXVlcnk6IHN0cmluZywgcHJpdmF0ZSBfaXNBY3RpdmUgPSBmYWxzZSkge31cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgY3VycmVudCBsaXN0IGJ5IGRlYWN0aXZhdGluZyB0aGVcbiAgICogbGlzdGVuZXJzIGFuZCBjbGVhcmluZyB0aGUgaW50ZXJuYWwgbGlzdFxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBbXTtcbiAgfVxuXG4gIC8qKiBOb3RpZnkgYWxsIGxpc3RlbmVycyB0aGF0ICdtYXRjaGVzID09PSBUUlVFJyAqL1xuICBhY3RpdmF0ZSgpOiBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdCB7XG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IGNiOiAoKHRoaXM6IE1lZGlhUXVlcnlMaXN0LCBldjogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gYW55KSA9IGNhbGxiYWNrITtcbiAgICAgICAgY2IuY2FsbCh0aGlzLCB7bWF0Y2hlczogdGhpcy5tYXRjaGVzLCBtZWRpYTogdGhpcy5tZWRpYX0gYXMgTWVkaWFRdWVyeUxpc3RFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCAnbWF0Y2hlcyA9PT0gZmFsc2UnICovXG4gIGRlYWN0aXZhdGUoKTogU2VydmVyTWVkaWFRdWVyeUxpc3Qge1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zdCBjYjogKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSkgPSBjYWxsYmFjayE7XG4gICAgICAgIGNiLmNhbGwodGhpcywge21hdGNoZXM6IHRoaXMubWF0Y2hlcywgbWVkaWE6IHRoaXMubWVkaWF9IGFzIE1lZGlhUXVlcnlMaXN0RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEFkZCBhIGxpc3RlbmVyIHRvIG91ciBpbnRlcm5hbCBsaXN0IHRvIGFjdGl2YXRlIGxhdGVyICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICBjb25zdCBjYjogKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSkgPSBsaXN0ZW5lciE7XG4gICAgICBjYi5jYWxsKHRoaXMsIHttYXRjaGVzOiB0aGlzLm1hdGNoZXMsIG1lZGlhOiB0aGlzLm1lZGlhfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9uJ3QgbmVlZCB0byByZW1vdmUgbGlzdGVuZXJzIGluIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoKSB7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKCkge1xuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoXzogRXZlbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvbmNoYW5nZTogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lciA9IG51bGw7XG59XG5cbi8qKlxuICogU3BlY2lhbCBzZXJ2ZXItb25seSBpbXBsZW1lbnRhdGlvbiBvZiBNYXRjaE1lZGlhIHRoYXQgdXNlcyB0aGUgYWJvdmVcbiAqIFNlcnZlck1lZGlhUXVlcnlMaXN0IGFzIGl0cyBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuICpcbiAqIEFsc28gY29udGFpbnMgbWV0aG9kcyB0byBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSBicmVha3BvaW50c1xuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmVyTWF0Y2hNZWRpYSBleHRlbmRzIE1hdGNoTWVkaWEge1xuICBwcml2YXRlIF9hY3RpdmVCcmVha3BvaW50czogQnJlYWtQb2ludFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG92ZXJyaWRlIF96b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByb3RlY3RlZCBvdmVycmlkZSBfcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBJbmplY3QoQlJFQUtQT0lOVFMpIHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFtdLFxuICAgICAgICAgICAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnMpIHtcbiAgICBzdXBlcihfem9uZSwgX3BsYXRmb3JtSWQsIF9kb2N1bWVudCk7XG5cbiAgICBjb25zdCBzZXJ2ZXJCcHMgPSBsYXlvdXRDb25maWcuc3NyT2JzZXJ2ZUJyZWFrcG9pbnRzO1xuICAgIGlmIChzZXJ2ZXJCcHMpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZUJyZWFrcG9pbnRzID0gc2VydmVyQnBzXG4gICAgICAgIC5yZWR1Y2UoKGFjYzogQnJlYWtQb2ludFtdLCBzZXJ2ZXJCcDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm91bmRCcCA9IGJyZWFrcG9pbnRzLmZpbmQoYnAgPT4gc2VydmVyQnAgPT09IGJwLmFsaWFzKTtcbiAgICAgICAgICBpZiAoIWZvdW5kQnApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgRmxleExheW91dFNlcnZlck1vZHVsZTogdW5rbm93biBicmVha3BvaW50IGFsaWFzIFwiJHtzZXJ2ZXJCcH1cImApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY2MucHVzaChmb3VuZEJwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBY3RpdmF0ZSB0aGUgc3BlY2lmaWVkIGJyZWFrcG9pbnQgaWYgd2UncmUgb24gdGhlIHNlcnZlciwgbm8tb3Agb3RoZXJ3aXNlICovXG4gIGFjdGl2YXRlQnJlYWtwb2ludChicDogQnJlYWtQb2ludCkge1xuICAgIGNvbnN0IGxvb2t1cEJyZWFrcG9pbnQgPSB0aGlzLnJlZ2lzdHJ5LmdldChicC5tZWRpYVF1ZXJ5KSBhcyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdDtcbiAgICBpZiAobG9va3VwQnJlYWtwb2ludCkge1xuICAgICAgbG9va3VwQnJlYWtwb2ludC5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWFjdGl2YXRlIHRoZSBzcGVjaWZpZWQgYnJlYWtwb2ludCBpZiB3ZSdyZSBvbiB0aGUgc2VydmVyLCBuby1vcCBvdGhlcndpc2UgKi9cbiAgZGVhY3RpdmF0ZUJyZWFrcG9pbnQoYnA6IEJyZWFrUG9pbnQpIHtcbiAgICBjb25zdCBsb29rdXBCcmVha3BvaW50ID0gdGhpcy5yZWdpc3RyeS5nZXQoYnAubWVkaWFRdWVyeSkgYXMgU2VydmVyTWVkaWFRdWVyeUxpc3Q7XG4gICAgaWYgKGxvb2t1cEJyZWFrcG9pbnQpIHtcbiAgICAgIGxvb2t1cEJyZWFrcG9pbnQuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHdpbmRvdy5tYXRjaE1lZGlhKCkgdG8gYnVpbGQgYSBNZWRpYVF1ZXJ5TGlzdDsgd2hpY2hcbiAgICogc3VwcG9ydHMgMC4ubiBsaXN0ZW5lcnMgZm9yIGFjdGl2YXRpb24vZGVhY3RpdmF0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgYnVpbGRNUUwocXVlcnk6IHN0cmluZyk6IFNlcnZlck1lZGlhUXVlcnlMaXN0IHtcbiAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuX2FjdGl2ZUJyZWFrcG9pbnRzLnNvbWUoYWIgPT4gYWIubWVkaWFRdWVyeSA9PT0gcXVlcnkpO1xuXG4gICAgcmV0dXJuIG5ldyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdChxdWVyeSwgaXNBY3RpdmUpO1xuICB9XG59XG5cbnR5cGUgTWVkaWFRdWVyeUxpc3RMaXN0ZW5lciA9ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpIHwgbnVsbDtcbiJdfQ==