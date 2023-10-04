/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout/core';
import { DefaultGridAlignDirective } from './grid-align/grid-align';
import { DefaultGridAlignColumnsDirective } from './align-columns/align-columns';
import { DefaultGridAlignRowsDirective } from './align-rows/align-rows';
import { DefaultGridAreaDirective } from './area/area';
import { DefaultGridAreasDirective } from './areas/areas';
import { DefaultGridAutoDirective } from './auto/auto';
import { DefaultGridColumnDirective } from './column/column';
import { DefaultGridColumnsDirective } from './columns/columns';
import { DefaultGridGapDirective } from './gap/gap';
import { DefaultGridRowDirective } from './row/row';
import { DefaultGridRowsDirective } from './rows/rows';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultGridAlignDirective,
    DefaultGridAlignColumnsDirective,
    DefaultGridAlignRowsDirective,
    DefaultGridAreaDirective,
    DefaultGridAreasDirective,
    DefaultGridAutoDirective,
    DefaultGridColumnDirective,
    DefaultGridColumnsDirective,
    DefaultGridGapDirective,
    DefaultGridRowDirective,
    DefaultGridRowsDirective,
];
/**
 * *****************************************************************
 * Define module for the CSS Grid API
 * *****************************************************************
 */
export class GridModule {
}
GridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: GridModule, declarations: [DefaultGridAlignDirective,
        DefaultGridAlignColumnsDirective,
        DefaultGridAlignRowsDirective,
        DefaultGridAreaDirective,
        DefaultGridAreasDirective,
        DefaultGridAutoDirective,
        DefaultGridColumnDirective,
        DefaultGridColumnsDirective,
        DefaultGridGapDirective,
        DefaultGridRowDirective,
        DefaultGridRowsDirective], imports: [CoreModule], exports: [DefaultGridAlignDirective,
        DefaultGridAlignColumnsDirective,
        DefaultGridAlignRowsDirective,
        DefaultGridAreaDirective,
        DefaultGridAreasDirective,
        DefaultGridAutoDirective,
        DefaultGridColumnDirective,
        DefaultGridColumnsDirective,
        DefaultGridGapDirective,
        DefaultGridRowDirective,
        DefaultGridRowsDirective] });
GridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridModule, imports: [CoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZ0NBQWdDLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMvRSxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDckQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNyRCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFHckQsTUFBTSxjQUFjLEdBQUc7SUFDckIseUJBQXlCO0lBQ3pCLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0Isd0JBQXdCO0lBQ3hCLHlCQUF5QjtJQUN6Qix3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtDQUN6QixDQUFDO0FBRUY7Ozs7R0FJRztBQU9ILE1BQU0sT0FBTyxVQUFVOzt1R0FBVixVQUFVO3dHQUFWLFVBQVUsaUJBeEJyQix5QkFBeUI7UUFDekIsZ0NBQWdDO1FBQ2hDLDZCQUE2QjtRQUM3Qix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLHdCQUF3QjtRQUN4QiwwQkFBMEI7UUFDMUIsMkJBQTJCO1FBQzNCLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsd0JBQXdCLGFBVWQsVUFBVSxhQXBCcEIseUJBQXlCO1FBQ3pCLGdDQUFnQztRQUNoQyw2QkFBNkI7UUFDN0Isd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6Qix3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHdCQUF3Qjt3R0FjYixVQUFVLFlBSlgsVUFBVTsyRkFJVCxVQUFVO2tCQUx0QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDckIsWUFBWSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUM7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvcmVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuXG5pbXBvcnQge0RlZmF1bHRHcmlkQWxpZ25EaXJlY3RpdmV9IGZyb20gJy4vZ3JpZC1hbGlnbi9ncmlkLWFsaWduJztcbmltcG9ydCB7RGVmYXVsdEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmV9IGZyb20gJy4vYWxpZ24tY29sdW1ucy9hbGlnbi1jb2x1bW5zJztcbmltcG9ydCB7RGVmYXVsdEdyaWRBbGlnblJvd3NEaXJlY3RpdmV9IGZyb20gJy4vYWxpZ24tcm93cy9hbGlnbi1yb3dzJztcbmltcG9ydCB7RGVmYXVsdEdyaWRBcmVhRGlyZWN0aXZlfSBmcm9tICcuL2FyZWEvYXJlYSc7XG5pbXBvcnQge0RlZmF1bHRHcmlkQXJlYXNEaXJlY3RpdmV9IGZyb20gJy4vYXJlYXMvYXJlYXMnO1xuaW1wb3J0IHtEZWZhdWx0R3JpZEF1dG9EaXJlY3RpdmV9IGZyb20gJy4vYXV0by9hdXRvJztcbmltcG9ydCB7RGVmYXVsdEdyaWRDb2x1bW5EaXJlY3RpdmV9IGZyb20gJy4vY29sdW1uL2NvbHVtbic7XG5pbXBvcnQge0RlZmF1bHRHcmlkQ29sdW1uc0RpcmVjdGl2ZX0gZnJvbSAnLi9jb2x1bW5zL2NvbHVtbnMnO1xuaW1wb3J0IHtEZWZhdWx0R3JpZEdhcERpcmVjdGl2ZX0gZnJvbSAnLi9nYXAvZ2FwJztcbmltcG9ydCB7RGVmYXVsdEdyaWRSb3dEaXJlY3RpdmV9IGZyb20gJy4vcm93L3Jvdyc7XG5pbXBvcnQge0RlZmF1bHRHcmlkUm93c0RpcmVjdGl2ZX0gZnJvbSAnLi9yb3dzL3Jvd3MnO1xuXG5cbmNvbnN0IEFMTF9ESVJFQ1RJVkVTID0gW1xuICBEZWZhdWx0R3JpZEFsaWduRGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZEFsaWduQ29sdW1uc0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRBbGlnblJvd3NEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQXJlYURpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRBcmVhc0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRBdXRvRGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZENvbHVtbkRpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRDb2x1bW5zRGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZEdhcERpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRSb3dEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkUm93c0RpcmVjdGl2ZSxcbl07XG5cbi8qKlxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIERlZmluZSBtb2R1bGUgZm9yIHRoZSBDU1MgR3JpZCBBUElcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvcmVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5BTExfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFsuLi5BTExfRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgR3JpZE1vZHVsZSB7XG59XG4iXX0=