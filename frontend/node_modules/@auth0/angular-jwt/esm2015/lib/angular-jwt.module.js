import { NgModule, Optional, SkipSelf, } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { JWT_OPTIONS } from './jwtoptions.token';
import { JwtHelperService } from './jwthelper.service';
import * as i0 from "@angular/core";
export class JwtModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error(`JwtModule is already loaded. It should only be imported in your application's main module.`);
        }
    }
    static forRoot(options) {
        return {
            ngModule: JwtModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true,
                },
                options.jwtOptionsProvider || {
                    provide: JWT_OPTIONS,
                    useValue: options.config,
                },
                JwtHelperService,
            ],
        };
    }
}
JwtModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtModule, deps: [{ token: JwtModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
JwtModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtModule });
JwtModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtModule, decorators: [{
            type: NgModule
        }], ctorParameters: function () { return [{ type: JwtModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1qd3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1qd3Qvc3JjL2xpYi9hbmd1bGFyLWp3dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFFUixRQUFRLEVBQ1IsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBb0J2RCxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUFvQyxZQUF1QjtRQUN6RCxJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUNiLDRGQUE0RixDQUM3RixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUF5QjtRQUN0QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFNBQVM7WUFDbkIsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxjQUFjO29CQUN4QixLQUFLLEVBQUUsSUFBSTtpQkFDWjtnQkFDRCxPQUFPLENBQUMsa0JBQWtCLElBQUk7b0JBQzVCLE9BQU8sRUFBRSxXQUFXO29CQUNwQixRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU07aUJBQ3pCO2dCQUNELGdCQUFnQjthQUNqQjtTQUNGLENBQUM7SUFDSixDQUFDOzt1R0F4QlUsU0FBUyxrQkFDOEIsU0FBUzt3R0FEaEQsU0FBUzt3R0FBVCxTQUFTOzRGQUFULFNBQVM7a0JBRHJCLFFBQVE7MERBRTJDLFNBQVM7MEJBQTlDLFFBQVE7OzBCQUFJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBOZ01vZHVsZSxcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBQcm92aWRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwUmVxdWVzdCwgSFRUUF9JTlRFUkNFUFRPUlMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBKd3RJbnRlcmNlcHRvciB9IGZyb20gJy4vand0LmludGVyY2VwdG9yJztcbmltcG9ydCB7IEpXVF9PUFRJT05TIH0gZnJvbSAnLi9qd3RvcHRpb25zLnRva2VuJztcbmltcG9ydCB7IEp3dEhlbHBlclNlcnZpY2UgfSBmcm9tICcuL2p3dGhlbHBlci5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBKd3RDb25maWcge1xuICB0b2tlbkdldHRlcj86IChcbiAgICByZXF1ZXN0PzogSHR0cFJlcXVlc3Q8YW55PlxuICApID0+IHN0cmluZyB8IG51bGwgfCBQcm9taXNlPHN0cmluZyB8IG51bGw+O1xuICBoZWFkZXJOYW1lPzogc3RyaW5nO1xuICBhdXRoU2NoZW1lPzogc3RyaW5nIHwgKChyZXF1ZXN0PzogSHR0cFJlcXVlc3Q8YW55PikgPT4gc3RyaW5nKTtcbiAgYWxsb3dlZERvbWFpbnM/OiBBcnJheTxzdHJpbmcgfCBSZWdFeHA+O1xuICBkaXNhbGxvd2VkUm91dGVzPzogQXJyYXk8c3RyaW5nIHwgUmVnRXhwPjtcbiAgdGhyb3dOb1Rva2VuRXJyb3I/OiBib29sZWFuO1xuICBza2lwV2hlbkV4cGlyZWQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEp3dE1vZHVsZU9wdGlvbnMge1xuICBqd3RPcHRpb25zUHJvdmlkZXI/OiBQcm92aWRlcjtcbiAgY29uZmlnPzogSnd0Q29uZmlnO1xufVxuXG5ATmdNb2R1bGUoKVxuZXhwb3J0IGNsYXNzIEp3dE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudE1vZHVsZTogSnd0TW9kdWxlKSB7XG4gICAgaWYgKHBhcmVudE1vZHVsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSnd0TW9kdWxlIGlzIGFscmVhZHkgbG9hZGVkLiBJdCBzaG91bGQgb25seSBiZSBpbXBvcnRlZCBpbiB5b3VyIGFwcGxpY2F0aW9uJ3MgbWFpbiBtb2R1bGUuYFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGZvclJvb3Qob3B0aW9uczogSnd0TW9kdWxlT3B0aW9ucyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Snd0TW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBKd3RNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuICAgICAgICAgIHVzZUNsYXNzOiBKd3RJbnRlcmNlcHRvcixcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9ucy5qd3RPcHRpb25zUHJvdmlkZXIgfHwge1xuICAgICAgICAgIHByb3ZpZGU6IEpXVF9PUFRJT05TLFxuICAgICAgICAgIHVzZVZhbHVlOiBvcHRpb25zLmNvbmZpZyxcbiAgICAgICAgfSxcbiAgICAgICAgSnd0SGVscGVyU2VydmljZSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19