/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Inject } from '@angular/core';
import { BaseDirective2, StyleBuilder, LAYOUT_CONFIG, } from '@angular/flex-layout/core';
import { buildLayoutCSS } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input, { display }) {
        const css = buildLayoutCSS(input);
        return {
            ...css,
            display: display === 'none' ? display : css.display,
        };
    }
}
LayoutStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
LayoutStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxLayout', 'fxLayout.xs', 'fxLayout.sm', 'fxLayout.md',
    'fxLayout.lg', 'fxLayout.xl', 'fxLayout.lt-sm', 'fxLayout.lt-md',
    'fxLayout.lt-lg', 'fxLayout.lt-xl', 'fxLayout.gt-xs', 'fxLayout.gt-sm',
    'fxLayout.gt-md', 'fxLayout.gt-lg'
];
const selector = `
  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],
  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],
  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],
  [fxLayout.gt-md], [fxLayout.gt-lg]
`;
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export class LayoutDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal, _config) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this._config = _config;
        this.DIRECTIVE_KEY = 'layout';
        this.init();
    }
    updateWithValue(input) {
        const detectLayoutDisplay = this._config.detectLayoutDisplay;
        const display = detectLayoutDisplay ? this.styler.lookupStyle(this.nativeElement, 'display') : '';
        this.styleCache = cacheMap.get(display) ?? new Map();
        cacheMap.set(display, this.styleCache);
        if (this.currentValue !== input) {
            this.addStyles(input, { display });
            this.currentValue = input;
        }
    }
}
LayoutDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutStyleBuilder }, { token: i1.MediaMarshaller }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Directive });
LayoutDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: LayoutDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutStyleBuilder }, { type: i1.MediaMarshaller }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
export class DefaultLayoutDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultLayoutDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultLayoutDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultLayoutDirective, selector: "\n  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],\n  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],\n  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],\n  [fxLayout.gt-md], [fxLayout.gt-lg]\n", inputs: { fxLayout: "fxLayout", "fxLayout.xs": "fxLayout.xs", "fxLayout.sm": "fxLayout.sm", "fxLayout.md": "fxLayout.md", "fxLayout.lg": "fxLayout.lg", "fxLayout.xl": "fxLayout.xl", "fxLayout.lt-sm": "fxLayout.lt-sm", "fxLayout.lt-md": "fxLayout.lt-md", "fxLayout.lt-lg": "fxLayout.lt-lg", "fxLayout.lt-xl": "fxLayout.lt-xl", "fxLayout.gt-xs": "fxLayout.gt-xs", "fxLayout.gt-sm": "fxLayout.gt-sm", "fxLayout.gt-md": "fxLayout.gt-md", "fxLayout.gt-lg": "fxLayout.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultLayoutDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const cacheMap = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC9sYXlvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQ0wsY0FBYyxFQUNkLFlBQVksRUFJWixhQUFhLEdBRWQsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUNBQXFDLENBQUM7OztBQU9uRSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsWUFBWTtJQUNsRCxXQUFXLENBQUMsS0FBYSxFQUFFLEVBQUMsT0FBTyxFQUFxQjtRQUN0RCxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsT0FBTztZQUNMLEdBQUcsR0FBRztZQUNOLE9BQU8sRUFBRSxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1NBQ3BELENBQUM7SUFDSixDQUFDOzsrR0FQVSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUROLE1BQU07MkZBQ2xCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBV2hDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsVUFBVSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYTtJQUN2RCxhQUFhLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQjtJQUNoRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7SUFDdEUsZ0JBQWdCLEVBQUUsZ0JBQWdCO0NBQ25DLENBQUM7QUFDRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxlQUFnQixTQUFRLGNBQWM7SUFJakQsWUFBWSxLQUFpQixFQUNqQixVQUFzQixFQUN0QixZQUFnQyxFQUNoQyxPQUF3QixFQUNPLE9BQTRCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQURQLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBTnBELGtCQUFhLEdBQUcsUUFBUSxDQUFDO1FBUTFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFa0IsZUFBZSxDQUFDLEtBQWE7UUFDOUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO1FBQzdELE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbEcsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDckQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXZDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxLQUFLLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7NEdBdkJVLGVBQWUsc0VBTUEsa0JBQWtCLDRDQUV4QixhQUFhO2dHQVJ0QixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFNBQVM7NEdBT2tCLGtCQUFrQjswQkFFL0IsTUFBTTsyQkFBQyxhQUFhOztBQW1CbkMsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGVBQWU7SUFEM0Q7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7O21IQUZZLHNCQUFzQjt1R0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDOztBQU03QixNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgSW5qZWN0YWJsZSwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBMQVlPVVRfQ09ORklHLFxuICBMYXlvdXRDb25maWdPcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuaW1wb3J0IHtidWlsZExheW91dENTU30gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExheW91dFN0eWxlRGlzcGxheSB7XG4gIHJlYWRvbmx5IGRpc3BsYXk6IHN0cmluZztcbn1cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTGF5b3V0U3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZywge2Rpc3BsYXl9OiBMYXlvdXRTdHlsZURpc3BsYXkpIHtcbiAgICBjb25zdCBjc3MgPSBidWlsZExheW91dENTUyhpbnB1dCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNzcyxcbiAgICAgIGRpc3BsYXk6IGRpc3BsYXkgPT09ICdub25lJyA/IGRpc3BsYXkgOiBjc3MuZGlzcGxheSxcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2Z4TGF5b3V0JywgJ2Z4TGF5b3V0LnhzJywgJ2Z4TGF5b3V0LnNtJywgJ2Z4TGF5b3V0Lm1kJyxcbiAgJ2Z4TGF5b3V0LmxnJywgJ2Z4TGF5b3V0LnhsJywgJ2Z4TGF5b3V0Lmx0LXNtJywgJ2Z4TGF5b3V0Lmx0LW1kJyxcbiAgJ2Z4TGF5b3V0Lmx0LWxnJywgJ2Z4TGF5b3V0Lmx0LXhsJywgJ2Z4TGF5b3V0Lmd0LXhzJywgJ2Z4TGF5b3V0Lmd0LXNtJyxcbiAgJ2Z4TGF5b3V0Lmd0LW1kJywgJ2Z4TGF5b3V0Lmd0LWxnJ1xuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZnhMYXlvdXRdLCBbZnhMYXlvdXQueHNdLCBbZnhMYXlvdXQuc21dLCBbZnhMYXlvdXQubWRdLFxuICBbZnhMYXlvdXQubGddLCBbZnhMYXlvdXQueGxdLCBbZnhMYXlvdXQubHQtc21dLCBbZnhMYXlvdXQubHQtbWRdLFxuICBbZnhMYXlvdXQubHQtbGddLCBbZnhMYXlvdXQubHQteGxdLCBbZnhMYXlvdXQuZ3QteHNdLCBbZnhMYXlvdXQuZ3Qtc21dLFxuICBbZnhMYXlvdXQuZ3QtbWRdLCBbZnhMYXlvdXQuZ3QtbGddXG5gO1xuXG4vKipcbiAqICdsYXlvdXQnIGZsZXhib3ggc3R5bGluZyBkaXJlY3RpdmVcbiAqIERlZmluZXMgdGhlIHBvc2l0aW9uaW5nIGZsb3cgZGlyZWN0aW9uIGZvciB0aGUgY2hpbGQgZWxlbWVudHM6IHJvdyBvciBjb2x1bW5cbiAqIE9wdGlvbmFsIHZhbHVlczogY29sdW1uIG9yIHJvdyAoZGVmYXVsdClcbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9hbG1hbmFjL3Byb3BlcnRpZXMvZi9mbGV4LWRpcmVjdGlvbi9cbiAqXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIExheW91dERpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgRElSRUNUSVZFX0tFWSA9ICdsYXlvdXQnO1xuXG4gIGNvbnN0cnVjdG9yKGVsUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZVV0aWxzOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IExheW91dFN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyLFxuICAgICAgICAgICAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogTGF5b3V0Q29uZmlnT3B0aW9ucykge1xuICAgIHN1cGVyKGVsUmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlVXRpbHMsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZShpbnB1dDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGV0ZWN0TGF5b3V0RGlzcGxheSA9IHRoaXMuX2NvbmZpZy5kZXRlY3RMYXlvdXREaXNwbGF5O1xuICAgIGNvbnN0IGRpc3BsYXkgPSBkZXRlY3RMYXlvdXREaXNwbGF5ID8gdGhpcy5zdHlsZXIubG9va3VwU3R5bGUodGhpcy5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScpIDogJyc7XG4gICAgdGhpcy5zdHlsZUNhY2hlID0gY2FjaGVNYXAuZ2V0KGRpc3BsYXkpID8/IG5ldyBNYXAoKTtcbiAgICBjYWNoZU1hcC5zZXQoZGlzcGxheSwgdGhpcy5zdHlsZUNhY2hlKTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRWYWx1ZSAhPT0gaW5wdXQpIHtcbiAgICAgIHRoaXMuYWRkU3R5bGVzKGlucHV0LCB7ZGlzcGxheX0pO1xuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBpbnB1dDtcbiAgICB9XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdExheW91dERpcmVjdGl2ZSBleHRlbmRzIExheW91dERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbnR5cGUgQ2FjaGVNYXAgPSBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+O1xuY29uc3QgY2FjaGVNYXAgPSBuZXcgTWFwPHN0cmluZywgQ2FjaGVNYXA+KCk7XG4iXX0=