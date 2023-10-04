/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatchMedia } from '../match-media';
import * as i0 from "@angular/core";
import * as i1 from "../../breakpoints/break-point-registry";
/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
export class MockMatchMedia extends MatchMedia {
    constructor(_zone, _platformId, _document, _breakpoints) {
        super(_zone, _platformId, _document);
        this._breakpoints = _breakpoints;
        this.autoRegisterQueries = true; // Used for testing BreakPoint registrations
        this.useOverlaps = false; // Allow fallback to overlapping mediaQueries
    }
    /** Easy method to clear all listeners for all mediaQueries */
    clearAll() {
        this.registry.forEach((mql) => {
            mql.destroy();
        });
        this.registry.clear();
        this.useOverlaps = false;
    }
    /** Feature to support manual, simulated activation of a mediaQuery. */
    activate(mediaQuery, useOverlaps = this.useOverlaps) {
        mediaQuery = this._validateQuery(mediaQuery);
        if (useOverlaps || !this.isActive(mediaQuery)) {
            this._deactivateAll();
            this._registerMediaQuery(mediaQuery);
            this._activateWithOverlaps(mediaQuery, useOverlaps);
        }
        return this.hasActivated;
    }
    /** Converts an optional mediaQuery alias to a specific, valid mediaQuery */
    _validateQuery(queryOrAlias) {
        const bp = this._breakpoints.findByAlias(queryOrAlias);
        return bp?.mediaQuery ?? queryOrAlias;
    }
    /**
     * Manually onMediaChange any overlapping mediaQueries to simulate
     * similar functionality in the window.matchMedia()
     */
    _activateWithOverlaps(mediaQuery, useOverlaps) {
        if (useOverlaps) {
            const bp = this._breakpoints.findByQuery(mediaQuery);
            const alias = bp?.alias ?? 'unknown';
            // Simulate activation of overlapping lt-<XXX> ranges
            switch (alias) {
                case 'lg':
                    this._activateByAlias(['lt-xl']);
                    break;
                case 'md':
                    this._activateByAlias(['lt-xl', 'lt-lg']);
                    break;
                case 'sm':
                    this._activateByAlias(['lt-xl', 'lt-lg', 'lt-md']);
                    break;
                case 'xs':
                    this._activateByAlias(['lt-xl', 'lt-lg', 'lt-md', 'lt-sm']);
                    break;
            }
            // Simulate activation of overlapping gt-<xxxx> mediaQuery ranges
            switch (alias) {
                case 'xl':
                    this._activateByAlias(['gt-lg', 'gt-md', 'gt-sm', 'gt-xs']);
                    break;
                case 'lg':
                    this._activateByAlias(['gt-md', 'gt-sm', 'gt-xs']);
                    break;
                case 'md':
                    this._activateByAlias(['gt-sm', 'gt-xs']);
                    break;
                case 'sm':
                    this._activateByAlias(['gt-xs']);
                    break;
            }
        }
        // Activate last since the responsiveActivation is watching *this* mediaQuery
        return this._activateByQuery(mediaQuery);
    }
    /**
     *
     */
    _activateByAlias(aliases) {
        const activate = (alias) => {
            const bp = this._breakpoints.findByAlias(alias);
            this._activateByQuery(bp?.mediaQuery ?? alias);
        };
        aliases.forEach(activate);
    }
    /**
     *
     */
    _activateByQuery(mediaQuery) {
        if (!this.registry.has(mediaQuery) && this.autoRegisterQueries) {
            this._registerMediaQuery(mediaQuery);
        }
        const mql = this.registry.get(mediaQuery);
        if (mql && !this.isActive(mediaQuery)) {
            this.registry.set(mediaQuery, mql.activate());
        }
        return this.hasActivated;
    }
    /** Deactivate all current MQLs and reset the buffer */
    _deactivateAll() {
        this.registry.forEach((it) => {
            it.deactivate();
        });
        return this;
    }
    /** Insure the mediaQuery is registered with MatchMedia */
    _registerMediaQuery(mediaQuery) {
        if (!this.registry.has(mediaQuery) && this.autoRegisterQueries) {
            this.registerQuery(mediaQuery);
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        return new MockMediaQueryList(query);
    }
    get hasActivated() {
        return this.activations.length > 0;
    }
}
MockMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MockMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: i1.BreakPointRegistry }], target: i0.ɵɵFactoryTarget.Injectable });
MockMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MockMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MockMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.BreakPointRegistry }]; } });
/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class MockMediaQueryList {
    constructor(_mediaQuery) {
        this._mediaQuery = _mediaQuery;
        this._isActive = false;
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
    /** Don't need to remove listeners in the testing environment */
    removeListener(_) {
    }
    addEventListener(_, __, ___) {
    }
    removeEventListener(_, __, ___) {
    }
    dispatchEvent(_) {
        return false;
    }
}
/**
 * Pre-configured provider for MockMatchMedia
 */
export const MockMatchMediaProvider = {
    provide: MatchMedia,
    useClass: MockMatchMedia
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay1tYXRjaC1tZWRpYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tYXRjaC1tZWRpYS9tb2NrL21vY2stbWF0Y2gtbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQUcxQzs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGNBQWUsU0FBUSxVQUFVO0lBTTVDLFlBQVksS0FBYSxFQUNRLFdBQW1CLEVBQ3RCLFNBQWMsRUFDeEIsWUFBZ0M7UUFDbEQsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFEbkIsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBTnBELHdCQUFtQixHQUFHLElBQUksQ0FBQyxDQUFHLDRDQUE0QztRQUMxRSxnQkFBVyxHQUFHLEtBQUssQ0FBQyxDQUFVLDZDQUE2QztJQU8zRSxDQUFDO0lBRUQsOERBQThEO0lBQzlELFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQW1CLEVBQUUsRUFBRTtZQUMzQyxHQUEwQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLFFBQVEsQ0FBQyxVQUFrQixFQUFFLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVztRQUN6RCxV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Q0FHRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsT0FBTyxFQUFFLFVBQVU7SUFDbkIsUUFBUSxFQUFFLGNBQWM7Q0FDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeX0gZnJvbSAnLi4vLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuXG4vKipcbiAqIE1vY2tNYXRjaE1lZGlhIG1vY2tzIGNhbGxzIHRvIHRoZSBXaW5kb3cgQVBJIG1hdGNoTWVkaWEgd2l0aCBhIGJ1aWxkIG9mIGEgc2ltdWxhdGVkXG4gKiBNb2NrTWVkaWFRdWVyeUxpc3RlbmVyLiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gc2ltdWxhdGUgYW4gYWN0aXZhdGlvbiBvZiBhIG1lZGlhUXVlcnlcbiAqIHJhbmdlIGFuZCB0byBjbGVhckFsbCBtZWRpYVF1ZXJ5IGxpc3RlbmVycy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1vY2tNYXRjaE1lZGlhIGV4dGVuZHMgTWF0Y2hNZWRpYSB7XG5cblxuICBhdXRvUmVnaXN0ZXJRdWVyaWVzID0gdHJ1ZTsgICAvLyBVc2VkIGZvciB0ZXN0aW5nIEJyZWFrUG9pbnQgcmVnaXN0cmF0aW9uc1xuICB1c2VPdmVybGFwcyA9IGZhbHNlOyAgICAgICAgICAvLyBBbGxvdyBmYWxsYmFjayB0byBvdmVybGFwcGluZyBtZWRpYVF1ZXJpZXNcblxuICBjb25zdHJ1Y3Rvcihfem9uZTogTmdab25lLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBfcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRSZWdpc3RyeSkge1xuICAgIHN1cGVyKF96b25lLCBfcGxhdGZvcm1JZCwgX2RvY3VtZW50KTtcbiAgfVxuXG4gIC8qKiBFYXN5IG1ldGhvZCB0byBjbGVhciBhbGwgbGlzdGVuZXJzIGZvciBhbGwgbWVkaWFRdWVyaWVzICovXG4gIGNsZWFyQWxsKCkge1xuICAgIHRoaXMucmVnaXN0cnkuZm9yRWFjaCgobXFsOiBNZWRpYVF1ZXJ5TGlzdCkgPT4ge1xuICAgICAgKG1xbCBhcyBNb2NrTWVkaWFRdWVyeUxpc3QpLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdHJ5LmNsZWFyKCk7XG4gICAgdGhpcy51c2VPdmVybGFwcyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEZlYXR1cmUgdG8gc3VwcG9ydCBtYW51YWwsIHNpbXVsYXRlZCBhY3RpdmF0aW9uIG9mIGEgbWVkaWFRdWVyeS4gKi9cbiAgYWN0aXZhdGUobWVkaWFRdWVyeTogc3RyaW5nLCB1c2VPdmVybGFwcyA9IHRoaXMudXNlT3ZlcmxhcHMpOiBib29sZWFuIHtcbiAgICBtZWRpYVF1ZXJ5ID0gdGhpcy5fdmFsaWRhdGVRdWVyeShtZWRpYVF1ZXJ5KTtcblxuICAgIGlmICh1c2VPdmVybGFwcyB8fCAhdGhpcy5pc0FjdGl2ZShtZWRpYVF1ZXJ5KSkge1xuICAgICAgdGhpcy5fZGVhY3RpdmF0ZUFsbCgpO1xuXG4gICAgICB0aGlzLl9yZWdpc3Rlck1lZGlhUXVlcnkobWVkaWFRdWVyeSk7XG4gICAgICB0aGlzLl9hY3RpdmF0ZVdpdGhPdmVybGFwcyhtZWRpYVF1ZXJ5LCB1c2VPdmVybGFwcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFzQWN0aXZhdGVkO1xuICB9XG5cbiAgLyoqIENvbnZlcnRzIGFuIG9wdGlvbmFsIG1lZGlhUXVlcnkgYWxpYXMgdG8gYSBzcGVjaWZpYywgdmFsaWQgbWVkaWFRdWVyeSAqL1xuICBfdmFsaWRhdGVRdWVyeShxdWVyeU9yQWxpYXM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgYnAgPSB0aGlzLl9icmVha3BvaW50cy5maW5kQnlBbGlhcyhxdWVyeU9yQWxpYXMpO1xuICAgIHJldHVybiBicD8ubWVkaWFRdWVyeSA/PyBxdWVyeU9yQWxpYXM7XG4gIH1cblxuICAvKipcbiAgICogTWFudWFsbHkgb25NZWRpYUNoYW5nZSBhbnkgb3ZlcmxhcHBpbmcgbWVkaWFRdWVyaWVzIHRvIHNpbXVsYXRlXG4gICAqIHNpbWlsYXIgZnVuY3Rpb25hbGl0eSBpbiB0aGUgd2luZG93Lm1hdGNoTWVkaWEoKVxuICAgKi9cbiAgcHJpdmF0ZSBfYWN0aXZhdGVXaXRoT3ZlcmxhcHMobWVkaWFRdWVyeTogc3RyaW5nLCB1c2VPdmVybGFwczogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGlmICh1c2VPdmVybGFwcykge1xuICAgICAgY29uc3QgYnAgPSB0aGlzLl9icmVha3BvaW50cy5maW5kQnlRdWVyeShtZWRpYVF1ZXJ5KTtcbiAgICAgIGNvbnN0IGFsaWFzID0gYnA/LmFsaWFzID8/ICd1bmtub3duJztcblxuICAgICAgLy8gU2ltdWxhdGUgYWN0aXZhdGlvbiBvZiBvdmVybGFwcGluZyBsdC08WFhYPiByYW5nZXNcbiAgICAgIHN3aXRjaCAoYWxpYXMpIHtcbiAgICAgICAgY2FzZSAnbGcnOlxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlQnlBbGlhcyhbJ2x0LXhsJ10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtZCc6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnbHQteGwnLCAnbHQtbGcnXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NtJzpcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZUJ5QWxpYXMoWydsdC14bCcsICdsdC1sZycsICdsdC1tZCddKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAneHMnOlxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlQnlBbGlhcyhbJ2x0LXhsJywgJ2x0LWxnJywgJ2x0LW1kJywgJ2x0LXNtJ10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBTaW11bGF0ZSBhY3RpdmF0aW9uIG9mIG92ZXJsYXBwaW5nIGd0LTx4eHh4PiBtZWRpYVF1ZXJ5IHJhbmdlc1xuICAgICAgc3dpdGNoIChhbGlhcykge1xuICAgICAgICBjYXNlICd4bCc6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnZ3QtbGcnLCAnZ3QtbWQnLCAnZ3Qtc20nLCAnZ3QteHMnXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2xnJzpcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZUJ5QWxpYXMoWydndC1tZCcsICdndC1zbScsICdndC14cyddKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWQnOlxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlQnlBbGlhcyhbJ2d0LXNtJywgJ2d0LXhzJ10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzbSc6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnZ3QteHMnXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWN0aXZhdGUgbGFzdCBzaW5jZSB0aGUgcmVzcG9uc2l2ZUFjdGl2YXRpb24gaXMgd2F0Y2hpbmcgKnRoaXMqIG1lZGlhUXVlcnlcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVCeVF1ZXJ5KG1lZGlhUXVlcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcml2YXRlIF9hY3RpdmF0ZUJ5QWxpYXMoYWxpYXNlczogc3RyaW5nW10pIHtcbiAgICBjb25zdCBhY3RpdmF0ZSA9IChhbGlhczogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBicCA9IHRoaXMuX2JyZWFrcG9pbnRzLmZpbmRCeUFsaWFzKGFsaWFzKTtcbiAgICAgIHRoaXMuX2FjdGl2YXRlQnlRdWVyeShicD8ubWVkaWFRdWVyeSA/PyBhbGlhcyk7XG4gICAgfTtcbiAgICBhbGlhc2VzLmZvckVhY2goYWN0aXZhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcml2YXRlIF9hY3RpdmF0ZUJ5UXVlcnkobWVkaWFRdWVyeTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlZ2lzdHJ5LmhhcyhtZWRpYVF1ZXJ5KSAmJiB0aGlzLmF1dG9SZWdpc3RlclF1ZXJpZXMpIHtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyTWVkaWFRdWVyeShtZWRpYVF1ZXJ5KTtcbiAgICB9XG4gICAgY29uc3QgbXFsOiBNb2NrTWVkaWFRdWVyeUxpc3QgPSB0aGlzLnJlZ2lzdHJ5LmdldChtZWRpYVF1ZXJ5KSBhcyBNb2NrTWVkaWFRdWVyeUxpc3Q7XG5cbiAgICBpZiAobXFsICYmICF0aGlzLmlzQWN0aXZlKG1lZGlhUXVlcnkpKSB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5LnNldChtZWRpYVF1ZXJ5LCBtcWwuYWN0aXZhdGUoKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmhhc0FjdGl2YXRlZDtcbiAgfVxuXG4gIC8qKiBEZWFjdGl2YXRlIGFsbCBjdXJyZW50IE1RTHMgYW5kIHJlc2V0IHRoZSBidWZmZXIgKi9cbiAgcHJpdmF0ZSBfZGVhY3RpdmF0ZUFsbCgpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5LmZvckVhY2goKGl0OiBNZWRpYVF1ZXJ5TGlzdCkgPT4ge1xuICAgICAgKGl0IGFzIE1vY2tNZWRpYVF1ZXJ5TGlzdCkuZGVhY3RpdmF0ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEluc3VyZSB0aGUgbWVkaWFRdWVyeSBpcyByZWdpc3RlcmVkIHdpdGggTWF0Y2hNZWRpYSAqL1xuICBwcml2YXRlIF9yZWdpc3Rlck1lZGlhUXVlcnkobWVkaWFRdWVyeTogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLnJlZ2lzdHJ5LmhhcyhtZWRpYVF1ZXJ5KSAmJiB0aGlzLmF1dG9SZWdpc3RlclF1ZXJpZXMpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJRdWVyeShtZWRpYVF1ZXJ5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCB3aW5kb3cubWF0Y2hNZWRpYSgpIHRvIGJ1aWxkIGEgTWVkaWFRdWVyeUxpc3Q7IHdoaWNoXG4gICAqIHN1cHBvcnRzIDAuLm4gbGlzdGVuZXJzIGZvciBhY3RpdmF0aW9uL2RlYWN0aXZhdGlvblxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGJ1aWxkTVFMKHF1ZXJ5OiBzdHJpbmcpOiBNZWRpYVF1ZXJ5TGlzdCB7XG4gICAgcmV0dXJuIG5ldyBNb2NrTWVkaWFRdWVyeUxpc3QocXVlcnkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBoYXNBY3RpdmF0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGlvbnMubGVuZ3RoID4gMDtcbiAgfVxuXG59XG5cbi8qKlxuICogU3BlY2lhbCBpbnRlcm5hbCBjbGFzcyB0byBzaW11bGF0ZSBhIE1lZGlhUXVlcnlMaXN0IGFuZFxuICogLSBzdXBwb3J0cyBtYW51YWwgYWN0aXZhdGlvbiB0byBzaW11bGF0ZSBtZWRpYVF1ZXJ5IG1hdGNoaW5nXG4gKiAtIG1hbmFnZXMgbGlzdGVuZXJzXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2NrTWVkaWFRdWVyeUxpc3QgaW1wbGVtZW50cyBNZWRpYVF1ZXJ5TGlzdCB7XG4gIHByaXZhdGUgX2lzQWN0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgX2xpc3RlbmVyczogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lcltdID0gW107XG5cbiAgZ2V0IG1hdGNoZXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlO1xuICB9XG5cbiAgZ2V0IG1lZGlhKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lZGlhUXVlcnk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZWRpYVF1ZXJ5OiBzdHJpbmcpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjdXJyZW50IGxpc3QgYnkgZGVhY3RpdmF0aW5nIHRoZVxuICAgKiBsaXN0ZW5lcnMgYW5kIGNsZWFyaW5nIHRoZSBpbnRlcm5hbCBsaXN0XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgLyoqIE5vdGlmeSBhbGwgbGlzdGVuZXJzIHRoYXQgJ21hdGNoZXMgPT09IFRSVUUnICovXG4gIGFjdGl2YXRlKCk6IE1vY2tNZWRpYVF1ZXJ5TGlzdCB7XG4gICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IGNiOiAoKHRoaXM6IE1lZGlhUXVlcnlMaXN0LCBldjogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gYW55KSA9IGNhbGxiYWNrITtcbiAgICAgICAgY2IuY2FsbCh0aGlzLCB7bWF0Y2hlczogdGhpcy5tYXRjaGVzLCBtZWRpYTogdGhpcy5tZWRpYX0gYXMgTWVkaWFRdWVyeUxpc3RFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCAnbWF0Y2hlcyA9PT0gZmFsc2UnICovXG4gIGRlYWN0aXZhdGUoKTogTW9ja01lZGlhUXVlcnlMaXN0IHtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgY2I6ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpID0gY2FsbGJhY2shO1xuICAgICAgICBjYi5jYWxsKHRoaXMsIHttYXRjaGVzOiB0aGlzLm1hdGNoZXMsIG1lZGlhOiB0aGlzLm1lZGlhfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBsaXN0ZW5lciB0byBvdXIgaW50ZXJuYWwgbGlzdCB0byBhY3RpdmF0ZSBsYXRlciAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgY29uc3QgY2I6ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpID0gbGlzdGVuZXIhO1xuICAgICAgY2IuY2FsbCh0aGlzLCB7bWF0Y2hlczogdGhpcy5tYXRjaGVzLCBtZWRpYTogdGhpcy5tZWRpYX0gYXMgTWVkaWFRdWVyeUxpc3RFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvbid0IG5lZWQgdG8gcmVtb3ZlIGxpc3RlbmVycyBpbiB0aGUgdGVzdGluZyBlbnZpcm9ubWVudCAqL1xuICByZW1vdmVMaXN0ZW5lcihfOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyIHwgbnVsbCkge1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgTWVkaWFRdWVyeUxpc3RFdmVudE1hcD4oXG4gICAgICBfOiBLLFxuICAgICAgX186ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCxcbiAgICAgIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwW0tdKSA9PiBhbnksXG4gICAgICBfX18/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xuXG4gIGFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBfOiBzdHJpbmcsXG4gICAgICBfXzogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCxcbiAgICAgIF9fXz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucykge1xuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxLIGV4dGVuZHMga2V5b2YgTWVkaWFRdWVyeUxpc3RFdmVudE1hcD4oXG4gICAgICBfOiBLLFxuICAgICAgX186ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCxcbiAgICAgIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwW0tdKSA9PiBhbnksXG4gICAgICBfX18/OiBib29sZWFuIHwgRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBfOiBzdHJpbmcsXG4gICAgICBfXzogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCxcbiAgICAgIF9fXz86IGJvb2xlYW4gfCBFdmVudExpc3RlbmVyT3B0aW9ucykge1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChfOiBFdmVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG9uY2hhbmdlOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyID0gbnVsbDtcbn1cblxuLyoqXG4gKiBQcmUtY29uZmlndXJlZCBwcm92aWRlciBmb3IgTW9ja01hdGNoTWVkaWFcbiAqL1xuZXhwb3J0IGNvbnN0IE1vY2tNYXRjaE1lZGlhUHJvdmlkZXIgPSB7ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJvdmlkZTogTWF0Y2hNZWRpYSxcbiAgdXNlQ2xhc3M6IE1vY2tNYXRjaE1lZGlhXG59O1xuXG50eXBlIE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgPSAoKHRoaXM6IE1lZGlhUXVlcnlMaXN0LCBldjogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gYW55KSB8IG51bGw7XG4iXX0=