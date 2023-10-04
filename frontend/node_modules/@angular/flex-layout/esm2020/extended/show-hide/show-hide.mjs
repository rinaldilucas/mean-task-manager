/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, PLATFORM_ID, Injectable, } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BaseDirective2, LAYOUT_CONFIG, SERVER_TOKEN, StyleBuilder, } from '@angular/flex-layout/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class ShowHideStyleBuilder extends StyleBuilder {
    buildStyles(show, parent) {
        const shouldShow = show === 'true';
        return { 'display': shouldShow ? parent.display || (parent.isServer ? 'initial' : '') : 'none' };
    }
}
ShowHideStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ShowHideStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ShowHideStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ShowHideStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ShowHideStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ShowHideDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal, layoutConfig, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.layoutConfig = layoutConfig;
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'show-hide';
        /** Original DOM Element CSS display style */
        this.display = '';
        this.hasLayout = false;
        this.hasFlexChild = false;
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    ngAfterViewInit() {
        this.trackExtraTriggers();
        const children = Array.from(this.nativeElement.children);
        for (let i = 0; i < children.length; i++) {
            if (this.marshal.hasValue(children[i], 'flex')) {
                this.hasFlexChild = true;
                break;
            }
        }
        if (DISPLAY_MAP.has(this.nativeElement)) {
            this.display = DISPLAY_MAP.get(this.nativeElement);
        }
        else {
            this.display = this.getDisplayStyle();
            DISPLAY_MAP.set(this.nativeElement, this.display);
        }
        this.init();
        // set the default to show unless explicitly overridden
        const defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
        if (defaultValue === undefined || defaultValue === '') {
            this.setValue(true, '');
        }
        else {
            this.triggerUpdate();
        }
    }
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes) {
        Object.keys(changes).forEach(key => {
            if (this.inputs.indexOf(key) !== -1) {
                const inputKey = key.split('.');
                const bp = inputKey.slice(1).join('.');
                const inputValue = changes[key].currentValue;
                let shouldShow = inputValue !== '' ?
                    inputValue !== 0 ? coerceBooleanProperty(inputValue) : false
                    : true;
                if (inputKey[0] === 'fxHide') {
                    shouldShow = !shouldShow;
                }
                this.setValue(shouldShow, bp);
            }
        });
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *  Watch for these extra triggers to update fxShow, fxHide stylings
     */
    trackExtraTriggers() {
        this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');
        ['layout', 'layout-align'].forEach(key => {
            this.marshal
                .trackValue(this.nativeElement, key)
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        });
    }
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     */
    getDisplayStyle() {
        return (this.hasLayout || (this.hasFlexChild && this.layoutConfig.addFlexToParent)) ?
            'flex' : this.styler.lookupStyle(this.nativeElement, 'display', true);
    }
    /** Validate the visibility value and then update the host's inline display style */
    updateWithValue(value = true) {
        if (value === '') {
            return;
        }
        const isServer = isPlatformServer(this.platformId);
        this.addStyles(value ? 'true' : 'false', { display: this.display, isServer });
        if (isServer && this.serverModuleLoaded) {
            this.nativeElement.style.setProperty('display', '');
        }
        this.marshal.triggerUpdate(this.parentElement, 'layout-gap');
    }
}
ShowHideDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ShowHideDirective, deps: [{ token: i0.ElementRef }, { token: ShowHideStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: LAYOUT_CONFIG }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive });
ShowHideDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: ShowHideDirective, usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ShowHideDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ShowHideStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }]; } });
const DISPLAY_MAP = new WeakMap();
const inputs = [
    'fxShow', 'fxShow.print',
    'fxShow.xs', 'fxShow.sm', 'fxShow.md', 'fxShow.lg', 'fxShow.xl',
    'fxShow.lt-sm', 'fxShow.lt-md', 'fxShow.lt-lg', 'fxShow.lt-xl',
    'fxShow.gt-xs', 'fxShow.gt-sm', 'fxShow.gt-md', 'fxShow.gt-lg',
    'fxHide', 'fxHide.print',
    'fxHide.xs', 'fxHide.sm', 'fxHide.md', 'fxHide.lg', 'fxHide.xl',
    'fxHide.lt-sm', 'fxHide.lt-md', 'fxHide.lt-lg', 'fxHide.lt-xl',
    'fxHide.gt-xs', 'fxHide.gt-sm', 'fxHide.gt-md', 'fxHide.gt-lg'
];
const selector = `
  [fxShow], [fxShow.print],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide], [fxHide.print],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`;
/**
 * 'show' Layout API directive
 */
