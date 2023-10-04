/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { takeUntil } from 'rxjs/operators';
import { extendObject } from '@angular/flex-layout/_private-utils';
import { LAYOUT_VALUES, isFlowHorizontal } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class LayoutAlignStyleBuilder extends StyleBuilder {
    buildStyles(align, parent) {
        const css = {}, [mainAxis, crossAxis] = align.split(' ');
        // Main axis
        switch (mainAxis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
                break;
            case 'end':
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default:
                css['justify-content'] = 'flex-start'; // default main axis
                break;
        }
        // Cross-axis
        switch (crossAxis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'space-between':
                css['align-content'] = 'space-between';
                css['align-items'] = 'stretch';
                break;
            case 'space-around':
                css['align-content'] = 'space-around';
                css['align-items'] = 'stretch';
                break;
            case 'baseline':
                css['align-content'] = 'stretch';
                css['align-items'] = 'baseline';
                break;
            case 'stretch':
            default: // 'stretch'
                css['align-items'] = css['align-content'] = 'stretch'; // default cross axis
                break;
        }
        return extendObject(css, {
            'display': parent.inline ? 'inline-flex' : 'flex',
            'flex-direction': parent.layout,
            'box-sizing': 'border-box',
            'max-width': crossAxis === 'stretch' ?
                !isFlowHorizontal(parent.layout) ? '100%' : null : null,
            'max-height': crossAxis === 'stretch' ?
                isFlowHorizontal(parent.layout) ? '100%' : null : null,
        });
    }
}
LayoutAlignStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
LayoutAlignStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutAlignStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxLayoutAlign', 'fxLayoutAlign.xs', 'fxLayoutAlign.sm', 'fxLayoutAlign.md',
    'fxLayoutAlign.lg', 'fxLayoutAlign.xl', 'fxLayoutAlign.lt-sm', 'fxLayoutAlign.lt-md',
    'fxLayoutAlign.lt-lg', 'fxLayoutAlign.lt-xl', 'fxLayoutAlign.gt-xs', 'fxLayoutAlign.gt-sm',
    'fxLayoutAlign.gt-md', 'fxLayoutAlign.gt-lg'
];
const selector = `
  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],
  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],
  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],
  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
`;
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
export class LayoutAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout-align';
        this.layout = 'row'; // default flex-direction
        this.inline = false; // default inline value
        this.init();
        this.marshal.trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    updateWithValue(value) {
        const layout = this.layout || 'row';
        const inline = this.inline;
        if (layout === 'row' && inline) {
            this.styleCache = layoutAlignHorizontalInlineCache;
        }
        else if (layout === 'row' && !inline) {
            this.styleCache = layoutAlignHorizontalCache;
        }
        else if (layout === 'row-reverse' && inline) {
            this.styleCache = layoutAlignHorizontalRevInlineCache;
        }
        else if (layout === 'row-reverse' && !inline) {
            this.styleCache = layoutAlignHorizontalRevCache;
        }
        else if (layout === 'column' && inline) {
            this.styleCache = layoutAlignVerticalInlineCache;
        }
        else if (layout === 'column' && !inline) {
            this.styleCache = layoutAlignVerticalCache;
        }
        else if (layout === 'column-reverse' && inline) {
            this.styleCache = layoutAlignVerticalRevInlineCache;
        }
        else if (layout === 'column-reverse' && !inline) {
            this.styleCache = layoutAlignVerticalRevCache;
        }
        this.addStyles(value, { layout, inline });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    onLayoutChange(matcher) {
        const layoutKeys = matcher.value.split(' ');
        this.layout = layoutKeys[0];
        this.inline = matcher.value.includes('inline');
        if (!LAYOUT_VALUES.find(x => x === this.layout)) {
            this.layout = 'row';
        }
        this.triggerUpdate();
    }
}
LayoutAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutAlignDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutAlignStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
LayoutAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: LayoutAlignDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: LayoutAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutAlignStyleBuilder }, { type: i1.MediaMarshaller }]; } });
export class DefaultLayoutAlignDirective extends LayoutAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultLayoutAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultLayoutAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: DefaultLayoutAlignDirective, selector: "\n  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],\n  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],\n  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],\n  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]\n", inputs: { fxLayoutAlign: "fxLayoutAlign", "fxLayoutAlign.xs": "fxLayoutAlign.xs", "fxLayoutAlign.sm": "fxLayoutAlign.sm", "fxLayoutAlign.md": "fxLayoutAlign.md", "fxLayoutAlign.lg": "fxLayoutAlign.lg", "fxLayoutAlign.xl": "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm": "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md": "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg": "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl": "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs": "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm": "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md": "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg": "fxLayoutAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: DefaultLayoutAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutAlignHorizontalCache = new Map();
const layoutAlignVerticalCache = new Map();
const layoutAlignHorizontalRevCache = new Map();
const layoutAlignVerticalRevCache = new Map();
const layoutAlignHorizontalInlineCache = new Map();
const layoutAlignVerticalInlineCache = new Map();
const layoutAlignHorizontalRevInlineCache = new Map();
const layoutAlignVerticalRevInlineCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LWFsaWduLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC1hbGlnbi9sYXlvdXQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFDZCxZQUFZLEdBS2IsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBUXBGLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxZQUFZO0lBQ3ZELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBeUI7UUFDbEQsTUFBTSxHQUFHLEdBQW9CLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFFLFlBQVk7UUFDWixRQUFRLFFBQVEsRUFBRTtZQUNoQixLQUFLLFFBQVE7Z0JBQ1gsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUNsQyxNQUFNO1lBQ1IsS0FBSyxjQUFjO2dCQUNqQixHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxjQUFjLENBQUM7Z0JBQ3hDLE1BQU07WUFDUixLQUFLLGVBQWU7Z0JBQ2xCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLGVBQWUsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssY0FBYztnQkFDakIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsY0FBYyxDQUFDO2dCQUN4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QUssQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOztpSEF6RFUsb0JBQW9CLHNFQU9MLHVCQUF1QjtxR0FQdEMsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFNBQVM7NEdBUWtCLHVCQUF1QjtBQXNEbkQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLG9CQUFvQjtJQURyRTs7UUFFcUIsV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUNwQzs7d0hBRlksMkJBQTJCOzRHQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFEdkMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUM7O0FBSzdCLE1BQU0sMEJBQTBCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDM0UsTUFBTSx3QkFBd0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN6RSxNQUFNLDZCQUE2QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzlFLE1BQU0sMkJBQTJCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDNUUsTUFBTSxnQ0FBZ0MsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqRixNQUFNLDhCQUE4QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9FLE1BQU0sbUNBQW1DLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDcEYsTUFBTSxpQ0FBaUMsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBTdHlsZVV0aWxzLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEVsZW1lbnRNYXRjaGVyLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7ZXh0ZW5kT2JqZWN0fSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9fcHJpdmF0ZS11dGlscyc7XG5pbXBvcnQge0xBWU9VVF9WQUxVRVMsIGlzRmxvd0hvcml6b250YWx9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBMYXlvdXRBbGlnblBhcmVudCB7XG4gIGxheW91dDogc3RyaW5nO1xuICBpbmxpbmU6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIExheW91dEFsaWduU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoYWxpZ246IHN0cmluZywgcGFyZW50OiBMYXlvdXRBbGlnblBhcmVudCkge1xuICAgIGNvbnN0IGNzczogU3R5bGVEZWZpbml0aW9uID0ge30sIFttYWluQXhpcywgY3Jvc3NBeGlzXSA9IGFsaWduLnNwbGl0KCcgJyk7XG5cbiAgICAvLyBNYWluIGF4aXNcbiAgICBzd2l0Y2ggKG1haW5BeGlzKSB7XG4gICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ2NlbnRlcic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3BhY2UtYXJvdW5kJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdzcGFjZS1hcm91bmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWJldHdlZW4nOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ3NwYWNlLWJldHdlZW4nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWV2ZW5seSc6XG4gICAgICAgIGNzc1snanVzdGlmeS1jb250ZW50J10gPSAnc3BhY2UtZXZlbmx5JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbmQnOlxuICAgICAgY2FzZSAnZmxleC1lbmQnOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ2ZsZXgtZW5kJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdGFydCc6XG4gICAgICBjYXNlICdmbGV4LXN0YXJ0JzpcbiAgICAgIGRlZmF1bHQgOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ2ZsZXgtc3RhcnQnOyAgLy8gZGVmYXVsdCBtYWluIGF4aXNcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gQ3Jvc3MtYXhpc1xuICAgIHN3aXRjaCAoY3Jvc3NBeGlzKSB7XG4gICAgICBjYXNlICdzdGFydCc6XG4gICAgICBjYXNlICdmbGV4LXN0YXJ0JzpcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gY3NzWydhbGlnbi1jb250ZW50J10gPSAnZmxleC1zdGFydCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2VudGVyJzpcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gY3NzWydhbGlnbi1jb250ZW50J10gPSAnY2VudGVyJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlbmQnOlxuICAgICAgY2FzZSAnZmxleC1lbmQnOlxuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdmbGV4LWVuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3BhY2UtYmV0d2Vlbic6XG4gICAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWJldHdlZW4nO1xuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RyZXRjaCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3BhY2UtYXJvdW5kJzpcbiAgICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3BhY2UtYXJvdW5kJztcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gJ3N0cmV0Y2gnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Jhc2VsaW5lJzpcbiAgICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3RyZXRjaCc7XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdiYXNlbGluZSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBkZWZhdWx0IDogLy8gJ3N0cmV0Y2gnXG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9IGNzc1snYWxpZ24tY29udGVudCddID0gJ3N0cmV0Y2gnOyAgIC8vIGRlZmF1bHQgY3Jvc3MgYXhpc1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZXh0ZW5kT2JqZWN0KGNzcywge1xuICAgICAgJ2Rpc3BsYXknIDogcGFyZW50LmlubGluZSA/ICdpbmxpbmUtZmxleCcgOiAnZmxleCcsXG4gICAgICAnZmxleC1kaXJlY3Rpb24nIDogcGFyZW50LmxheW91dCxcbiAgICAgICdib3gtc2l6aW5nJyA6ICdib3JkZXItYm94JyxcbiAgICAgICdtYXgtd2lkdGgnOiBjcm9zc0F4aXMgPT09ICdzdHJldGNoJyA/XG4gICAgICAgICFpc0Zsb3dIb3Jpem9udGFsKHBhcmVudC5sYXlvdXQpID8gJzEwMCUnIDogbnVsbCA6IG51bGwsXG4gICAgICAnbWF4LWhlaWdodCc6IGNyb3NzQXhpcyA9PT0gJ3N0cmV0Y2gnID9cbiAgICAgICAgaXNGbG93SG9yaXpvbnRhbChwYXJlbnQubGF5b3V0KSA/ICcxMDAlJyA6IG51bGwgOiBudWxsLFxuICAgIH0pIGFzIFN0eWxlRGVmaW5pdGlvbjtcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeExheW91dEFsaWduJywgJ2Z4TGF5b3V0QWxpZ24ueHMnLCAnZnhMYXlvdXRBbGlnbi5zbScsICdmeExheW91dEFsaWduLm1kJyxcbiAgJ2Z4TGF5b3V0QWxpZ24ubGcnLCAnZnhMYXlvdXRBbGlnbi54bCcsICdmeExheW91dEFsaWduLmx0LXNtJywgJ2Z4TGF5b3V0QWxpZ24ubHQtbWQnLFxuICAnZnhMYXlvdXRBbGlnbi5sdC1sZycsICdmeExheW91dEFsaWduLmx0LXhsJywgJ2Z4TGF5b3V0QWxpZ24uZ3QteHMnLCAnZnhMYXlvdXRBbGlnbi5ndC1zbScsXG4gICdmeExheW91dEFsaWduLmd0LW1kJywgJ2Z4TGF5b3V0QWxpZ24uZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtmeExheW91dEFsaWduXSwgW2Z4TGF5b3V0QWxpZ24ueHNdLCBbZnhMYXlvdXRBbGlnbi5zbV0sIFtmeExheW91dEFsaWduLm1kXSxcbiAgW2Z4TGF5b3V0QWxpZ24ubGddLCBbZnhMYXlvdXRBbGlnbi54bF0sIFtmeExheW91dEFsaWduLmx0LXNtXSwgW2Z4TGF5b3V0QWxpZ24ubHQtbWRdLFxuICBbZnhMYXlvdXRBbGlnbi5sdC1sZ10sIFtmeExheW91dEFsaWduLmx0LXhsXSwgW2Z4TGF5b3V0QWxpZ24uZ3QteHNdLCBbZnhMYXlvdXRBbGlnbi5ndC1zbV0sXG4gIFtmeExheW91dEFsaWduLmd0LW1kXSwgW2Z4TGF5b3V0QWxpZ24uZ3QtbGddXG5gO1xuXG4vKipcbiAqICdsYXlvdXQtYWxpZ24nIGZsZXhib3ggc3R5bGluZyBkaXJlY3RpdmVcbiAqICBEZWZpbmVzIHBvc2l0aW9uaW5nIG9mIGNoaWxkIGVsZW1lbnRzIGFsb25nIG1haW4gYW5kIGNyb3NzIGF4aXMgaW4gYSBsYXlvdXQgY29udGFpbmVyXG4gKiAgT3B0aW9uYWwgdmFsdWVzOiB7bWFpbi1heGlzfSB2YWx1ZXMgb3Ige21haW4tYXhpcyBjcm9zcy1heGlzfSB2YWx1ZSBwYWlyc1xuICpcbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL2ovanVzdGlmeS1jb250ZW50L1xuICogIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9hbG1hbmFjL3Byb3BlcnRpZXMvYS9hbGlnbi1pdGVtcy9cbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL2EvYWxpZ24tY29udGVudC9cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTGF5b3V0QWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ2xheW91dC1hbGlnbic7XG4gIHByb3RlY3RlZCBsYXlvdXQgPSAncm93JzsgIC8vIGRlZmF1bHQgZmxleC1kaXJlY3Rpb25cbiAgcHJvdGVjdGVkIGlubGluZSA9IGZhbHNlOyAgLy8gZGVmYXVsdCBpbmxpbmUgdmFsdWVcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBMYXlvdXRBbGlnblN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5tYXJzaGFsLnRyYWNrVmFsdWUodGhpcy5uYXRpdmVFbGVtZW50LCAnbGF5b3V0JylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3lTdWJqZWN0KSlcbiAgICAgIC5zdWJzY3JpYmUodGhpcy5vbkxheW91dENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IGxheW91dCA9IHRoaXMubGF5b3V0IHx8ICdyb3cnO1xuICAgIGNvbnN0IGlubGluZSA9IHRoaXMuaW5saW5lO1xuICAgIGlmIChsYXlvdXQgPT09ICdyb3cnICYmIGlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25Ib3Jpem9udGFsSW5saW5lQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdyb3cnICYmICFpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduSG9yaXpvbnRhbENhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAncm93LXJldmVyc2UnICYmIGlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25Ib3Jpem9udGFsUmV2SW5saW5lQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdyb3ctcmV2ZXJzZScgJiYgIWlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25Ib3Jpem9udGFsUmV2Q2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4nICYmIGlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25WZXJ0aWNhbElubGluZUNhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiAhaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnblZlcnRpY2FsQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4tcmV2ZXJzZScgJiYgaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnblZlcnRpY2FsUmV2SW5saW5lQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4tcmV2ZXJzZScgJiYgIWlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25WZXJ0aWNhbFJldkNhY2hlO1xuICAgIH1cbiAgICB0aGlzLmFkZFN0eWxlcyh2YWx1ZSwge2xheW91dCwgaW5saW5lfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGUgdGhlIHBhcmVudCBjb250YWluZXIgJ2ZsZXgtZGlyZWN0aW9uJyBhbmQgdXBkYXRlIHRoZSAnZmxleCcgc3R5bGVzXG4gICAqL1xuICBwcm90ZWN0ZWQgb25MYXlvdXRDaGFuZ2UobWF0Y2hlcjogRWxlbWVudE1hdGNoZXIpIHtcbiAgICBjb25zdCBsYXlvdXRLZXlzOiBzdHJpbmdbXSA9IG1hdGNoZXIudmFsdWUuc3BsaXQoJyAnKTtcbiAgICB0aGlzLmxheW91dCA9IGxheW91dEtleXNbMF07XG4gICAgdGhpcy5pbmxpbmUgPSBtYXRjaGVyLnZhbHVlLmluY2x1ZGVzKCdpbmxpbmUnKTtcbiAgICBpZiAoIUxBWU9VVF9WQUxVRVMuZmluZCh4ID0+IHggPT09IHRoaXMubGF5b3V0KSkge1xuICAgICAgdGhpcy5sYXlvdXQgPSAncm93JztcbiAgICB9XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdExheW91dEFsaWduRGlyZWN0aXZlIGV4dGVuZHMgTGF5b3V0QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5jb25zdCBsYXlvdXRBbGlnbkhvcml6b250YWxDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduVmVydGljYWxDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduSG9yaXpvbnRhbFJldkNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25WZXJ0aWNhbFJldkNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25Ib3Jpem9udGFsSW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnblZlcnRpY2FsSW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnbkhvcml6b250YWxSZXZJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduVmVydGljYWxSZXZJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbiJdfQ==