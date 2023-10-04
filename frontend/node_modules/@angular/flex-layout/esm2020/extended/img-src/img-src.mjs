/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, PLATFORM_ID, Injectable, Input } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BaseDirective2, SERVER_TOKEN, StyleBuilder, } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class ImgSrcStyleBuilder extends StyleBuilder {
    buildStyles(url) {
        return { 'content': url ? `url(${url})` : '' };
    }
}
ImgSrcStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ImgSrcStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ImgSrcStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ImgSrcStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ImgSrcStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ImgSrcDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'img-src';
        this.defaultSrc = '';
        this.styleCache = imgSrcCache;
        this.init();
        this.setValue(this.nativeElement.getAttribute('src') || '', '');
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.nativeElement.setAttribute('src', '');
        }
    }
    set src(val) {
        this.defaultSrc = val;
        this.setValue(this.defaultSrc, '');
    }
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     */
    updateWithValue(value) {
        const url = value || this.defaultSrc;
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.addStyles(url);
        }
        else {
            this.nativeElement.setAttribute('src', url);
        }
    }
}
ImgSrcDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ImgSrcDirective, deps: [{ token: i0.ElementRef }, { token: ImgSrcStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive });
ImgSrcDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: ImgSrcDirective, inputs: { src: "src" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ImgSrcDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ImgSrcStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }]; }, propDecorators: { src: [{
                type: Input,
                args: ['src']
            }] } });
const imgSrcCache = new Map();
const inputs = [
    'src.xs', 'src.sm', 'src.md', 'src.lg', 'src.xl',
    'src.lt-sm', 'src.lt-md', 'src.lt-lg', 'src.lt-xl',
    'src.gt-xs', 'src.gt-sm', 'src.gt-md', 'src.gt-lg'
];
const selector = `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`;
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
export class DefaultImgSrcDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultImgSrcDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultImgSrcDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultImgSrcDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultImgSrcDirective, selector: "\n  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],\n  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],\n  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]\n", inputs: { "src.xs": "src.xs", "src.sm": "src.sm", "src.md": "src.md", "src.lg": "src.lg", "src.xl": "src.xl", "src.lt-sm": "src.lt-sm", "src.lt-md": "src.lt-md", "src.lt-lg": "src.lt-lg", "src.lt-xl": "src.lt-xl", "src.gt-xs": "src.gt-xs", "src.gt-sm": "src.gt-sm", "src.gt-md": "src.gt-md", "src.gt-lg": "src.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultImgSrcDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1nLXNyYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZXh0ZW5kZWQvaW1nLXNyYy9pbWctc3JjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxTQUFTLEVBQWMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFFTCxjQUFjLEVBQ2QsWUFBWSxFQUNaLFlBQVksR0FHYixNQUFNLDJCQUEyQixDQUFDOzs7QUFHbkMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQVk7SUFDbEQsV0FBVyxDQUFDLEdBQVc7UUFDckIsT0FBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDO0lBQy9DLENBQUM7OytHQUhVLGtCQUFrQjttSEFBbEIsa0JBQWtCLGNBRE4sTUFBTTsyRkFDbEIsa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFRaEMsTUFBTSxPQUFPLGVBQWdCLFNBQVEsY0FBYztJQVVqRCxZQUFZLFVBQXNCLEVBQ3RCLFlBQWdDLEVBQ2hDLE1BQWtCLEVBQ2xCLE9BQXdCLEVBQ08sVUFBa0IsRUFDakIsa0JBQTJCO1FBQ3JFLEtBQUssQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUZSLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDakIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFTO1FBZHBELGtCQUFhLEdBQUcsU0FBUyxDQUFDO1FBQ25DLGVBQVUsR0FBRyxFQUFFLENBQUM7UUF1Q1AsZUFBVSxHQUFHLFdBQVcsQ0FBQztRQXhCMUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ2hFLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFsQkQsSUFDSSxHQUFHLENBQUMsR0FBVztRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQWdCRDs7Ozs7OztPQU9HO0lBQ2dCLGVBQWUsQ0FBQyxLQUFjO1FBQy9DLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDOzs0R0F2Q1UsZUFBZSw0Q0FXQSxrQkFBa0Isc0VBR3hCLFdBQVcsYUFDWCxZQUFZO2dHQWZyQixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUZBWWtCLGtCQUFrQixtRUFHVyxNQUFNOzBCQUFoRCxNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLFlBQVk7NENBVjVCLEdBQUc7c0JBRE4sS0FBSzt1QkFBQyxLQUFLOztBQXdDZCxNQUFNLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRztJQUNiLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRO0lBQ2hELFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVc7SUFDbEQsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVztDQUNuRCxDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUc7Ozs7Q0FJaEIsQ0FBQztBQUVGOzs7Ozs7OztHQVFHO0FBRUgsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGVBQWU7SUFEM0Q7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7O21IQUZZLHNCQUFzQjt1R0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBQTEFURk9STV9JRCwgSW5qZWN0YWJsZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtU2VydmVyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBCYXNlRGlyZWN0aXZlMixcbiAgU0VSVkVSX1RPS0VOLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEltZ1NyY1N0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKHVybDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHsnY29udGVudCc6IHVybCA/IGB1cmwoJHt1cmx9KWAgOiAnJ307XG4gIH1cbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgSW1nU3JjRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgRElSRUNUSVZFX0tFWSA9ICdpbWctc3JjJztcbiAgcHJvdGVjdGVkIGRlZmF1bHRTcmMgPSAnJztcblxuICBASW5wdXQoJ3NyYycpXG4gIHNldCBzcmModmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRlZmF1bHRTcmMgPSB2YWw7XG4gICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmRlZmF1bHRTcmMsICcnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogSW1nU3JjU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICAgICAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICAgICAgICAgICAgQEluamVjdChTRVJWRVJfVE9LRU4pIHByb3RlY3RlZCBzZXJ2ZXJNb2R1bGVMb2FkZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5zZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJywgJycpO1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkgJiYgdGhpcy5zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBbcmVzcG9uc2l2ZWx5XSBhY3RpdmF0ZWQgaW5wdXQgdmFsdWUgdG8gdXBkYXRlXG4gICAqIHRoZSBob3N0IGltZyBzcmMgYXR0cmlidXRlIG9yIGFzc2lnbiBhIGRlZmF1bHQgYGltZy5zcmM9JydgXG4gICAqIGlmIHRoZSBzcmMgaGFzIG5vdCBiZWVuIGRlZmluZWQuXG4gICAqXG4gICAqIERvIG5vdGhpbmcgdG8gc3RhbmRhcmQgYDxpbWcgc3JjPVwiXCI+YCB1c2FnZXMsIG9ubHkgd2hlbiByZXNwb25zaXZlXG4gICAqIGtleXMgYXJlIHByZXNlbnQgZG8gd2UgYWN0dWFsbHkgY2FsbCBgc2V0QXR0cmlidXRlKClgXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgdXBkYXRlV2l0aFZhbHVlKHZhbHVlPzogc3RyaW5nKSB7XG4gICAgY29uc3QgdXJsID0gdmFsdWUgfHwgdGhpcy5kZWZhdWx0U3JjO1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkgJiYgdGhpcy5zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgIHRoaXMuYWRkU3R5bGVzKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHN0eWxlQ2FjaGUgPSBpbWdTcmNDYWNoZTtcbn1cblxuY29uc3QgaW1nU3JjQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ3NyYy54cycsICdzcmMuc20nLCAnc3JjLm1kJywgJ3NyYy5sZycsICdzcmMueGwnLFxuICAnc3JjLmx0LXNtJywgJ3NyYy5sdC1tZCcsICdzcmMubHQtbGcnLCAnc3JjLmx0LXhsJyxcbiAgJ3NyYy5ndC14cycsICdzcmMuZ3Qtc20nLCAnc3JjLmd0LW1kJywgJ3NyYy5ndC1sZydcbl07XG5cbmNvbnN0IHNlbGVjdG9yID0gYFxuICBpbWdbc3JjLnhzXSwgICAgaW1nW3NyYy5zbV0sICAgIGltZ1tzcmMubWRdLCAgICBpbWdbc3JjLmxnXSwgICBpbWdbc3JjLnhsXSxcbiAgaW1nW3NyYy5sdC1zbV0sIGltZ1tzcmMubHQtbWRdLCBpbWdbc3JjLmx0LWxnXSwgaW1nW3NyYy5sdC14bF0sXG4gIGltZ1tzcmMuZ3QteHNdLCBpbWdbc3JjLmd0LXNtXSwgaW1nW3NyYy5ndC1tZF0sIGltZ1tzcmMuZ3QtbGddXG5gO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIHByb3ZpZGVzIGEgcmVzcG9uc2l2ZSBBUEkgZm9yIHRoZSBIVE1MIDxpbWc+ICdzcmMnIGF0dHJpYnV0ZVxuICogYW5kIHdpbGwgdXBkYXRlIHRoZSBpbWcuc3JjIHByb3BlcnR5IHVwb24gZWFjaCByZXNwb25zaXZlIGFjdGl2YXRpb24uXG4gKlxuICogZS5nLlxuICogICAgICA8aW1nIHNyYz1cImRlZmF1bHRTY2VuZS5qcGdcIiBzcmMueHM9XCJtb2JpbGVTY2VuZS5qcGdcIj48L2ltZz5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vcmVzcG9uc2l2ZS1pbWFnZXMteW91cmUtanVzdC1jaGFuZ2luZy1yZXNvbHV0aW9ucy11c2Utc3JjL1xuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SW1nU3JjRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGlucHV0cyA9IGlucHV0cztcbn1cbiJdfQ==