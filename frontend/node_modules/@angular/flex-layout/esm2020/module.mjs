/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { SERVER_TOKEN, LAYOUT_CONFIG, DEFAULT_CONFIG, BREAKPOINT, } from '@angular/flex-layout/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { GridModule } from '@angular/flex-layout/grid';
import * as i0 from "@angular/core";
/**
 * FlexLayoutModule -- the main import for all utilities in the Angular Layout library
 * * Will automatically provide Flex, Grid, and Extended modules for use in the application
 * * Can be configured using the static withConfig method, options viewable on the Wiki's
 *   Configuration page
 */
export class FlexLayoutModule {
    constructor(serverModuleLoaded, platformId) {
        if (isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     */
    static withConfig(configOptions, 
    // tslint:disable-next-line:max-line-length
    breakpoints = []) {
        return {
            ngModule: FlexLayoutModule,
            providers: configOptions.serverLoaded ?
                [
                    { provide: LAYOUT_CONFIG, useValue: { ...DEFAULT_CONFIG, ...configOptions } },
                    { provide: BREAKPOINT, useValue: breakpoints, multi: true },
                    { provide: SERVER_TOKEN, useValue: true },
                ] : [
                { provide: LAYOUT_CONFIG, useValue: { ...DEFAULT_CONFIG, ...configOptions } },
                { provide: BREAKPOINT, useValue: breakpoints, multi: true },
            ]
        };
    }
}
FlexLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutModule, deps: [{ token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.NgModule });
FlexLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule], exports: [FlexModule, ExtendedModule, GridModule] });
FlexLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule, FlexModule, ExtendedModule, GridModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FlexModule, ExtendedModule, GridModule],
                    exports: [FlexModule, ExtendedModule, GridModule]
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRCxPQUFPLEVBQ0wsWUFBWSxFQUVaLGFBQWEsRUFDYixjQUFjLEVBRWQsVUFBVSxHQUNYLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRXJEOzs7OztHQUtHO0FBS0gsTUFBTSxPQUFPLGdCQUFnQjtJQXVCM0IsWUFBa0Msa0JBQTJCLEVBQzVCLFVBQWtCO1FBQ2pELElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDMUY7SUFDSCxDQUFDO0lBMUJEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBa0M7SUFDbEMsMkNBQTJDO0lBQzNDLGNBQXVDLEVBQUU7UUFDekQsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDckM7b0JBQ0UsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUFDLEdBQUcsY0FBYyxFQUFFLEdBQUcsYUFBYSxFQUFDLEVBQUM7b0JBQ3pFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQ3pELEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2lCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDRixFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxjQUFjLEVBQUUsR0FBRyxhQUFhLEVBQUMsRUFBQztnQkFDekUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQzthQUMxRDtTQUNKLENBQUM7SUFDSixDQUFDOzs2R0FyQlUsZ0JBQWdCLGtCQXVCUCxZQUFZLGFBQ1osV0FBVzs4R0F4QnBCLGdCQUFnQixZQUhqQixVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsYUFDdEMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVOzhHQUVyQyxnQkFBZ0IsWUFIakIsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQ3RDLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVTsyRkFFckMsZ0JBQWdCO2tCQUo1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO29CQUNqRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQztpQkFDbEQ7OzBCQXdCYyxNQUFNOzJCQUFDLFlBQVk7OEJBQ2EsTUFBTTswQkFBdEMsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdCwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybVNlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtcbiAgU0VSVkVSX1RPS0VOLFxuICBMYXlvdXRDb25maWdPcHRpb25zLFxuICBMQVlPVVRfQ09ORklHLFxuICBERUZBVUxUX0NPTkZJRyxcbiAgQnJlYWtQb2ludCxcbiAgQlJFQUtQT0lOVCxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge0V4dGVuZGVkTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9leHRlbmRlZCc7XG5pbXBvcnQge0ZsZXhNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2ZsZXgnO1xuaW1wb3J0IHtHcmlkTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9ncmlkJztcblxuLyoqXG4gKiBGbGV4TGF5b3V0TW9kdWxlIC0tIHRoZSBtYWluIGltcG9ydCBmb3IgYWxsIHV0aWxpdGllcyBpbiB0aGUgQW5ndWxhciBMYXlvdXQgbGlicmFyeVxuICogKiBXaWxsIGF1dG9tYXRpY2FsbHkgcHJvdmlkZSBGbGV4LCBHcmlkLCBhbmQgRXh0ZW5kZWQgbW9kdWxlcyBmb3IgdXNlIGluIHRoZSBhcHBsaWNhdGlvblxuICogKiBDYW4gYmUgY29uZmlndXJlZCB1c2luZyB0aGUgc3RhdGljIHdpdGhDb25maWcgbWV0aG9kLCBvcHRpb25zIHZpZXdhYmxlIG9uIHRoZSBXaWtpJ3NcbiAqICAgQ29uZmlndXJhdGlvbiBwYWdlXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtGbGV4TW9kdWxlLCBFeHRlbmRlZE1vZHVsZSwgR3JpZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtGbGV4TW9kdWxlLCBFeHRlbmRlZE1vZHVsZSwgR3JpZE1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgRmxleExheW91dE1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEZsZXhMYXlvdXRNb2R1bGUgd2l0aCBhIHNldCBvZiBjb25maWcgb3B0aW9ucyxcbiAgICogd2hpY2ggc2V0cyB0aGUgY29ycmVzcG9uZGluZyB0b2tlbnMgYWNjb3JkaW5nbHlcbiAgICovXG4gIHN0YXRpYyB3aXRoQ29uZmlnKGNvbmZpZ09wdGlvbnM6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnR8QnJlYWtQb2ludFtdID0gW10pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZsZXhMYXlvdXRNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEZsZXhMYXlvdXRNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IGNvbmZpZ09wdGlvbnMuc2VydmVyTG9hZGVkID9cbiAgICAgICAgW1xuICAgICAgICAgIHtwcm92aWRlOiBMQVlPVVRfQ09ORklHLCB1c2VWYWx1ZTogey4uLkRFRkFVTFRfQ09ORklHLCAuLi5jb25maWdPcHRpb25zfX0sXG4gICAgICAgICAge3Byb3ZpZGU6IEJSRUFLUE9JTlQsIHVzZVZhbHVlOiBicmVha3BvaW50cywgbXVsdGk6IHRydWV9LFxuICAgICAgICAgIHtwcm92aWRlOiBTRVJWRVJfVE9LRU4sIHVzZVZhbHVlOiB0cnVlfSxcbiAgICAgICAgXSA6IFtcbiAgICAgICAgICB7cHJvdmlkZTogTEFZT1VUX0NPTkZJRywgdXNlVmFsdWU6IHsuLi5ERUZBVUxUX0NPTkZJRywgLi4uY29uZmlnT3B0aW9uc319LFxuICAgICAgICAgIHtwcm92aWRlOiBCUkVBS1BPSU5ULCB1c2VWYWx1ZTogYnJlYWtwb2ludHMsIG11bHRpOiB0cnVlfSxcbiAgICAgICAgXVxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFNFUlZFUl9UT0tFTikgc2VydmVyTW9kdWxlTG9hZGVkOiBib29sZWFuLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3QpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcihwbGF0Zm9ybUlkKSAmJiAhc2VydmVyTW9kdWxlTG9hZGVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IEZsZXggTGF5b3V0IGxvYWRlZCBvbiB0aGUgc2VydmVyIHdpdGhvdXQgRmxleExheW91dFNlcnZlck1vZHVsZScpO1xuICAgIH1cbiAgfVxufVxuIl19