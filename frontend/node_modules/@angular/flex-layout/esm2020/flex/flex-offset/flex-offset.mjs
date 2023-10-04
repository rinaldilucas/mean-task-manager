/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Inject } from '@angular/core';
import { BaseDirective2, StyleBuilder, ɵmultiply as multiply, LAYOUT_CONFIG, } from '@angular/flex-layout/core';
import { isFlowHorizontal } from '@angular/flex-layout/_private-utils';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/flex-layout/core";
export class FlexOffsetStyleBuilder extends StyleBuilder {
    constructor(_config) {
        super();
        this._config = _config;
    }
    buildStyles(offset, parent) {
        offset || (offset = '0');
        offset = multiply(offset, this._config.multiplier);
        const isPercent = String(offset).indexOf('%') > -1;
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = `${offset}%`;
        }
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        const styles = isFlowHorizontal(parent.layout) ?
            { [horizontalLayoutKey]: offset } : { 'margin-top': offset };
        return styles;
    }
}
FlexOffsetStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexOffsetStyleBuilder, deps: [{ token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
FlexOffsetStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexOffsetStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexOffsetStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
const inputs = [
    'fxFlexOffset', 'fxFlexOffset.xs', 'fxFlexOffset.sm', 'fxFlexOffset.md',
    'fxFlexOffset.lg', 'fxFlexOffset.xl', 'fxFlexOffset.lt-sm', 'fxFlexOffset.lt-md',
    'fxFlexOffset.lt-lg', 'fxFlexOffset.lt-xl', 'fxFlexOffset.gt-xs', 'fxFlexOffset.gt-sm',
    'fxFlexOffset.gt-md', 'fxFlexOffset.gt-lg'
];
const selector = `
  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],
  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],
  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],
  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`;
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export class FlexOffsetDirective extends BaseDirective2 {
    constructor(elRef, directionality, styleBuilder, marshal, styler) {
        super(elRef, styleBuilder, styler, marshal);
        this.directionality = directionality;
        this.DIRECTIVE_KEY = 'flex-offset';
        this.init([this.directionality.change]);
        // Parent DOM `layout-gap` with affect the nested child with `flex-offset`
        if (this.parentElement) {
            this.marshal
                .trackValue(this.parentElement, 'layout-gap')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     */
    updateWithValue(value = '') {
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const layout = this.getFlexFlowDirection(this.parentElement, true);
        const isRtl = this.directionality.value === 'rtl';
        if (layout === 'row' && isRtl) {
            this.styleCache = flexOffsetCacheRowRtl;
        }
        else if (layout === 'row' && !isRtl) {
            this.styleCache = flexOffsetCacheRowLtr;
        }
        else if (layout === 'column' && isRtl) {
            this.styleCache = flexOffsetCacheColumnRtl;
        }
        else if (layout === 'column' && !isRtl) {
            this.styleCache = flexOffsetCacheColumnLtr;
        }
        this.addStyles(value + '', { layout, isRtl });
    }
}
FlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexOffsetDirective, deps: [{ token: i0.ElementRef }, { token: i1.Directionality }, { token: FlexOffsetStyleBuilder }, { token: i2.MediaMarshaller }, { token: i2.StyleUtils }], target: i0.ɵɵFactoryTarget.Directive });
FlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: FlexOffsetDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexOffsetDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality }, { type: FlexOffsetStyleBuilder }, { type: i2.MediaMarshaller }, { type: i2.StyleUtils }]; } });
export class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultFlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultFlexOffsetDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultFlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultFlexOffsetDirective, selector: "\n  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],\n  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],\n  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],\n  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n", inputs: { fxFlexOffset: "fxFlexOffset", "fxFlexOffset.xs": "fxFlexOffset.xs", "fxFlexOffset.sm": "fxFlexOffset.sm", "fxFlexOffset.md": "fxFlexOffset.md", "fxFlexOffset.lg": "fxFlexOffset.lg", "fxFlexOffset.xl": "fxFlexOffset.xl", "fxFlexOffset.lt-sm": "fxFlexOffset.lt-sm", "fxFlexOffset.lt-md": "fxFlexOffset.lt-md", "fxFlexOffset.lt-lg": "fxFlexOffset.lt-lg", "fxFlexOffset.lt-xl": "fxFlexOffset.lt-xl", "fxFlexOffset.gt-xs": "fxFlexOffset.gt-xs", "fxFlexOffset.gt-sm": "fxFlexOffset.gt-sm", "fxFlexOffset.gt-md": "fxFlexOffset.gt-md", "fxFlexOffset.gt-lg": "fxFlexOffset.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultFlexOffsetDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const flexOffsetCacheRowRtl = new Map();
const flexOffsetCacheColumnRtl = new Map();
const flexOffsetCacheRowLtr = new Map();
const flexOffsetCacheColumnLtr = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1vZmZzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2ZsZXgvZmxleC1vZmZzZXQvZmxleC1vZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVuRixPQUFPLEVBRUwsY0FBYyxFQUNkLFlBQVksRUFHWixTQUFTLElBQUksUUFBUSxFQUNyQixhQUFhLEdBRWQsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFTekMsTUFBTSxPQUFPLHNCQUF1QixTQUFRLFlBQVk7SUFDdEQsWUFBMkMsT0FBNEI7UUFDckUsS0FBSyxFQUFFLENBQUM7UUFEaUMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7SUFFdkUsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjLEVBQUUsTUFBd0I7UUFDbEQsTUFBTSxLQUFOLE1BQU0sR0FBSyxHQUFHLEVBQUM7UUFDZixNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUM7U0FDdkI7UUFDRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQzFFLE1BQU0sTUFBTSxHQUFvQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvRCxFQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFFM0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7bUhBbEJVLHNCQUFzQixrQkFDYixhQUFhO3VIQUR0QixzQkFBc0IsY0FEVixNQUFNOzJGQUNsQixzQkFBc0I7a0JBRGxDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFFakIsTUFBTTsyQkFBQyxhQUFhOztBQW9CbkMsTUFBTSxNQUFNLEdBQUc7SUFDYixjQUFjLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCO0lBQ3ZFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLG9CQUFvQjtJQUNoRixvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0I7SUFDdEYsb0JBQW9CLEVBQUUsb0JBQW9CO0NBQzNDLENBQUM7QUFDRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7R0FHRztBQUVILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxjQUFjO0lBR3JELFlBQVksS0FBaUIsRUFDUCxjQUE4QixFQUN4QyxZQUFvQyxFQUNwQyxPQUF3QixFQUN4QixNQUFrQjtRQUM1QixLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFKeEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBSGpDLGtCQUFhLEdBQUcsYUFBYSxDQUFDO1FBUS9DLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEMsMEVBQTBFO1FBQzFFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsT0FBTztpQkFDVCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUM7aUJBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsb0JBQW9CO0lBQ3BCLGdEQUFnRDtJQUVoRDs7OztPQUlHO0lBQ2dCLGVBQWUsQ0FBQyxRQUF1QixFQUFFO1FBQzFELDBFQUEwRTtRQUMxRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGFBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7UUFDbEQsSUFBSSxNQUFNLEtBQUssS0FBSyxJQUFJLEtBQUssRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLHFCQUFxQixDQUFDO1NBQ3pDO2FBQU0sSUFBSSxNQUFNLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUM7U0FDekM7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUksS0FBSyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsd0JBQXdCLENBQUM7U0FDNUM7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQztTQUM1QztRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7O2dIQTFDVSxtQkFBbUIsMEVBS0osc0JBQXNCO29HQUxyQyxtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsU0FBUztnSEFNa0Isc0JBQXNCO0FBeUNsRCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsbUJBQW1CO0lBRG5FOztRQUVxQixXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3BDOzt1SEFGWSwwQkFBMEI7MkdBQTFCLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQUR0QyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQzs7QUFLN0IsTUFBTSxxQkFBcUIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0RSxNQUFNLHdCQUF3QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3pFLE1BQU0scUJBQXFCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEUsTUFBTSx3QkFBd0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgSW5qZWN0YWJsZSwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBTdHlsZVV0aWxzLFxuICDJtW11bHRpcGx5IGFzIG11bHRpcGx5LFxuICBMQVlPVVRfQ09ORklHLFxuICBMYXlvdXRDb25maWdPcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcbmltcG9ydCB7aXNGbG93SG9yaXpvbnRhbH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIEZsZXhPZmZzZXRQYXJlbnQge1xuICBsYXlvdXQ6IHN0cmluZztcbiAgaXNSdGw6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEZsZXhPZmZzZXRTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KExBWU9VVF9DT05GSUcpIHByaXZhdGUgX2NvbmZpZzogTGF5b3V0Q29uZmlnT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBidWlsZFN0eWxlcyhvZmZzZXQ6IHN0cmluZywgcGFyZW50OiBGbGV4T2Zmc2V0UGFyZW50KSB7XG4gICAgb2Zmc2V0IHx8PSAnMCc7XG4gICAgb2Zmc2V0ID0gbXVsdGlwbHkob2Zmc2V0LCB0aGlzLl9jb25maWcubXVsdGlwbGllcik7XG4gICAgY29uc3QgaXNQZXJjZW50ID0gU3RyaW5nKG9mZnNldCkuaW5kZXhPZignJScpID4gLTE7XG4gICAgY29uc3QgaXNQeCA9IFN0cmluZyhvZmZzZXQpLmluZGV4T2YoJ3B4JykgPiAtMTtcbiAgICBpZiAoIWlzUHggJiYgIWlzUGVyY2VudCAmJiAhaXNOYU4oK29mZnNldCkpIHtcbiAgICAgIG9mZnNldCA9IGAke29mZnNldH0lYDtcbiAgICB9XG4gICAgY29uc3QgaG9yaXpvbnRhbExheW91dEtleSA9IHBhcmVudC5pc1J0bCA/ICdtYXJnaW4tcmlnaHQnIDogJ21hcmdpbi1sZWZ0JztcbiAgICBjb25zdCBzdHlsZXM6IFN0eWxlRGVmaW5pdGlvbiA9IGlzRmxvd0hvcml6b250YWwocGFyZW50LmxheW91dCkgP1xuICAgICAge1tob3Jpem9udGFsTGF5b3V0S2V5XTogb2Zmc2V0fSA6IHsnbWFyZ2luLXRvcCc6IG9mZnNldH07XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2Z4RmxleE9mZnNldCcsICdmeEZsZXhPZmZzZXQueHMnLCAnZnhGbGV4T2Zmc2V0LnNtJywgJ2Z4RmxleE9mZnNldC5tZCcsXG4gICdmeEZsZXhPZmZzZXQubGcnLCAnZnhGbGV4T2Zmc2V0LnhsJywgJ2Z4RmxleE9mZnNldC5sdC1zbScsICdmeEZsZXhPZmZzZXQubHQtbWQnLFxuICAnZnhGbGV4T2Zmc2V0Lmx0LWxnJywgJ2Z4RmxleE9mZnNldC5sdC14bCcsICdmeEZsZXhPZmZzZXQuZ3QteHMnLCAnZnhGbGV4T2Zmc2V0Lmd0LXNtJyxcbiAgJ2Z4RmxleE9mZnNldC5ndC1tZCcsICdmeEZsZXhPZmZzZXQuZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtmeEZsZXhPZmZzZXRdLCBbZnhGbGV4T2Zmc2V0LnhzXSwgW2Z4RmxleE9mZnNldC5zbV0sIFtmeEZsZXhPZmZzZXQubWRdLFxuICBbZnhGbGV4T2Zmc2V0LmxnXSwgW2Z4RmxleE9mZnNldC54bF0sIFtmeEZsZXhPZmZzZXQubHQtc21dLCBbZnhGbGV4T2Zmc2V0Lmx0LW1kXSxcbiAgW2Z4RmxleE9mZnNldC5sdC1sZ10sIFtmeEZsZXhPZmZzZXQubHQteGxdLCBbZnhGbGV4T2Zmc2V0Lmd0LXhzXSwgW2Z4RmxleE9mZnNldC5ndC1zbV0sXG4gIFtmeEZsZXhPZmZzZXQuZ3QtbWRdLCBbZnhGbGV4T2Zmc2V0Lmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnZmxleC1vZmZzZXQnIGZsZXhib3ggc3R5bGluZyBkaXJlY3RpdmVcbiAqIENvbmZpZ3VyZXMgdGhlICdtYXJnaW4tbGVmdCcgb2YgdGhlIGVsZW1lbnQgaW4gYSBsYXlvdXQgY29udGFpbmVyXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEZsZXhPZmZzZXREaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ2ZsZXgtb2Zmc2V0JztcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBGbGV4T2Zmc2V0U3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIsXG4gICAgICAgICAgICAgIHN0eWxlcjogU3R5bGVVdGlscykge1xuICAgIHN1cGVyKGVsUmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KFt0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZV0pO1xuICAgIC8vIFBhcmVudCBET00gYGxheW91dC1nYXBgIHdpdGggYWZmZWN0IHRoZSBuZXN0ZWQgY2hpbGQgd2l0aCBgZmxleC1vZmZzZXRgXG4gICAgaWYgKHRoaXMucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5tYXJzaGFsXG4gICAgICAgIC50cmFja1ZhbHVlKHRoaXMucGFyZW50RWxlbWVudCwgJ2xheW91dC1nYXAnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95U3ViamVjdCkpXG4gICAgICAgIC5zdWJzY3JpYmUodGhpcy50cmlnZ2VyVXBkYXRlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICogVXNpbmcgdGhlIGN1cnJlbnQgZnhGbGV4T2Zmc2V0IHZhbHVlLCB1cGRhdGUgdGhlIGlubGluZSBDU1NcbiAgICogTk9URTogdGhpcyB3aWxsIGFzc2lnbiBgbWFyZ2luLWxlZnRgIGlmIHRoZSBwYXJlbnQgZmxleC1kaXJlY3Rpb24gPT0gJ3JvdycsXG4gICAqICAgICAgIG90aGVyd2lzZSBgbWFyZ2luLXRvcGAgaXMgdXNlZCBmb3IgdGhlIG9mZnNldC5cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IHN0cmluZ3xudW1iZXIgPSAnJyk6IHZvaWQge1xuICAgIC8vIFRoZSBmbGV4LWRpcmVjdGlvbiBvZiB0aGlzIGVsZW1lbnQncyBmbGV4IGNvbnRhaW5lci4gRGVmYXVsdHMgdG8gJ3JvdycuXG4gICAgY29uc3QgbGF5b3V0ID0gdGhpcy5nZXRGbGV4Rmxvd0RpcmVjdGlvbih0aGlzLnBhcmVudEVsZW1lbnQhLCB0cnVlKTtcbiAgICBjb25zdCBpc1J0bCA9IHRoaXMuZGlyZWN0aW9uYWxpdHkudmFsdWUgPT09ICdydGwnO1xuICAgIGlmIChsYXlvdXQgPT09ICdyb3cnICYmIGlzUnRsKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBmbGV4T2Zmc2V0Q2FjaGVSb3dSdGw7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdyb3cnICYmICFpc1J0bCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleE9mZnNldENhY2hlUm93THRyO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiBpc1J0bCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleE9mZnNldENhY2hlQ29sdW1uUnRsO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiAhaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZUNvbHVtbkx0cjtcbiAgICB9XG4gICAgdGhpcy5hZGRTdHlsZXModmFsdWUgKyAnJywge2xheW91dCwgaXNSdGx9KTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RmxleE9mZnNldERpcmVjdGl2ZSBleHRlbmRzIEZsZXhPZmZzZXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5jb25zdCBmbGV4T2Zmc2V0Q2FjaGVSb3dSdGw6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBmbGV4T2Zmc2V0Q2FjaGVDb2x1bW5SdGw6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBmbGV4T2Zmc2V0Q2FjaGVSb3dMdHI6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBmbGV4T2Zmc2V0Q2FjaGVDb2x1bW5MdHI6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG4iXX0=