/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { CoreModule } from '@angular/flex-layout/core';
import { DefaultLayoutDirective } from './layout/layout';
import { DefaultLayoutGapDirective } from './layout-gap/layout-gap';
import { DefaultFlexDirective } from './flex/flex';
import { DefaultFlexOrderDirective } from './flex-order/flex-order';
import { DefaultFlexOffsetDirective } from './flex-offset/flex-offset';
import { DefaultFlexAlignDirective } from './flex-align/flex-align';
import { FlexFillDirective } from './flex-fill/flex-fill';
import { DefaultLayoutAlignDirective } from './layout-align/layout-align';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexOrderDirective,
    DefaultFlexOffsetDirective,
    FlexFillDirective,
    DefaultFlexAlignDirective,
    DefaultFlexDirective,
];
/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */
export class FlexModule {
}
FlexModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FlexModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: FlexModule, declarations: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective], imports: [CoreModule, BidiModule], exports: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective] });
FlexModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexModule, imports: [CoreModule, BidiModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule, BidiModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDdkQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLDZCQUE2QixDQUFDOztBQUd4RSxNQUFNLGNBQWMsR0FBRztJQUNyQixzQkFBc0I7SUFDdEIseUJBQXlCO0lBQ3pCLDJCQUEyQjtJQUMzQix5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLGlCQUFpQjtJQUNqQix5QkFBeUI7SUFDekIsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjs7OztHQUlHO0FBT0gsTUFBTSxPQUFPLFVBQVU7O3VHQUFWLFVBQVU7d0dBQVYsVUFBVSxpQkFyQnJCLHNCQUFzQjtRQUN0Qix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLHlCQUF5QjtRQUN6QiwwQkFBMEI7UUFDMUIsaUJBQWlCO1FBQ2pCLHlCQUF5QjtRQUN6QixvQkFBb0IsYUFVVixVQUFVLEVBQUUsVUFBVSxhQWpCaEMsc0JBQXNCO1FBQ3RCLHlCQUF5QjtRQUN6QiwyQkFBMkI7UUFDM0IseUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQixpQkFBaUI7UUFDakIseUJBQXlCO1FBQ3pCLG9CQUFvQjt3R0FjVCxVQUFVLFlBSlgsVUFBVSxFQUFFLFVBQVU7MkZBSXJCLFVBQVU7a0JBTHRCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztvQkFDakMsWUFBWSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUM7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JpZGlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Q29yZU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmltcG9ydCB7RGVmYXVsdExheW91dERpcmVjdGl2ZX0gZnJvbSAnLi9sYXlvdXQvbGF5b3V0JztcbmltcG9ydCB7RGVmYXVsdExheW91dEdhcERpcmVjdGl2ZX0gZnJvbSAnLi9sYXlvdXQtZ2FwL2xheW91dC1nYXAnO1xuaW1wb3J0IHtEZWZhdWx0RmxleERpcmVjdGl2ZX0gZnJvbSAnLi9mbGV4L2ZsZXgnO1xuaW1wb3J0IHtEZWZhdWx0RmxleE9yZGVyRGlyZWN0aXZlfSBmcm9tICcuL2ZsZXgtb3JkZXIvZmxleC1vcmRlcic7XG5pbXBvcnQge0RlZmF1bHRGbGV4T2Zmc2V0RGlyZWN0aXZlfSBmcm9tICcuL2ZsZXgtb2Zmc2V0L2ZsZXgtb2Zmc2V0JztcbmltcG9ydCB7RGVmYXVsdEZsZXhBbGlnbkRpcmVjdGl2ZX0gZnJvbSAnLi9mbGV4LWFsaWduL2ZsZXgtYWxpZ24nO1xuaW1wb3J0IHtGbGV4RmlsbERpcmVjdGl2ZX0gZnJvbSAnLi9mbGV4LWZpbGwvZmxleC1maWxsJztcbmltcG9ydCB7RGVmYXVsdExheW91dEFsaWduRGlyZWN0aXZlfSBmcm9tICcuL2xheW91dC1hbGlnbi9sYXlvdXQtYWxpZ24nO1xuXG5cbmNvbnN0IEFMTF9ESVJFQ1RJVkVTID0gW1xuICBEZWZhdWx0TGF5b3V0RGlyZWN0aXZlLFxuICBEZWZhdWx0TGF5b3V0R2FwRGlyZWN0aXZlLFxuICBEZWZhdWx0TGF5b3V0QWxpZ25EaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4T3JkZXJEaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4T2Zmc2V0RGlyZWN0aXZlLFxuICBGbGV4RmlsbERpcmVjdGl2ZSxcbiAgRGVmYXVsdEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRGVmYXVsdEZsZXhEaXJlY3RpdmUsXG5dO1xuXG4vKipcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBEZWZpbmUgbW9kdWxlIGZvciB0aGUgRmxleCBBUElcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvcmVNb2R1bGUsIEJpZGlNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5BTExfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFsuLi5BTExfRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgRmxleE1vZHVsZSB7XG59XG4iXX0=