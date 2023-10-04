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
const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';
export class GridAlignStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return buildCss(input || ROW_DEFAULT);
    }
}
GridAlignStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAlignStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align';
        this.styleCache = alignCache;
        this.init();
    }
}
GridAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: GridAlignDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridAlignStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; } });
const alignCache = new Map();
const inputs = [
    'gdGridAlign',
    'gdGridAlign.xs', 'gdGridAlign.sm', 'gdGridAlign.md', 'gdGridAlign.lg', 'gdGridAlign.xl',
    'gdGridAlign.lt-sm', 'gdGridAlign.lt-md', 'gdGridAlign.lt-lg', 'gdGridAlign.lt-xl',
    'gdGridAlign.gt-xs', 'gdGridAlign.gt-sm', 'gdGridAlign.gt-md', 'gdGridAlign.gt-lg'
];
const selector = `
  [gdGridAlign],
  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],
  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],
  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]
`;
/**
 * 'align' CSS Grid styling directive for grid children
 *  Defines positioning of child elements along row and column axis in a grid container
 *  Optional values: {row-axis} values or {row-axis column-axis} value pairs
 *
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-justify-self
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-align-self
 */
export class DefaultGridAlignDirective extends GridAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultGridAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultGridAlignDirective, selector: "\n  [gdGridAlign],\n  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],\n  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],\n  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]\n", inputs: { gdGridAlign: "gdGridAlign", "gdGridAlign.xs": "gdGridAlign.xs", "gdGridAlign.sm": "gdGridAlign.sm", "gdGridAlign.md": "gdGridAlign.md", "gdGridAlign.lg": "gdGridAlign.lg", "gdGridAlign.xl": "gdGridAlign.xl", "gdGridAlign.lt-sm": "gdGridAlign.lt-sm", "gdGridAlign.lt-md": "gdGridAlign.lt-md", "gdGridAlign.lt-lg": "gdGridAlign.lt-lg", "gdGridAlign.lt-xl": "gdGridAlign.lt-xl", "gdGridAlign.gt-xs": "gdGridAlign.gt-xs", "gdGridAlign.gt-sm": "gdGridAlign.gt-sm", "gdGridAlign.gt-md": "gdGridAlign.gt-md", "gdGridAlign.gt-lg": "gdGridAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultGridAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align = '') {
    const css = {}, [rowAxis, columnAxis] = align.split(' ');
    // Row axis
    switch (rowAxis) {
        case 'end':
            css['justify-self'] = 'end';
            break;
        case 'center':
            css['justify-self'] = 'center';
            break;
        case 'stretch':
            css['justify-self'] = 'stretch';
            break;
        case 'start':
            css['justify-self'] = 'start';
            break;
        default:
            css['justify-self'] = ROW_DEFAULT; // default row axis
            break;
    }
    // Column axis
    switch (columnAxis) {
        case 'end':
            css['align-self'] = 'end';
            break;
        case 'center':
            css['align-self'] = 'center';
            break;
        case 'stretch':
            css['align-self'] = 'stretch';
            break;
        case 'start':
            css['align-self'] = 'start';
            break;
        default:
            css['align-self'] = COL_DEFAULT; // default column axis
            break;
    }
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1hbGlnbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9ncmlkLWFsaWduL2dyaWQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUVMLGNBQWMsRUFDZCxZQUFZLEdBR2IsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFHOUIsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFlBQVk7SUFDckQsV0FBVyxDQUFDLEtBQWE7UUFDdkIsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7O2tIQUhVLHFCQUFxQjtzSEFBckIscUJBQXFCLGNBRFQsTUFBTTsyRkFDbEIscUJBQXFCO2tCQURqQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFRaEMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFJcEQsWUFBWSxVQUFzQixFQUN0QixZQUFtQyxFQUNuQyxNQUFrQixFQUNsQixPQUF3QjtRQUNsQyxLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFOaEMsa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFVN0IsZUFBVSxHQUFHLFVBQVUsQ0FBQztRQUh6QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDOzsrR0FWVSxrQkFBa0IsNENBS0gscUJBQXFCO21HQUxwQyxrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsU0FBUzttRkFNa0IscUJBQXFCO0FBVWpELE1BQU0sVUFBVSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTNELE1BQU0sTUFBTSxHQUFHO0lBQ2IsYUFBYTtJQUNiLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQjtJQUN4RixtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUI7SUFDbEYsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CO0NBQ25GLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCO0lBRGpFOztRQUVxQixXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3BDOztzSEFGWSx5QkFBeUI7MEdBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQzs7QUFLN0IsU0FBUyxRQUFRLENBQUMsUUFBZ0IsRUFBRTtJQUNsQyxNQUFNLEdBQUcsR0FBNEIsRUFBRSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbEYsV0FBVztJQUNYLFFBQVEsT0FBTyxFQUFFO1FBQ2YsS0FBSyxLQUFLO1lBQ1IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUM1QixNQUFNO1FBQ1IsS0FBSyxRQUFRO1lBQ1gsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUMvQixNQUFNO1FBQ1IsS0FBSyxTQUFTO1lBQ1osR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUNoQyxNQUFNO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUM5QixNQUFNO1FBQ1I7WUFDRSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUUsbUJBQW1CO1lBQ3ZELE1BQU07S0FDVDtJQUVELGNBQWM7SUFDZCxRQUFRLFVBQVUsRUFBRTtRQUNsQixLQUFLLEtBQUs7WUFDUixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQzFCLE1BQU07UUFDUixLQUFLLFFBQVE7WUFDWCxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQzdCLE1BQU07UUFDUixLQUFLLFNBQVM7WUFDWixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQzlCLE1BQU07UUFDUixLQUFLLE9BQU87WUFDVixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzVCLE1BQU07UUFDUjtZQUNFLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBRSxzQkFBc0I7WUFDeEQsTUFBTTtLQUNUO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmNvbnN0IFJPV19ERUZBVUxUID0gJ3N0cmV0Y2gnO1xuY29uc3QgQ09MX0RFRkFVTFQgPSAnc3RyZXRjaCc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEdyaWRBbGlnblN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGlucHV0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYnVpbGRDc3MoaW5wdXQgfHwgUk9XX0RFRkFVTFQpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRBbGlnbkRpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgRElSRUNUSVZFX0tFWSA9ICdncmlkLWFsaWduJztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IEdyaWRBbGlnblN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgc3R5bGVDYWNoZSA9IGFsaWduQ2FjaGU7XG59XG5cbmNvbnN0IGFsaWduQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkR3JpZEFsaWduJyxcbiAgJ2dkR3JpZEFsaWduLnhzJywgJ2dkR3JpZEFsaWduLnNtJywgJ2dkR3JpZEFsaWduLm1kJywgJ2dkR3JpZEFsaWduLmxnJywgJ2dkR3JpZEFsaWduLnhsJyxcbiAgJ2dkR3JpZEFsaWduLmx0LXNtJywgJ2dkR3JpZEFsaWduLmx0LW1kJywgJ2dkR3JpZEFsaWduLmx0LWxnJywgJ2dkR3JpZEFsaWduLmx0LXhsJyxcbiAgJ2dkR3JpZEFsaWduLmd0LXhzJywgJ2dkR3JpZEFsaWduLmd0LXNtJywgJ2dkR3JpZEFsaWduLmd0LW1kJywgJ2dkR3JpZEFsaWduLmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZEdyaWRBbGlnbl0sXG4gIFtnZEdyaWRBbGlnbi54c10sIFtnZEdyaWRBbGlnbi5zbV0sIFtnZEdyaWRBbGlnbi5tZF0sIFtnZEdyaWRBbGlnbi5sZ10sW2dkR3JpZEFsaWduLnhsXSxcbiAgW2dkR3JpZEFsaWduLmx0LXNtXSwgW2dkR3JpZEFsaWduLmx0LW1kXSwgW2dkR3JpZEFsaWduLmx0LWxnXSwgW2dkR3JpZEFsaWduLmx0LXhsXSxcbiAgW2dkR3JpZEFsaWduLmd0LXhzXSwgW2dkR3JpZEFsaWduLmd0LXNtXSwgW2dkR3JpZEFsaWduLmd0LW1kXSwgW2dkR3JpZEFsaWduLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnYWxpZ24nIENTUyBHcmlkIHN0eWxpbmcgZGlyZWN0aXZlIGZvciBncmlkIGNoaWxkcmVuXG4gKiAgRGVmaW5lcyBwb3NpdGlvbmluZyBvZiBjaGlsZCBlbGVtZW50cyBhbG9uZyByb3cgYW5kIGNvbHVtbiBheGlzIGluIGEgZ3JpZCBjb250YWluZXJcbiAqICBPcHRpb25hbCB2YWx1ZXM6IHtyb3ctYXhpc30gdmFsdWVzIG9yIHtyb3ctYXhpcyBjb2x1bW4tYXhpc30gdmFsdWUgcGFpcnNcbiAqXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2Nzcy9jb21wbGV0ZS1ndWlkZS1ncmlkLyNwcm9wLWp1c3RpZnktc2VsZlxuICogIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jcHJvcC1hbGlnbi1zZWxmXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRHcmlkQWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5mdW5jdGlvbiBidWlsZENzcyhhbGlnbjogc3RyaW5nID0gJycpIHtcbiAgY29uc3QgY3NzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9LCBbcm93QXhpcywgY29sdW1uQXhpc10gPSBhbGlnbi5zcGxpdCgnICcpO1xuXG4gIC8vIFJvdyBheGlzXG4gIHN3aXRjaCAocm93QXhpcykge1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjc3NbJ2p1c3RpZnktc2VsZiddID0gJ2VuZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2p1c3RpZnktc2VsZiddID0gJ3N0cmV0Y2gnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9ICdzdGFydCc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9IFJPV19ERUZBVUxUOyAgLy8gZGVmYXVsdCByb3cgYXhpc1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBDb2x1bW4gYXhpc1xuICBzd2l0Y2ggKGNvbHVtbkF4aXMpIHtcbiAgICBjYXNlICdlbmQnOlxuICAgICAgY3NzWydhbGlnbi1zZWxmJ10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9ICdzdHJldGNoJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9IENPTF9ERUZBVUxUOyAgLy8gZGVmYXVsdCBjb2x1bW4gYXhpc1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gY3NzO1xufVxuIl19