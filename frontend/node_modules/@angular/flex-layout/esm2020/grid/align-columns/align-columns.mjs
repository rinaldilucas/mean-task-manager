/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Input } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
export class GridAlignColumnsStyleBuilder extends StyleBuilder {
    buildStyles(input, parent) {
        return buildCss(input || `${DEFAULT_MAIN} ${DEFAULT_CROSS}`, parent.inline);
    }
}
GridAlignColumnsStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignColumnsStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAlignColumnsStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignColumnsStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignColumnsStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignColumnsDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align-columns';
        this._inline = false;
        this.init();
    }
    get inline() { return this._inline; }
    set inline(val) { this._inline = coerceBooleanProperty(val); }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? alignColumnsInlineCache : alignColumnsCache;
        this.addStyles(value, { inline: this.inline });
    }
}
GridAlignColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignColumnsDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignColumnsStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAlignColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: GridAlignColumnsDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridAlignColumnsDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridAlignColumnsStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; }, propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const alignColumnsCache = new Map();
const alignColumnsInlineCache = new Map();
const inputs = [
    'gdAlignColumns',
    'gdAlignColumns.xs', 'gdAlignColumns.sm', 'gdAlignColumns.md',
    'gdAlignColumns.lg', 'gdAlignColumns.xl', 'gdAlignColumns.lt-sm',
    'gdAlignColumns.lt-md', 'gdAlignColumns.lt-lg', 'gdAlignColumns.lt-xl',
    'gdAlignColumns.gt-xs', 'gdAlignColumns.gt-sm', 'gdAlignColumns.gt-md',
    'gdAlignColumns.gt-lg'
];
const selector = `
  [gdAlignColumns],
  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],
  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],
  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],
  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],
  [gdAlignColumns.gt-lg]
`;
/**
 * 'column alignment' CSS Grid styling directive
 * Configures the alignment in the column direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21
 */
