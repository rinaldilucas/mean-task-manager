(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/operators'), require('rxjs'), require('@angular/common/http')) :
    typeof define === 'function' && define.amd ? define('@auth0/angular-jwt', ['exports', '@angular/core', '@angular/common', 'rxjs/operators', 'rxjs', '@angular/common/http'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.auth0 = global.auth0 || {}, global.auth0["angular-jwt"] = {}), global.ng.core, global.ng.common, global.rxjs.operators, global.rxjs, global.ng.common.http));
})(this, (function (exports, i0, common, operators, rxjs, http) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var JWT_OPTIONS = new i0.InjectionToken('JWT_OPTIONS');

    // tslint:disable:no-bitwise
    var JwtHelperService = /** @class */ (function () {
        function JwtHelperService(config) {
            if (config === void 0) { config = null; }
            this.tokenGetter = (config && config.tokenGetter) || function () { };
        }
        JwtHelperService.prototype.urlBase64Decode = function (str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0: {
                    break;
                }
                case 2: {
                    output += '==';
                    break;
                }
                case 3: {
                    output += '=';
                    break;
                }
                default: {
                    throw new Error('Illegal base64url string!');
                }
            }
            return this.b64DecodeUnicode(output);
        };
        // credits for decoder goes to https://github.com/atk
        JwtHelperService.prototype.b64decode = function (str) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var output = '';
            str = String(str).replace(/=+$/, '');
            if (str.length % 4 === 1) {
                throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            for (
            // initialize result and counters
            var bc = 0, bs = void 0, buffer = void 0, idx = 0; 
            // get next character
            (buffer = str.charAt(idx++)); 
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
                ((bs = bc % 4 ? bs * 64 + buffer : buffer),
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0) {
                // try to find character in table (0-63, not found => -1)
                buffer = chars.indexOf(buffer);
            }
            return output;
        };
        JwtHelperService.prototype.b64DecodeUnicode = function (str) {
            return decodeURIComponent(Array.prototype.map
                .call(this.b64decode(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
                .join(''));
        };
        JwtHelperService.prototype.decodeToken = function (token) {
            var _this = this;
            if (token === void 0) { token = this.tokenGetter(); }
            if (token instanceof Promise) {
                return token.then(function (t) { return _this._decodeToken(t); });
            }
            return this._decodeToken(token);
        };
        JwtHelperService.prototype._decodeToken = function (token) {
            if (!token || token === '') {
                return null;
            }
            var parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");
            }
            var decoded = this.urlBase64Decode(parts[1]);
            if (!decoded) {
                throw new Error('Cannot decode the token.');
            }
            return JSON.parse(decoded);
        };
        JwtHelperService.prototype.getTokenExpirationDate = function (token) {
            var _this = this;
            if (token === void 0) { token = this.tokenGetter(); }
            if (token instanceof Promise) {
                return token.then(function (t) { return _this._getTokenExpirationDate(t); });
            }
            return this._getTokenExpirationDate(token);
        };
        JwtHelperService.prototype._getTokenExpirationDate = function (token) {
            var decoded;
            decoded = this.decodeToken(token);
            if (!decoded || !decoded.hasOwnProperty('exp')) {
                return null;
            }
            var date = new Date(0);
            date.setUTCSeconds(decoded.exp);
            return date;
        };
        JwtHelperService.prototype.isTokenExpired = function (token, offsetSeconds) {
            var _this = this;
            if (token === void 0) { token = this.tokenGetter(); }
            if (token instanceof Promise) {
                return token.then(function (t) { return _this._isTokenExpired(t, offsetSeconds); });
            }
            return this._isTokenExpired(token, offsetSeconds);
        };
        JwtHelperService.prototype._isTokenExpired = function (token, offsetSeconds) {
            if (!token || token === '') {
                return true;
            }
            var date = this.getTokenExpirationDate(token);
            offsetSeconds = offsetSeconds || 0;
            if (date === null) {
                return false;
            }
            return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
        };
        JwtHelperService.prototype.getAuthScheme = function (authScheme, request) {
            if (typeof authScheme === 'function') {
                return authScheme(request);
            }
            return authScheme;
        };
        return JwtHelperService;
    }());
    JwtHelperService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtHelperService, deps: [{ token: JWT_OPTIONS }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    JwtHelperService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtHelperService });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtHelperService, decorators: [{
                type: i0.Injectable
            }], ctorParameters: function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [JWT_OPTIONS]
                        }] }];
        } });

    var fromPromiseOrValue = function (input) {
        if (input instanceof Promise) {
            return rxjs.defer(function () { return input; });
        }
        return rxjs.of(input);
    };
    var JwtInterceptor = /** @class */ (function () {
        function JwtInterceptor(config, jwtHelper, document) {
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
        JwtInterceptor.prototype.isAllowedDomain = function (request) {
            var requestUrl = new URL(request.url, this.document.location.origin);
            // If the host equals the current window origin,
            // the domain is allowed by default
            if (requestUrl.host === this.document.location.host) {
                return true;
            }
            // If not the current domain, check the allowed list
            var hostName = "" + requestUrl.hostname + (requestUrl.port && !this.standardPorts.includes(requestUrl.port)
                ? ':' + requestUrl.port
                : '');
            return (this.allowedDomains.findIndex(function (domain) { return typeof domain === 'string'
                ? domain === hostName
                : domain instanceof RegExp
                    ? domain.test(hostName)
                    : false; }) > -1);
        };
        JwtInterceptor.prototype.isDisallowedRoute = function (request) {
            var _this = this;
            var requestedUrl = new URL(request.url, this.document.location.origin);
            return (this.disallowedRoutes.findIndex(function (route) {
                if (typeof route === 'string') {
                    var parsedRoute = new URL(route, _this.document.location.origin);
                    return (parsedRoute.hostname === requestedUrl.hostname &&
                        parsedRoute.pathname === requestedUrl.pathname);
                }
                if (route instanceof RegExp) {
                    return route.test(request.url);
                }
                return false;
            }) > -1);
        };
        JwtInterceptor.prototype.handleInterception = function (token, request, next) {
            var _this = this;
            var authScheme = this.jwtHelper.getAuthScheme(this.authScheme, request);
            if (!token && this.throwNoTokenError) {
                throw new Error('Could not get token from tokenGetter function.');
            }
            var tokenIsExpired = rxjs.of(false);
            if (this.skipWhenExpired) {
                tokenIsExpired = token ? fromPromiseOrValue(this.jwtHelper.isTokenExpired(token)) : rxjs.of(true);
            }
            if (token) {
                return tokenIsExpired.pipe(operators.map(function (isExpired) {
                    var _a;
                    return isExpired && _this.skipWhenExpired
                        ? request.clone()
                        : request.clone({
                            setHeaders: (_a = {},
                                _a[_this.headerName] = "" + authScheme + token,
                                _a),
                        });
                }), operators.mergeMap(function (innerRequest) { return next.handle(innerRequest); }));
            }
            return next.handle(request);
        };
        JwtInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            if (!this.isAllowedDomain(request) || this.isDisallowedRoute(request)) {
                return next.handle(request);
            }
            var token = this.tokenGetter(request);
            return fromPromiseOrValue(token).pipe(operators.mergeMap(function (asyncToken) {
                return _this.handleInterception(asyncToken, request, next);
            }));
        };
        return JwtInterceptor;
    }());
    JwtInterceptor.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtInterceptor, deps: [{ token: JWT_OPTIONS }, { token: JwtHelperService }, { token: common.DOCUMENT }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    JwtInterceptor.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtInterceptor });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtInterceptor, decorators: [{
                type: i0.Injectable
            }], ctorParameters: function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: [JWT_OPTIONS]
                        }] }, { type: JwtHelperService }, { type: Document, decorators: [{
                            type: i0.Inject,
                            args: [common.DOCUMENT]
                        }] }];
        } });

    var JwtModule = /** @class */ (function () {
        function JwtModule(parentModule) {
            if (parentModule) {
                throw new Error("JwtModule is already loaded. It should only be imported in your application's main module.");
            }
        }
        JwtModule.forRoot = function (options) {
            return {
                ngModule: JwtModule,
                providers: [
                    {
                        provide: http.HTTP_INTERCEPTORS,
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
        };
        return JwtModule;
    }());
    JwtModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtModule, deps: [{ token: JwtModule, optional: true, skipSelf: true }], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    JwtModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtModule });
    JwtModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtModule });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0__namespace, type: JwtModule, decorators: [{
                type: i0.NgModule
            }], ctorParameters: function () {
            return [{ type: JwtModule, decorators: [{
                            type: i0.Optional
                        }, {
                            type: i0.SkipSelf
                        }] }];
        } });

    /*
     * Public API Surface of angular-jwt
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.JWT_OPTIONS = JWT_OPTIONS;
    exports.JwtHelperService = JwtHelperService;
    exports.JwtInterceptor = JwtInterceptor;
    exports.JwtModule = JwtModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=auth0-angular-jwt.umd.js.map