export class DefaultShowHideDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultShowHideDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultShowHideDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultShowHideDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultShowHideDirective, selector: "\n  [fxShow], [fxShow.print],\n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],\n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide], [fxHide.print],\n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],\n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n", inputs: { fxShow: "fxShow", "fxShow.print": "fxShow.print", "fxShow.xs": "fxShow.xs", "fxShow.sm": "fxShow.sm", "fxShow.md": "fxShow.md", "fxShow.lg": "fxShow.lg", "fxShow.xl": "fxShow.xl", "fxShow.lt-sm": "fxShow.lt-sm", "fxShow.lt-md": "fxShow.lt-md", "fxShow.lt-lg": "fxShow.lt-lg", "fxShow.lt-xl": "fxShow.lt-xl", "fxShow.gt-xs": "fxShow.gt-xs", "fxShow.gt-sm": "fxShow.gt-sm", "fxShow.gt-md": "fxShow.gt-md", "fxShow.gt-lg": "fxShow.gt-lg", fxHide: "fxHide", "fxHide.print": "fxHide.print", "fxHide.xs": "fxHide.xs", "fxHide.sm": "fxHide.sm", "fxHide.md": "fxHide.md", "fxHide.lg": "fxHide.lg", "fxHide.xl": "fxHide.xl", "fxHide.lt-sm": "fxHide.lt-sm", "fxHide.lt-md": "fxHide.lt-md", "fxHide.lt-lg": "fxHide.lt-lg", "fxHide.lt-xl": "fxHide.lt-xl", "fxHide.gt-xs": "fxHide.gt-xs", "fxHide.gt-sm": "fxHide.gt-sm", "fxHide.gt-md": "fxHide.gt-md", "fxHide.gt-lg": "fxHide.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultShowHideDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1oaWRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9leHRlbmRlZC9zaG93LWhpZGUvc2hvdy1oaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxTQUFTLEVBSVQsTUFBTSxFQUNOLFdBQVcsRUFDWCxVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUNMLGNBQWMsRUFDZCxhQUFhLEVBR2IsWUFBWSxFQUVaLFlBQVksR0FDYixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBUXpDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxZQUFZO0lBQ3BELFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBc0I7UUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLE1BQU0sQ0FBQztRQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ2pHLENBQUM7O2lIQUpVLG9CQUFvQjtxSEFBcEIsb0JBQW9CLGNBRFIsTUFBTTsyRkFDbEIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFTaEMsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGNBQWM7SUFRbkQsWUFBWSxVQUFzQixFQUN0QixZQUFrQyxFQUNsQyxN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QVc7SUFDL0QsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYztJQUM5RCxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0NBQy9ELENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRzs7Ozs7Ozs7O0NBU2hCLENBQUM7QUFFRjs7R0FFRztBQUVILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxpQkFBaUI7SUFEL0Q7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7O3FIQUZZLHdCQUF3Qjt5R0FBeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBRHBDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgSW5qZWN0LFxuICBQTEFURk9STV9JRCxcbiAgSW5qZWN0YWJsZSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTRVJWRVJfVE9LRU4sXG4gIFN0eWxlVXRpbHMsXG4gIFN0eWxlQnVpbGRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2hvd0hpZGVQYXJlbnQge1xuICBkaXNwbGF5OiBzdHJpbmc7XG4gIGlzU2VydmVyOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBTaG93SGlkZVN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKHNob3c6IHN0cmluZywgcGFyZW50OiBTaG93SGlkZVBhcmVudCkge1xuICAgIGNvbnN0IHNob3VsZFNob3cgPSBzaG93ID09PSAndHJ1ZSc7XG4gICAgcmV0dXJuIHsnZGlzcGxheSc6IHNob3VsZFNob3cgPyBwYXJlbnQuZGlzcGxheSB8fCAocGFyZW50LmlzU2VydmVyID8gJ2luaXRpYWwnIDogJycpIDogJ25vbmUnfTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBTaG93SGlkZURpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnc2hvdy1oaWRlJztcblxuICAvKiogT3JpZ2luYWwgRE9NIEVsZW1lbnQgQ1NTIGRpc3BsYXkgc3R5bGUgKi9cbiAgcHJvdGVjdGVkIGRpc3BsYXk6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgaGFzTGF5b3V0ID0gZmFsc2U7XG4gIHByb3RlY3RlZCBoYXNGbGV4Q2hpbGQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IFNob3dIaWRlU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICAgICAgICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcm90ZWN0ZWQgbGF5b3V0Q29uZmlnOiBMYXlvdXRDb25maWdPcHRpb25zLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KFNFUlZFUl9UT0tFTikgcHJvdGVjdGVkIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhbikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBMaWZlY3ljbGUgTWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy50cmFja0V4dHJhVHJpZ2dlcnMoKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0aGlzLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLm1hcnNoYWwuaGFzVmFsdWUoY2hpbGRyZW5baV0gYXMgSFRNTEVsZW1lbnQsICdmbGV4JykpIHtcbiAgICAgICAgdGhpcy5oYXNGbGV4Q2hpbGQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoRElTUExBWV9NQVAuaGFzKHRoaXMubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgIHRoaXMuZGlzcGxheSA9IERJU1BMQVlfTUFQLmdldCh0aGlzLm5hdGl2ZUVsZW1lbnQpITtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5nZXREaXNwbGF5U3R5bGUoKTtcbiAgICAgIERJU1BMQVlfTUFQLnNldCh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGlzcGxheSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0KCk7XG4gICAgLy8gc2V0IHRoZSBkZWZhdWx0IHRvIHNob3cgdW5sZXNzIGV4cGxpY2l0bHkgb3ZlcnJpZGRlblxuICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHRoaXMubWFyc2hhbC5nZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuRElSRUNUSVZFX0tFWSwgJycpO1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCB8fCBkZWZhdWx0VmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnNldFZhbHVlKHRydWUsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGNoYW5nZXMgdG8gYW55IEBJbnB1dCBwcm9wZXJ0aWVzLi4uXG4gICAqIERlZmF1bHQgdG8gdXNlIHRoZSBub24tcmVzcG9uc2l2ZSBJbnB1dCB2YWx1ZSAoJ2Z4U2hvdycpXG4gICAqIFRoZW4gY29uZGl0aW9uYWxseSBvdmVycmlkZSB3aXRoIHRoZSBtcS1hY3RpdmF0ZWQgSW5wdXQncyBjdXJyZW50IHZhbHVlXG4gICAqL1xuICBvdmVycmlkZSBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgT2JqZWN0LmtleXMoY2hhbmdlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5wdXRzLmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgaW5wdXRLZXkgPSBrZXkuc3BsaXQoJy4nKTtcbiAgICAgICAgY29uc3QgYnAgPSBpbnB1dEtleS5zbGljZSgxKS5qb2luKCcuJyk7XG4gICAgICAgIGNvbnN0IGlucHV0VmFsdWUgPSBjaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgICBsZXQgc2hvdWxkU2hvdyA9IGlucHV0VmFsdWUgIT09ICcnID9cbiAgICAgICAgICAgIGlucHV0VmFsdWUgIT09IDAgPyBjb2VyY2VCb29sZWFuUHJvcGVydHkoaW5wdXRWYWx1ZSkgOiBmYWxzZVxuICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICBpZiAoaW5wdXRLZXlbMF0gPT09ICdmeEhpZGUnKSB7XG4gICAgICAgICAgc2hvdWxkU2hvdyA9ICFzaG91bGRTaG93O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoc2hvdWxkU2hvdywgYnApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiAgV2F0Y2ggZm9yIHRoZXNlIGV4dHJhIHRyaWdnZXJzIHRvIHVwZGF0ZSBmeFNob3csIGZ4SGlkZSBzdHlsaW5nc1xuICAgKi9cbiAgcHJvdGVjdGVkIHRyYWNrRXh0cmFUcmlnZ2VycygpIHtcbiAgICB0aGlzLmhhc0xheW91dCA9IHRoaXMubWFyc2hhbC5oYXNWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdsYXlvdXQnKTtcblxuICAgIFsnbGF5b3V0JywgJ2xheW91dC1hbGlnbiddLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMubWFyc2hhbFxuICAgICAgICAgIC50cmFja1ZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwga2V5KVxuICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3lTdWJqZWN0KSlcbiAgICAgICAgICAuc3Vic2NyaWJlKHRoaXMudHJpZ2dlclVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBhY2Nlc3NvciB0byB0aGUgY3VycmVudCBIVE1MRWxlbWVudCdzIGBkaXNwbGF5YCBzdHlsZVxuICAgKiBOb3RlOiBTaG93L0hpZGUgd2lsbCBub3QgY2hhbmdlIHRoZSBkaXNwbGF5IHRvICdmbGV4JyBidXQgd2lsbCBzZXQgaXQgdG8gJ2Jsb2NrJ1xuICAgKiB1bmxlc3MgaXQgd2FzIGFscmVhZHkgZXhwbGljaXRseSBzcGVjaWZpZWQgaW5saW5lIG9yIGluIGEgQ1NTIHN0eWxlc2hlZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0RGlzcGxheVN0eWxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0aGlzLmhhc0xheW91dCB8fCAodGhpcy5oYXNGbGV4Q2hpbGQgJiYgdGhpcy5sYXlvdXRDb25maWcuYWRkRmxleFRvUGFyZW50KSkgP1xuICAgICAgICAnZmxleCcgOiB0aGlzLnN0eWxlci5sb29rdXBTdHlsZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgdHJ1ZSk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIHZpc2liaWxpdHkgdmFsdWUgYW5kIHRoZW4gdXBkYXRlIHRoZSBob3N0J3MgaW5saW5lIGRpc3BsYXkgc3R5bGUgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZyA9IHRydWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzU2VydmVyID0gaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlID8gJ3RydWUnIDogJ2ZhbHNlJywge2Rpc3BsYXk6IHRoaXMuZGlzcGxheSwgaXNTZXJ2ZXJ9KTtcbiAgICBpZiAoaXNTZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICcnKTtcbiAgICB9XG4gICAgdGhpcy5tYXJzaGFsLnRyaWdnZXJVcGRhdGUodGhpcy5wYXJlbnRFbGVtZW50ISwgJ2xheW91dC1nYXAnKTtcbiAgfVxufVxuXG5jb25zdCBESVNQTEFZX01BUDogV2Vha01hcDxIVE1MRWxlbWVudCwgc3RyaW5nPiA9IG5ldyBXZWFrTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2Z4U2hvdycsICdmeFNob3cucHJpbnQnLFxuICAnZnhTaG93LnhzJywgJ2Z4U2hvdy5zbScsICdmeFNob3cubWQnLCAnZnhTaG93LmxnJywgJ2Z4U2hvdy54bCcsXG4gICdmeFNob3cubHQtc20nLCAnZnhTaG93Lmx0LW1kJywgJ2Z4U2hvdy5sdC1sZycsICdmeFNob3cubHQteGwnLFxuICAnZnhTaG93Lmd0LXhzJywgJ2Z4U2hvdy5ndC1zbScsICdmeFNob3cuZ3QtbWQnLCAnZnhTaG93Lmd0LWxnJyxcbiAgJ2Z4SGlkZScsICdmeEhpZGUucHJpbnQnLFxuICAnZnhIaWRlLnhzJywgJ2Z4SGlkZS5zbScsICdmeEhpZGUubWQnLCAnZnhIaWRlLmxnJywgJ2Z4SGlkZS54bCcsXG4gICdmeEhpZGUubHQtc20nLCAnZnhIaWRlLmx0LW1kJywgJ2Z4SGlkZS5sdC1sZycsICdmeEhpZGUubHQteGwnLFxuICAnZnhIaWRlLmd0LXhzJywgJ2Z4SGlkZS5ndC1zbScsICdmeEhpZGUuZ3QtbWQnLCAnZnhIaWRlLmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtmeFNob3ddLCBbZnhTaG93LnByaW50XSxcbiAgW2Z4U2hvdy54c10sIFtmeFNob3cuc21dLCBbZnhTaG93Lm1kXSwgW2Z4U2hvdy5sZ10sIFtmeFNob3cueGxdLFxuICBbZnhTaG93Lmx0LXNtXSwgW2Z4U2hvdy5sdC1tZF0sIFtmeFNob3cubHQtbGddLCBbZnhTaG93Lmx0LXhsXSxcbiAgW2Z4U2hvdy5ndC14c10sIFtmeFNob3cuZ3Qtc21dLCBbZnhTaG93Lmd0LW1kXSwgW2Z4U2hvdy5ndC1sZ10sXG4gIFtmeEhpZGVdLCBbZnhIaWRlLnByaW50XSxcbiAgW2Z4SGlkZS54c10sIFtmeEhpZGUuc21dLCBbZnhIaWRlLm1kXSwgW2Z4SGlkZS5sZ10sIFtmeEhpZGUueGxdLFxuICBbZnhIaWRlLmx0LXNtXSwgW2Z4SGlkZS5sdC1tZF0sIFtmeEhpZGUubHQtbGddLCBbZnhIaWRlLmx0LXhsXSxcbiAgW2Z4SGlkZS5ndC14c10sIFtmeEhpZGUuZ3Qtc21dLCBbZnhIaWRlLmd0LW1kXSwgW2Z4SGlkZS5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ3Nob3cnIExheW91dCBBUEkgZGlyZWN0aXZlXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRTaG93SGlkZURpcmVjdGl2ZSBleHRlbmRzIFNob3dIaWRlRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGlucHV0cyA9IGlucHV0cztcbn1cbiJdfQ==