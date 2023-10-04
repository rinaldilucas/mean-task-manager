import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { JWT_OPTIONS } from './jwtoptions.token';
import { map, mergeMap } from 'rxjs/operators';
import { defer, of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./jwthelper.service";
const fromPromiseOrValue = (input) => {
    if (input instanceof Promise) {
        return defer(() => input);
    }
    return of(input);
};
export class JwtInterceptor {
    constructor(config, jwtHelper, document) {
        this.jwtHelper = jwtHelper;
        this.document = document;
        this.standardPorts = ['80', '443'];
        this.tokenGetter = config.tokenGetter;
        this.headerName = config.headerName || 'Authorization';
        this.authScheme =
            config.authScheme || config.authScheme === ''
                ? config.authScheme
                : 'Bearer ';
        this.allowedDomains = config.allowedDomains || [];
        this.disallowedRoutes = config.disallowedRoutes || [];
        this.throwNoTokenError = config.throwNoTokenError || false;
        this.skipWhenExpired = config.skipWhenExpired;
    }
    isAllowedDomain(request) {
        const requestUrl = new URL(request.url, this.document.location.origin);
        // If the host equals the current window origin,
        // the domain is allowed by default
        if (requestUrl.host === this.document.location.host) {
            return true;
        }
        // If not the current domain, check the allowed list
        const hostName = `${requestUrl.hostname}${requestUrl.port && !this.standardPorts.includes(requestUrl.port)
            ? ':' + requestUrl.port
            : ''}`;
        return (this.allowedDomains.findIndex((domain) => typeof domain === 'string'
            ? domain === hostName
            : domain instanceof RegExp
                ? domain.test(hostName)
                : false) > -1);
    }
    isDisallowedRoute(request) {
        const requestedUrl = new URL(request.url, this.document.location.origin);
        return (this.disallowedRoutes.findIndex((route) => {
            if (typeof route === 'string') {
                const parsedRoute = new URL(route, this.document.location.origin);
                return (parsedRoute.hostname === requestedUrl.hostname &&
                    parsedRoute.pathname === requestedUrl.pathname);
            }
            if (route instanceof RegExp) {
                return route.test(request.url);
            }
            return false;
        }) > -1);
    }
    handleInterception(token, request, next) {
        const authScheme = this.jwtHelper.getAuthScheme(this.authScheme, request);
        if (!token && this.throwNoTokenError) {
            throw new Error('Could not get token from tokenGetter function.');
        }
        let tokenIsExpired = of(false);
        if (this.skipWhenExpired) {
            tokenIsExpired = token ? fromPromiseOrValue(this.jwtHelper.isTokenExpired(token)) : of(true);
        }
        if (token) {
            return tokenIsExpired.pipe(map((isExpired) => isExpired && this.skipWhenExpired
                ? request.clone()
                : request.clone({
                    setHeaders: {
                        [this.headerName]: `${authScheme}${token}`,
                    },
                })), mergeMap((innerRequest) => next.handle(innerRequest)));
        }
        return next.handle(request);
    }
    intercept(request, next) {
        if (!this.isAllowedDomain(request) || this.isDisallowedRoute(request)) {
            return next.handle(request);
        }
        const token = this.tokenGetter(request);
        return fromPromiseOrValue(token).pipe(mergeMap((asyncToken) => {
            return this.handleInterception(asyncToken, request, next);
        }));
    }
}
JwtInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtInterceptor, deps: [{ token: JWT_OPTIONS }, { token: i1.JwtHelperService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
JwtInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: JwtInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [JWT_OPTIONS]
                }] }, { type: i1.JwtHelperService }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1qd3Qvc3JjL2xpYi9qd3QuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPbkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVqRCxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxLQUFLLEVBQW9CLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBRW5ELE1BQU0sa0JBQWtCLEdBQUcsQ0FBSSxLQUFxQixFQUFFLEVBQUU7SUFDdEQsSUFBSSxLQUFLLFlBQVksT0FBTyxFQUFFO1FBQzVCLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxPQUFPLGNBQWM7SUFZekIsWUFDdUIsTUFBVyxFQUN6QixTQUEyQixFQUNSLFFBQWtCO1FBRHJDLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQ1IsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUw5QyxrQkFBYSxHQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBT3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksZUFBZSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxVQUFVO1lBQ2IsTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsVUFB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Q0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4QyxPQUFPLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FDbkMsUUFBUSxDQUFDLENBQUMsVUFBeUIsRUFBRSxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7OzRHQXJJVSxjQUFjLGtCQWFmLFdBQVcsNkNBRVgsUUFBUTtnSEFmUCxjQUFjOzRGQUFkLGNBQWM7a0JBRDFCLFVBQVU7OzBCQWNOLE1BQU07MkJBQUMsV0FBVzs2REFFaUIsUUFBUTswQkFBM0MsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBKd3RIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9qd3RoZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBKV1RfT1BUSU9OUyB9IGZyb20gJy4vand0b3B0aW9ucy50b2tlbic7XG5cbmltcG9ydCB7IG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBkZWZlciwgZnJvbSwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcblxuY29uc3QgZnJvbVByb21pc2VPclZhbHVlID0gPFQ+KGlucHV0OiBUIHwgUHJvbWlzZTxUPikgPT4ge1xuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgcmV0dXJuIGRlZmVyKCgpID0+IGlucHV0KTtcbiAgfVxuICByZXR1cm4gb2YoaW5wdXQpO1xufTtcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKd3RJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG4gIHRva2VuR2V0dGVyOiAoXG4gICAgcmVxdWVzdD86IEh0dHBSZXF1ZXN0PGFueT5cbiAgKSA9PiBzdHJpbmcgfCBudWxsIHwgUHJvbWlzZTxzdHJpbmcgfCBudWxsPjtcbiAgaGVhZGVyTmFtZTogc3RyaW5nO1xuICBhdXRoU2NoZW1lOiBzdHJpbmcgfCAoKHJlcXVlc3Q/OiBIdHRwUmVxdWVzdDxhbnk+KSA9PiBzdHJpbmcpO1xuICBhbGxvd2VkRG9tYWluczogQXJyYXk8c3RyaW5nIHwgUmVnRXhwPjtcbiAgZGlzYWxsb3dlZFJvdXRlczogQXJyYXk8c3RyaW5nIHwgUmVnRXhwPjtcbiAgdGhyb3dOb1Rva2VuRXJyb3I6IGJvb2xlYW47XG4gIHNraXBXaGVuRXhwaXJlZDogYm9vbGVhbjtcbiAgc3RhbmRhcmRQb3J0czogc3RyaW5nW10gPSBbJzgwJywgJzQ0MyddO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoSldUX09QVElPTlMpIGNvbmZpZzogYW55LFxuICAgIHB1YmxpYyBqd3RIZWxwZXI6IEp3dEhlbHBlclNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnRcbiAgKSB7XG4gICAgdGhpcy50b2tlbkdldHRlciA9IGNvbmZpZy50b2tlbkdldHRlcjtcbiAgICB0aGlzLmhlYWRlck5hbWUgPSBjb25maWcuaGVhZGVyTmFtZSB8fCAnQXV0aG9yaXphdGlvbic7XG4gICAgdGhpcy5hdXRoU2NoZW1lID1cbiAgICAgIGNvbmZpZy5hdXRoU2NoZW1lIHx8IGNvbmZpZy5hdXRoU2NoZW1lID09PSAnJ1xuICAgICAgICA/IGNvbmZpZy5hdXRoU2NoZW1lXG4gICAgICAgIDogJ0JlYXJlciAnO1xuICAgIHRoaXMuYWxsb3dlZERvbWFpbnMgPSBjb25maWcuYWxsb3dlZERvbWFpbnMgfHwgW107XG4gICAgdGhpcy5kaXNhbGxvd2VkUm91dGVzID0gY29uZmlnLmRpc2FsbG93ZWRSb3V0ZXMgfHwgW107XG4gICAgdGhpcy50aHJvd05vVG9rZW5FcnJvciA9IGNvbmZpZy50aHJvd05vVG9rZW5FcnJvciB8fCBmYWxzZTtcbiAgICB0aGlzLnNraXBXaGVuRXhwaXJlZCA9IGNvbmZpZy5za2lwV2hlbkV4cGlyZWQ7XG4gIH1cblxuICBpc0FsbG93ZWREb21haW4ocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55Pik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlcXVlc3RVcmw6IFVSTCA9IG5ldyBVUkwocmVxdWVzdC51cmwsIHRoaXMuZG9jdW1lbnQubG9jYXRpb24ub3JpZ2luKTtcblxuICAgIC8vIElmIHRoZSBob3N0IGVxdWFscyB0aGUgY3VycmVudCB3aW5kb3cgb3JpZ2luLFxuICAgIC8vIHRoZSBkb21haW4gaXMgYWxsb3dlZCBieSBkZWZhdWx0XG4gICAgaWYgKHJlcXVlc3RVcmwuaG9zdCA9PT0gdGhpcy5kb2N1bWVudC5sb2NhdGlvbi5ob3N0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiBub3QgdGhlIGN1cnJlbnQgZG9tYWluLCBjaGVjayB0aGUgYWxsb3dlZCBsaXN0XG4gICAgY29uc3QgaG9zdE5hbWUgPSBgJHtyZXF1ZXN0VXJsLmhvc3RuYW1lfSR7XG4gICAgICByZXF1ZXN0VXJsLnBvcnQgJiYgIXRoaXMuc3RhbmRhcmRQb3J0cy5pbmNsdWRlcyhyZXF1ZXN0VXJsLnBvcnQpXG4gICAgICAgID8gJzonICsgcmVxdWVzdFVybC5wb3J0XG4gICAgICAgIDogJydcbiAgICB9YDtcblxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmFsbG93ZWREb21haW5zLmZpbmRJbmRleCgoZG9tYWluKSA9PlxuICAgICAgICB0eXBlb2YgZG9tYWluID09PSAnc3RyaW5nJ1xuICAgICAgICAgID8gZG9tYWluID09PSBob3N0TmFtZVxuICAgICAgICAgIDogZG9tYWluIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICAgICAgPyBkb21haW4udGVzdChob3N0TmFtZSlcbiAgICAgICAgICA6IGZhbHNlXG4gICAgICApID4gLTFcbiAgICApO1xuICB9XG5cbiAgaXNEaXNhbGxvd2VkUm91dGUocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55Pik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlcXVlc3RlZFVybDogVVJMID0gbmV3IFVSTChcbiAgICAgIHJlcXVlc3QudXJsLFxuICAgICAgdGhpcy5kb2N1bWVudC5sb2NhdGlvbi5vcmlnaW5cbiAgICApO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZGlzYWxsb3dlZFJvdXRlcy5maW5kSW5kZXgoKHJvdXRlOiBzdHJpbmcgfCBSZWdFeHApID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiByb3V0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb25zdCBwYXJzZWRSb3V0ZTogVVJMID0gbmV3IFVSTChcbiAgICAgICAgICAgIHJvdXRlLFxuICAgICAgICAgICAgdGhpcy5kb2N1bWVudC5sb2NhdGlvbi5vcmlnaW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBwYXJzZWRSb3V0ZS5ob3N0bmFtZSA9PT0gcmVxdWVzdGVkVXJsLmhvc3RuYW1lICYmXG4gICAgICAgICAgICBwYXJzZWRSb3V0ZS5wYXRobmFtZSA9PT0gcmVxdWVzdGVkVXJsLnBhdGhuYW1lXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3V0ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgIHJldHVybiByb3V0ZS50ZXN0KHJlcXVlc3QudXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pID4gLTFcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlSW50ZXJjZXB0aW9uKFxuICAgIHRva2VuOiBzdHJpbmcgfCBudWxsLFxuICAgIHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sXG4gICAgbmV4dDogSHR0cEhhbmRsZXJcbiAgKSB7XG4gICAgY29uc3QgYXV0aFNjaGVtZSA9IHRoaXMuand0SGVscGVyLmdldEF1dGhTY2hlbWUodGhpcy5hdXRoU2NoZW1lLCByZXF1ZXN0KTtcblxuICAgIGlmICghdG9rZW4gJiYgdGhpcy50aHJvd05vVG9rZW5FcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZ2V0IHRva2VuIGZyb20gdG9rZW5HZXR0ZXIgZnVuY3Rpb24uJyk7XG4gICAgfVxuXG4gICAgbGV0IHRva2VuSXNFeHBpcmVkID0gb2YoZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMuc2tpcFdoZW5FeHBpcmVkKSB7XG4gICAgICB0b2tlbklzRXhwaXJlZCA9IHRva2VuID8gZnJvbVByb21pc2VPclZhbHVlKHRoaXMuand0SGVscGVyLmlzVG9rZW5FeHBpcmVkKHRva2VuKSkgOiBvZih0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHJldHVybiB0b2tlbklzRXhwaXJlZC5waXBlKFxuICAgICAgICBtYXAoKGlzRXhwaXJlZCkgPT5cbiAgICAgICAgICBpc0V4cGlyZWQgJiYgdGhpcy5za2lwV2hlbkV4cGlyZWRcbiAgICAgICAgICAgID8gcmVxdWVzdC5jbG9uZSgpXG4gICAgICAgICAgICA6IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgIFt0aGlzLmhlYWRlck5hbWVdOiBgJHthdXRoU2NoZW1lfSR7dG9rZW59YCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgICBtZXJnZU1hcCgoaW5uZXJSZXF1ZXN0KSA9PiBuZXh0LmhhbmRsZShpbm5lclJlcXVlc3QpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gIH1cblxuICBpbnRlcmNlcHQoXG4gICAgcmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PixcbiAgICBuZXh0OiBIdHRwSGFuZGxlclxuICApOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgaWYgKCF0aGlzLmlzQWxsb3dlZERvbWFpbihyZXF1ZXN0KSB8fCB0aGlzLmlzRGlzYWxsb3dlZFJvdXRlKHJlcXVlc3QpKSB7XG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbkdldHRlcihyZXF1ZXN0KTtcblxuICAgIHJldHVybiBmcm9tUHJvbWlzZU9yVmFsdWUodG9rZW4pLnBpcGUoXG4gICAgICBtZXJnZU1hcCgoYXN5bmNUb2tlbjogc3RyaW5nIHwgbnVsbCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVJbnRlcmNlcHRpb24oYXN5bmNUb2tlbiwgcmVxdWVzdCwgbmV4dCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==