export class DefaultGridAlignColumnsDirective extends GridAlignColumnsDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAlignColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultGridAlignColumnsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAlignColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultGridAlignColumnsDirective, selector: "\n  [gdAlignColumns],\n  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],\n  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],\n  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],\n  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],\n  [gdAlignColumns.gt-lg]\n", inputs: { gdAlignColumns: "gdAlignColumns", "gdAlignColumns.xs": "gdAlignColumns.xs", "gdAlignColumns.sm": "gdAlignColumns.sm", "gdAlignColumns.md": "gdAlignColumns.md", "gdAlignColumns.lg": "gdAlignColumns.lg", "gdAlignColumns.xl": "gdAlignColumns.xl", "gdAlignColumns.lt-sm": "gdAlignColumns.lt-sm", "gdAlignColumns.lt-md": "gdAlignColumns.lt-md", "gdAlignColumns.lt-lg": "gdAlignColumns.lt-lg", "gdAlignColumns.lt-xl": "gdAlignColumns.lt-xl", "gdAlignColumns.gt-xs": "gdAlignColumns.gt-xs", "gdAlignColumns.gt-sm": "gdAlignColumns.gt-sm", "gdAlignColumns.gt-md": "gdAlignColumns.gt-md", "gdAlignColumns.gt-lg": "gdAlignColumns.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultGridAlignColumnsDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align, inline) {
    const css = {}, [mainAxis, crossAxis] = align.split(' ');
    // Main axis
    switch (mainAxis) {
        case 'center':
            css['align-content'] = 'center';
            break;
        case 'space-around':
            css['align-content'] = 'space-around';
            break;
        case 'space-between':
            css['align-content'] = 'space-between';
            break;
        case 'space-evenly':
            css['align-content'] = 'space-evenly';
            break;
        case 'end':
            css['align-content'] = 'end';
            break;
        case 'start':
            css['align-content'] = 'start';
            break;
        case 'stretch':
            css['align-content'] = 'stretch';
            break;
        default:
            css['align-content'] = DEFAULT_MAIN; // default main axis
            break;
    }
    // Cross-axis
    switch (crossAxis) {
        case 'start':
            css['align-items'] = 'start';
            break;
        case 'center':
            css['align-items'] = 'center';
            break;
        case 'end':
            css['align-items'] = 'end';
            break;
        case 'stretch':
            css['align-items'] = 'stretch';
            break;
        default: // 'stretch'
            css['align-items'] = DEFAULT_CROSS; // default cross axis
            break;
    }
    css['display'] = inline ? 'inline-grid' : 'grid';
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpZ24tY29sdW1ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9hbGlnbi1jb2x1bW5zL2FsaWduLWNvbHVtbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxjQUFjLEVBRWQsWUFBWSxHQUdiLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUU1RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDN0IsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBT2hDLE1BQU0sT0FBTyw0QkFBNkIsU0FBUSxZQUFZO0lBQzVELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBOEI7UUFDdkQsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsWUFBWSxJQUFJLGFBQWEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RSxDQUFDOzt5SEFIVSw0QkFBNEI7NkhBQTVCLDRCQUE0QixjQURoQixNQUFNOzJGQUNsQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQVFoQyxNQUFNLE9BQU8seUJBQTBCLFNBQVEsY0FBYztJQVMzRCxZQUFZLFVBQXNCLEVBQ3RCLFlBQTBDLEVBQzFDLE1BQWtCLEVBQ2xCLE9BQXdCO1FBQ2xDLEtBQUssQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVhoQyxrQkFBYSxHQUFHLG9CQUFvQixDQUFDO1FBSzlDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFPeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFD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LENBQUM7WUFDN0IsTUFBTTtRQUNSLEtBQUssUUFBUTtZQUNYLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTTtRQUNSLEtBQUssS0FBSztZQUNSLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDM0IsTUFBTTtRQUNSLEtBQUssU0FBUztZQUNaLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDL0IsTUFBTTtRQUNSLFNBQVUsWUFBWTtZQUNwQixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUcscUJBQXFCO1lBQzNELE1BQU07S0FDVDtJQUVELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRWpELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGFibGUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZVV0aWxzLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgTWVkaWFNYXJzaGFsbGVyLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5jb25zdCBERUZBVUxUX01BSU4gPSAnc3RhcnQnO1xuY29uc3QgREVGQVVMVF9DUk9TUyA9ICdzdHJldGNoJztcblxuZXhwb3J0IGludGVyZmFjZSBHcmlkQWxpZ25Db2x1bW5zUGFyZW50IHtcbiAgaW5saW5lOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBHcmlkQWxpZ25Db2x1bW5zU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZywgcGFyZW50OiBHcmlkQWxpZ25Db2x1bW5zUGFyZW50KSB7XG4gICAgcmV0dXJuIGJ1aWxkQ3NzKGlucHV0IHx8IGAke0RFRkFVTFRfTUFJTn0gJHtERUZBVUxUX0NST1NTfWAsIHBhcmVudC5pbmxpbmUpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnZ3JpZC1hbGlnbi1jb2x1bW5zJztcblxuICBASW5wdXQoJ2dkSW5saW5lJylcbiAgZ2V0IGlubGluZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lubGluZTsgfVxuICBzZXQgaW5saW5lKHZhbDogYm9vbGVhbikgeyB0aGlzLl9pbmxpbmUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTsgfVxuICBwcm90ZWN0ZWQgX2lubGluZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogR3JpZEFsaWduQ29sdW1uc1N0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdHlsZUNhY2hlID0gdGhpcy5pbmxpbmUgPyBhbGlnbkNvbHVtbnNJbmxpbmVDYWNoZSA6IGFsaWduQ29sdW1uc0NhY2hlO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlLCB7aW5saW5lOiB0aGlzLmlubGluZX0pO1xuICB9XG59XG5cbmNvbnN0IGFsaWduQ29sdW1uc0NhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgYWxpZ25Db2x1bW5zSW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkQWxpZ25Db2x1bW5zJyxcbiAgJ2dkQWxpZ25Db2x1bW5zLnhzJywgJ2dkQWxpZ25Db2x1bW5zLnNtJywgJ2dkQWxpZ25Db2x1bW5zLm1kJyxcbiAgJ2dkQWxpZ25Db2x1bW5zLmxnJywgJ2dkQWxpZ25Db2x1bW5zLnhsJywgJ2dkQWxpZ25Db2x1bW5zLmx0LXNtJyxcbiAgJ2dkQWxpZ25Db2x1bW5zLmx0LW1kJywgJ2dkQWxpZ25Db2x1bW5zLmx0LWxnJywgJ2dkQWxpZ25Db2x1bW5zLmx0LXhsJyxcbiAgJ2dkQWxpZ25Db2x1bW5zLmd0LXhzJywgJ2dkQWxpZ25Db2x1bW5zLmd0LXNtJywgJ2dkQWxpZ25Db2x1bW5zLmd0LW1kJyxcbiAgJ2dkQWxpZ25Db2x1bW5zLmd0LWxnJ1xuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZ2RBbGlnbkNvbHVtbnNdLFxuICBbZ2RBbGlnbkNvbHVtbnMueHNdLCBbZ2RBbGlnbkNvbHVtbnMuc21dLCBbZ2RBbGlnbkNvbHVtbnMubWRdLFxuICBbZ2RBbGlnbkNvbHVtbnMubGddLCBbZ2RBbGlnbkNvbHVtbnMueGxdLCBbZ2RBbGlnbkNvbHVtbnMubHQtc21dLFxuICBbZ2RBbGlnbkNvbHVtbnMubHQtbWRdLCBbZ2RBbGlnbkNvbHVtbnMubHQtbGddLCBbZ2RBbGlnbkNvbHVtbnMubHQteGxdLFxuICBbZ2RBbGlnbkNvbHVtbnMuZ3QteHNdLCBbZ2RBbGlnbkNvbHVtbnMuZ3Qtc21dLCBbZ2RBbGlnbkNvbHVtbnMuZ3QtbWRdLFxuICBbZ2RBbGlnbkNvbHVtbnMuZ3QtbGddXG5gO1xuXG4vKipcbiAqICdjb2x1bW4gYWxpZ25tZW50JyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgYWxpZ25tZW50IGluIHRoZSBjb2x1bW4gZGlyZWN0aW9uXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI2FydGljbGUtaGVhZGVyLWlkLTE5XG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI2FydGljbGUtaGVhZGVyLWlkLTIxXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRHcmlkQWxpZ25Db2x1bW5zRGlyZWN0aXZlIGV4dGVuZHMgR3JpZEFsaWduQ29sdW1uc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3NzKGFsaWduOiBzdHJpbmcsIGlubGluZTogYm9vbGVhbik6IFN0eWxlRGVmaW5pdGlvbiB7XG4gIGNvbnN0IGNzczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fSwgW21haW5BeGlzLCBjcm9zc0F4aXNdID0gYWxpZ24uc3BsaXQoJyAnKTtcblxuICAvLyBNYWluIGF4aXNcbiAgc3dpdGNoIChtYWluQXhpcykge1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3BhY2UtYXJvdW5kJzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWFyb3VuZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzcGFjZS1iZXR3ZWVuJzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWJldHdlZW4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3BhY2UtZXZlbmx5JzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWV2ZW5seSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdlbmQnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0cmV0Y2gnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3RyZXRjaCc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSBERUZBVUxUX01BSU47ICAvLyBkZWZhdWx0IG1haW4gYXhpc1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBDcm9zcy1heGlzXG4gIHN3aXRjaCAoY3Jvc3NBeGlzKSB7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnY2VudGVyJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0cmV0Y2gnOlxuICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gJ3N0cmV0Y2gnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdCA6IC8vICdzdHJldGNoJ1xuICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gREVGQVVMVF9DUk9TUzsgICAvLyBkZWZhdWx0IGNyb3NzIGF4aXNcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgY3NzWydkaXNwbGF5J10gPSBpbmxpbmUgPyAnaW5saW5lLWdyaWQnIDogJ2dyaWQnO1xuXG4gIHJldHVybiBjc3M7XG59XG4iXX0=