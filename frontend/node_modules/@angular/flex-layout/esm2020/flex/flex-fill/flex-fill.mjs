/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
const FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
export class FlexFillStyleBuilder extends StyleBuilder {
    buildStyles(_input) {
        return FLEX_FILL_CSS;
    }
}
FlexFillStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexFillStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
FlexFillStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexFillStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexFillStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
export class FlexFillDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.styleCache = flexFillCache;
        this.addStyles('');
    }
}
FlexFillDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexFillDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: FlexFillStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
FlexFillDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: FlexFillDirective, selector: "[fxFill], [fxFlexFill]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexFillDirective, decorators: [{
            type: Directive,
            args: [{ selector: `[fxFill], [fxFlexFill]` }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: FlexFillStyleBuilder }, { type: i1.MediaMarshaller }]; } });
const flexFillCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1maWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2ZsZXgtZmlsbC9mbGV4LWZpbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFDZCxZQUFZLEdBSWIsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLFFBQVEsRUFBRSxDQUFDO0lBQ1gsT0FBTyxFQUFFLE1BQU07SUFDZixRQUFRLEVBQUUsTUFBTTtJQUNoQixXQUFXLEVBQUUsTUFBTTtJQUNuQixZQUFZLEVBQUUsTUFBTTtDQUNyQixDQUFDO0FBR0YsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFlBQVk7SUFDcEQsV0FBVyxDQUFDLE1BQWM7UUFDeEIsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQzs7aUhBSFUsb0JBQW9CO3FIQUFwQixvQkFBb0IsY0FEUixNQUFNOzJGQUNsQixvQkFBb0I7a0JBRGhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQU9oQzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxjQUFjO0lBQ25ELFlBQVksS0FBaUIsRUFDakIsVUFBc0IsRUFDdEIsWUFBa0MsRUFDbEMsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSS9CLGVBQVUsR0FBRyxhQUFhLENBQUM7UUFINUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDOzs4R0FQVSxpQkFBaUIsc0VBR0Ysb0JBQW9CO2tHQUhuQyxpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSx3QkFBd0IsRUFBQzs0R0FJbkIsb0JBQW9CO0FBU2hELE1BQU0sYUFBYSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG4gIE1lZGlhTWFyc2hhbGxlcixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmNvbnN0IEZMRVhfRklMTF9DU1MgPSB7XG4gICdtYXJnaW4nOiAwLFxuICAnd2lkdGgnOiAnMTAwJScsXG4gICdoZWlnaHQnOiAnMTAwJScsXG4gICdtaW4td2lkdGgnOiAnMTAwJScsXG4gICdtaW4taGVpZ2h0JzogJzEwMCUnXG59O1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGbGV4RmlsbFN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKF9pbnB1dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEZMRVhfRklMTF9DU1M7XG4gIH1cbn1cblxuLyoqXG4gKiAnZnhGaWxsJyBmbGV4Ym94IHN0eWxpbmcgZGlyZWN0aXZlXG4gKiAgTWF4aW1pemVzIHdpZHRoIGFuZCBoZWlnaHQgb2YgZWxlbWVudCBpbiBhIGxheW91dCBjb250YWluZXJcbiAqXG4gKiAgTk9URTogZnhGaWxsIGlzIE5PVCByZXNwb25zaXZlIEFQSSEhXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiBgW2Z4RmlsbF0sIFtmeEZsZXhGaWxsXWB9KVxuZXhwb3J0IGNsYXNzIEZsZXhGaWxsRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBGbGV4RmlsbFN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5hZGRTdHlsZXMoJycpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHN0eWxlQ2FjaGUgPSBmbGV4RmlsbENhY2hlO1xufVxuXG5jb25zdCBmbGV4RmlsbENhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuIl19