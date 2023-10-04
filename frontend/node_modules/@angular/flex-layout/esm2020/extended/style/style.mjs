/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, Optional, PLATFORM_ID, SecurityContext, Self, } from '@angular/core';
import { isPlatformServer, NgStyle } from '@angular/common';
import { BaseDirective2, SERVER_TOKEN, } from '@angular/flex-layout/core';
import { buildRawList, getType, buildMapFromSet, stringToKeyValue, keyValuesToMap, } from './style-transforms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
export class StyleDirective extends BaseDirective2 {
    constructor(elementRef, styler, marshal, sanitizer, differs, renderer2, ngStyleInstance, serverLoaded, platformId) {
        super(elementRef, null, styler, marshal);
        this.sanitizer = sanitizer;
        this.ngStyleInstance = ngStyleInstance;
        this.DIRECTIVE_KEY = 'ngStyle';
        if (!this.ngStyleInstance) {
            // Create an instance NgStyle Directive instance only if `ngStyle=""` has NOT been
            // defined on the same host element; since the responsive variations may be defined...
            this.ngStyleInstance = new NgStyle(elementRef, differs, renderer2);
        }
        this.init();
        const styles = this.nativeElement.getAttribute('style') ?? '';
        this.fallbackStyles = this.buildStyleMap(styles);
        this.isServer = serverLoaded && isPlatformServer(platformId);
    }
    /** Add generated styles */
    updateWithValue(value) {
        const styles = this.buildStyleMap(value);
        this.ngStyleInstance.ngStyle = { ...this.fallbackStyles, ...styles };
        if (this.isServer) {
            this.applyStyleToElement(styles);
        }
        this.ngStyleInstance.ngDoCheck();
    }
    /** Remove generated styles */
    clearStyles() {
        this.ngStyleInstance.ngStyle = this.fallbackStyles;
        this.ngStyleInstance.ngDoCheck();
    }
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     */
    buildStyleMap(styles) {
        // Always safe-guard (aka sanitize) style property values
        const sanitizer = (val) => this.sanitizer.sanitize(SecurityContext.STYLE, val) ?? '';
        if (styles) {
            switch (getType(styles)) {
                case 'string': return buildMapFromList(buildRawList(styles), sanitizer);
                case 'array': return buildMapFromList(styles, sanitizer);
                case 'set': return buildMapFromSet(styles, sanitizer);
                default: return buildMapFromSet(styles, sanitizer);
            }
        }
        return {};
    }
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /** For ChangeDetectionStrategy.onPush and ngOnChanges() updates */
    ngDoCheck() {
        this.ngStyleInstance.ngDoCheck();
    }
}
StyleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: StyleDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: i2.DomSanitizer }, { token: i0.KeyValueDiffers }, { token: i0.Renderer2 }, { token: i3.NgStyle, optional: true, self: true }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
StyleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: StyleDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: StyleDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: i2.DomSanitizer }, { type: i0.KeyValueDiffers }, { type: i0.Renderer2 }, { type: i3.NgStyle, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
const inputs = [
    'ngStyle',
    'ngStyle.xs', 'ngStyle.sm', 'ngStyle.md', 'ngStyle.lg', 'ngStyle.xl',
    'ngStyle.lt-sm', 'ngStyle.lt-md', 'ngStyle.lt-lg', 'ngStyle.lt-xl',
    'ngStyle.gt-xs', 'ngStyle.gt-sm', 'ngStyle.gt-md', 'ngStyle.gt-lg'
];
const selector = `
  [ngStyle],
  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
`;
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export class DefaultStyleDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultStyleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultStyleDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultStyleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultStyleDirective, selector: "\n  [ngStyle],\n  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],\n  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],\n  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]\n", inputs: { ngStyle: "ngStyle", "ngStyle.xs": "ngStyle.xs", "ngStyle.sm": "ngStyle.sm", "ngStyle.md": "ngStyle.md", "ngStyle.lg": "ngStyle.lg", "ngStyle.xl": "ngStyle.xl", "ngStyle.lt-sm": "ngStyle.lt-sm", "ngStyle.lt-md": "ngStyle.lt-md", "ngStyle.lt-lg": "ngStyle.lt-lg", "ngStyle.lt-xl": "ngStyle.lt-xl", "ngStyle.gt-xs": "ngStyle.gt-xs", "ngStyle.gt-sm": "ngStyle.gt-sm", "ngStyle.gt-md": "ngStyle.gt-md", "ngStyle.gt-lg": "ngStyle.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultStyleDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
/** Build a styles map from a list of styles, while sanitizing bad values first */
function buildMapFromList(styles, sanitize) {
    const sanitizeValue = (it) => {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(entry => !!entry)
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2V4dGVuZGVkL3N0eWxlL3N0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxTQUFTLEVBR1QsTUFBTSxFQUVOLFFBQVEsRUFDUixXQUFXLEVBRVgsZUFBZSxFQUNmLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFMUQsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBQ2IsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBSUwsWUFBWSxFQUNaLE9BQU8sRUFDUCxlQUFlLEVBR2YsZ0JBQWdCLEVBQ2hCLGNBQWMsR0FDZixNQUFNLG9CQUFvQixDQUFDOzs7OztBQUc1QixNQUFNLE9BQU8sY0FBZSxTQUFRLGNBQWM7SUFNaEQsWUFBWSxVQUFzQixFQUN0QixNQUFrQixFQUNsQixPQUF3QixFQUNkLFNBQXVCLEVBQ2pDLE9BQXdCLEVBQ3hCLFNBQW9CLEVBQ2lCLGVBQXdCLEVBQ3ZDLFlBQXFCLEVBQ3RCLFVBQWtCO1FBQ2pELEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQU50QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBR0ksb0JBQWUsR0FBZixlQUFlLENBQVM7UUFWdEQsa0JBQWEsR0FBRyxTQUFTLENBQUM7UUFjM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsa0ZBQWtGO1lBQ2xGLHNGQUFzRjtZQUN0RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsSUFB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LHFCQUFxQjtrQkFEakMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUM7O0FBSzdCLGtGQUFrRjtBQUNsRixTQUFTLGdCQUFnQixDQUFDLE1BQXNCLEVBQUUsUUFBMkI7SUFDM0UsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUFtQixFQUFFLEVBQUU7UUFDNUMsSUFBSSxRQUFRLEVBQUU7WUFDWixFQUFFLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQztJQUVGLE9BQU8sTUFBTTtTQUNWLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztTQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3hCLEdBQUcsQ0FBQyxhQUFhLENBQUM7U0FDbEIsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFnQixDQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgT3B0aW9uYWwsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1TZXJ2ZXIsIE5nU3R5bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbVNhbml0aXplcn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVVdGlscyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTRVJWRVJfVE9LRU4sXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuXG5pbXBvcnQge1xuICBOZ1N0eWxlUmF3TGlzdCxcbiAgTmdTdHlsZVR5cGUsXG4gIE5nU3R5bGVTYW5pdGl6ZXIsXG4gIGJ1aWxkUmF3TGlzdCxcbiAgZ2V0VHlwZSxcbiAgYnVpbGRNYXBGcm9tU2V0LFxuICBOZ1N0eWxlTWFwLFxuICBOZ1N0eWxlS2V5VmFsdWUsXG4gIHN0cmluZ1RvS2V5VmFsdWUsXG4gIGtleVZhbHVlc1RvTWFwLFxufSBmcm9tICcuL3N0eWxlLXRyYW5zZm9ybXMnO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBTdHlsZURpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgRG9DaGVjayB7XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnbmdTdHlsZSc7XG4gIHByb3RlY3RlZCBmYWxsYmFja1N0eWxlczogTmdTdHlsZU1hcDtcbiAgcHJvdGVjdGVkIGlzU2VydmVyOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgICAgICAgICAgIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICAgICAgICAgICAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHJpdmF0ZSByZWFkb25seSBuZ1N0eWxlSW5zdGFuY2U6IE5nU3R5bGUsXG4gICAgICAgICAgICAgIEBJbmplY3QoU0VSVkVSX1RPS0VOKSBzZXJ2ZXJMb2FkZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG51bGwhLCBzdHlsZXIsIG1hcnNoYWwpO1xuICAgIGlmICghdGhpcy5uZ1N0eWxlSW5zdGFuY2UpIHtcbiAgICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBOZ1N0eWxlIERpcmVjdGl2ZSBpbnN0YW5jZSBvbmx5IGlmIGBuZ1N0eWxlPVwiXCJgIGhhcyBOT1QgYmVlblxuICAgICAgLy8gZGVmaW5lZCBvbiB0aGUgc2FtZSBob3N0IGVsZW1lbnQ7IHNpbmNlIHRoZSByZXNwb25zaXZlIHZhcmlhdGlvbnMgbWF5IGJlIGRlZmluZWQuLi5cbiAgICAgIHRoaXMubmdTdHlsZUluc3RhbmNlID0gbmV3IE5nU3R5bGUoZWxlbWVudFJlZiwgZGlmZmVycywgcmVuZGVyZXIyKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gICAgY29uc3Qgc3R5bGVzID0gdGhpcy5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3R5bGUnKSA/PyAnJztcbiAgICB0aGlzLmZhbGxiYWNrU3R5bGVzID0gdGhpcy5idWlsZFN0eWxlTWFwKHN0eWxlcyk7XG4gICAgdGhpcy5pc1NlcnZlciA9IHNlcnZlckxvYWRlZCAmJiBpc1BsYXRmb3JtU2VydmVyKHBsYXRmb3JtSWQpO1xuICB9XG5cbiAgLyoqIEFkZCBnZW5lcmF0ZWQgc3R5bGVzICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuYnVpbGRTdHlsZU1hcCh2YWx1ZSk7XG4gICAgdGhpcy5uZ1N0eWxlSW5zdGFuY2UubmdTdHlsZSA9IHsuLi50aGlzLmZhbGxiYWNrU3R5bGVzLCAuLi5zdHlsZXN9O1xuICAgIGlmICh0aGlzLmlzU2VydmVyKSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGVUb0VsZW1lbnQoc3R5bGVzKTtcbiAgICB9XG4gICAgdGhpcy5uZ1N0eWxlSW5zdGFuY2UubmdEb0NoZWNrKCk7XG4gIH1cblxuICAvKiogUmVtb3ZlIGdlbmVyYXRlZCBzdHlsZXMgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGNsZWFyU3R5bGVzKCkge1xuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nU3R5bGUgPSB0aGlzLmZhbGxiYWNrU3R5bGVzO1xuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nRG9DaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgcmF3IHN0cmluZ3MgdG8gbmdTdHlsZU1hcDsgd2hpY2ggaXMgcmVxdWlyZWQgYnkgbmdTdHlsZVxuICAgKiBOT1RFOiBSYXcgc3RyaW5nIGtleS12YWx1ZSBwYWlycyBNVVNUIGJlIGRlbGltaXRlZCBieSBgO2BcbiAgICogICAgICAgQ29tbWEtZGVsaW1pdGVycyBhcmUgbm90IHN1cHBvcnRlZCBkdWUgdG8gY29tcGxleGl0aWVzIG9mXG4gICAqICAgICAgIHBvc3NpYmxlIHN0eWxlIHZhbHVlcyBzdWNoIGFzIGByZ2JhKHgseCx4LHgpYCBhbmQgb3RoZXJzXG4gICAqL1xuICBwcm90ZWN0ZWQgYnVpbGRTdHlsZU1hcChzdHlsZXM6IE5nU3R5bGVUeXBlKTogTmdTdHlsZU1hcCB7XG4gICAgLy8gQWx3YXlzIHNhZmUtZ3VhcmQgKGFrYSBzYW5pdGl6ZSkgc3R5bGUgcHJvcGVydHkgdmFsdWVzXG4gICAgY29uc3Qgc2FuaXRpemVyOiBOZ1N0eWxlU2FuaXRpemVyID0gKHZhbDogYW55KSA9PlxuICAgICAgdGhpcy5zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LlNUWUxFLCB2YWwpID8/ICcnO1xuICAgIGlmIChzdHlsZXMpIHtcbiAgICAgIHN3aXRjaCAoZ2V0VHlwZShzdHlsZXMpKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6ICByZXR1cm4gYnVpbGRNYXBGcm9tTGlzdChidWlsZFJhd0xpc3Qoc3R5bGVzKSxcbiAgICAgICAgICBzYW5pdGl6ZXIpO1xuICAgICAgICBjYXNlICdhcnJheScgOiAgcmV0dXJuIGJ1aWxkTWFwRnJvbUxpc3Qoc3R5bGVzIGFzIE5nU3R5bGVSYXdMaXN0LCBzYW5pdGl6ZXIpO1xuICAgICAgICBjYXNlICdzZXQnICAgOiAgcmV0dXJuIGJ1aWxkTWFwRnJvbVNldChzdHlsZXMsIHNhbml0aXplcik7XG4gICAgICAgIGRlZmF1bHQgICAgICA6ICByZXR1cm4gYnVpbGRNYXBGcm9tU2V0KHN0eWxlcywgc2FuaXRpemVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gTGlmZWN5Y2xlIEhvb2tzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKiBGb3IgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kub25QdXNoIGFuZCBuZ09uQ2hhbmdlcygpIHVwZGF0ZXMgKi9cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nRG9DaGVjaygpO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ25nU3R5bGUnLFxuICAnbmdTdHlsZS54cycsICduZ1N0eWxlLnNtJywgJ25nU3R5bGUubWQnLCAnbmdTdHlsZS5sZycsICduZ1N0eWxlLnhsJyxcbiAgJ25nU3R5bGUubHQtc20nLCAnbmdTdHlsZS5sdC1tZCcsICduZ1N0eWxlLmx0LWxnJywgJ25nU3R5bGUubHQteGwnLFxuICAnbmdTdHlsZS5ndC14cycsICduZ1N0eWxlLmd0LXNtJywgJ25nU3R5bGUuZ3QtbWQnLCAnbmdTdHlsZS5ndC1sZydcbl07XG5cbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbbmdTdHlsZV0sXG4gIFtuZ1N0eWxlLnhzXSwgW25nU3R5bGUuc21dLCBbbmdTdHlsZS5tZF0sIFtuZ1N0eWxlLmxnXSwgW25nU3R5bGUueGxdLFxuICBbbmdTdHlsZS5sdC1zbV0sIFtuZ1N0eWxlLmx0LW1kXSwgW25nU3R5bGUubHQtbGddLCBbbmdTdHlsZS5sdC14bF0sXG4gIFtuZ1N0eWxlLmd0LXhzXSwgW25nU3R5bGUuZ3Qtc21dLCBbbmdTdHlsZS5ndC1tZF0sIFtuZ1N0eWxlLmd0LWxnXVxuYDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdG8gYWRkIHJlc3BvbnNpdmUgc3VwcG9ydCBmb3IgbmdTdHlsZS5cbiAqXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRTdHlsZURpcmVjdGl2ZSBleHRlbmRzIFN0eWxlRGlyZWN0aXZlIGltcGxlbWVudHMgRG9DaGVjayB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbi8qKiBCdWlsZCBhIHN0eWxlcyBtYXAgZnJvbSBhIGxpc3Qgb2Ygc3R5bGVzLCB3aGlsZSBzYW5pdGl6aW5nIGJhZCB2YWx1ZXMgZmlyc3QgKi9cbmZ1bmN0aW9uIGJ1aWxkTWFwRnJvbUxpc3Qoc3R5bGVzOiBOZ1N0eWxlUmF3TGlzdCwgc2FuaXRpemU/OiBOZ1N0eWxlU2FuaXRpemVyKTogTmdTdHlsZU1hcCB7XG4gIGNvbnN0IHNhbml0aXplVmFsdWUgPSAoaXQ6IE5nU3R5bGVLZXlWYWx1ZSkgPT4ge1xuICAgIGlmIChzYW5pdGl6ZSkge1xuICAgICAgaXQudmFsdWUgPSBzYW5pdGl6ZShpdC52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBpdDtcbiAgfTtcblxuICByZXR1cm4gc3R5bGVzXG4gICAgLm1hcChzdHJpbmdUb0tleVZhbHVlKVxuICAgIC5maWx0ZXIoZW50cnkgPT4gISFlbnRyeSlcbiAgICAubWFwKHNhbml0aXplVmFsdWUpXG4gICAgLnJlZHVjZShrZXlWYWx1ZXNUb01hcCwge30gYXMgTmdTdHlsZU1hcCk7XG59XG4iXX0=