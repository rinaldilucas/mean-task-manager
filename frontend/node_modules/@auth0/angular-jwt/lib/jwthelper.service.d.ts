import { HttpRequest } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class JwtHelperService {
    tokenGetter: () => string | Promise<string>;
    constructor(config?: any);
    urlBase64Decode(str: string): string;
    private b64decode;
    private b64DecodeUnicode;
    decodeToken<T = any>(token: string): T | null;
    decodeToken<T = any>(token: Promise<string>): Promise<T | null>;
    decodeToken<T = any>(): null | T | Promise<T | null>;
    private _decodeToken;
    getTokenExpirationDate(token: string): Date | null;
    getTokenExpirationDate(token: Promise<string>): Promise<Date | null>;
    getTokenExpirationDate(): null | Date | Promise<Date | null>;
    private _getTokenExpirationDate;
    isTokenExpired(token?: undefined, offsetSeconds?: number): boolean | Promise<boolean>;
    isTokenExpired(token: string | null, offsetSeconds?: number): boolean;
    isTokenExpired(token: Promise<string>, offsetSeconds?: number): Promise<boolean>;
    private _isTokenExpired;
    getAuthScheme(authScheme: Function | string | undefined, request: HttpRequest<any>): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<JwtHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JwtHelperService>;
}
