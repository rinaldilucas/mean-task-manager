import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IAuthData } from '@scripts/models/authData.interface';
import { ERole } from '@scripts/models/enum/role.enum';
import { IJwtPayload } from '@scripts/models/jwtPayload.interface';
import { IJwtToken } from '@scripts/models/jwtToken.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { SharedService } from '@services/shared.service';
import { UserService } from '@services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly url = environment.baseUri + '/auth';
    emitMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
    emitSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

    private accessToken!: string;
    private refreshToken!: string;
    private decodedToken!: IJwtToken;
    private isAuthenticated = false;
    private loggedUser!: IAuthData;
    private authStatusListener = new Subject<boolean>();
    private refreshTokenTimeout;
    private keepUserLoggedIn = false;

    constructor (
        private router: Router, //
        public userService: UserService,
        private sharedService: SharedService,
        private http: HttpClient
    ) {}

    getUserIsLoggedIn (): boolean {
        return this.keepUserLoggedIn;
    }

    getAccessToken (): string {
        return this.accessToken;
    }

    getRefreshToken (): string {
        return this.refreshToken;
    }

    getIsAuthenticated (): boolean {
        return this.isAuthenticated;
    }

    getUserId (): string {
        return this.loggedUser.userId;
    }

    getUserRole (): ERole {
        return this.loggedUser.role;
    }

    getLoggedUser (): IAuthData {
        return this.loggedUser;
    }

    getAuthStatusListener (): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    authenticate (email: string, password: string, keepUserLoggedIn: boolean): Promise<IQueryResult<IJwtPayload>> {
        const credentials = { email, password, keepUserLoggedIn };
        const url = `${this.url}/authenticate`;

        return lastValueFrom(this.http.post<IQueryResult<IJwtPayload>>(url, credentials).pipe(catchError(this.sharedService.errorHandler)));
    }

    register (user: IUser): Promise<IQueryResult<IUser>> {
        const url = `${this.url}/register`;

        return lastValueFrom(this.http.post<IQueryResult<IUser>>(url, user).pipe(catchError(this.sharedService.errorHandler)));
    }

    logout (token: string): Promise<IQueryResult<IUser>> {
        const url = `${this.url}/logout`;

        return lastValueFrom(this.http.post<IQueryResult<IUser>>(url, { token }).pipe(catchError(this.sharedService.errorHandler)));
    }

    changePassword (userId: string, password: string): Promise<IQueryResult<IUser>> {
        const url = `${this.url}/changePassword`;
        const body = { _id: userId, password };

        return lastValueFrom(this.http.put<IQueryResult<IUser>>(url, body).pipe(catchError(this.sharedService.errorHandler)));
    }

    generateRefreshToken (): Promise<IQueryResult<IJwtPayload>> {
        const url = `${this.url}/refresh`;

        return lastValueFrom(this.http.post<IQueryResult<IJwtPayload>>(url, { ...this.loggedUser, refresh: this.getRefreshToken() })
            .pipe(tap((response: IQueryResult<IJwtPayload>) => this.authenticateToken(response.data[0])))
            .pipe(catchError(this.sharedService.errorHandler)));
    }

    authenticateToken (result: IJwtPayload): boolean {
        const access = result.access;
        const refresh = result.refresh;
        const keepUserLoggedIn = result.keepUserLoggedIn;
        this.accessToken = access;
        this.refreshToken = refresh;
        this.keepUserLoggedIn = keepUserLoggedIn ?? this.keepUserLoggedIn;

        if (access) {
            const expiresInDuration = result.expiresIn;
            this.isAuthenticated = true;
            this.decodeJwtToken(this.accessToken);
            this.authStatusListener.next(true);
            const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
            this.saveAuthData(access, refresh, expirationDate, this.loggedUser.userId, this.keepUserLoggedIn);
            this.startRefreshTokenTimerAsync(result);
            this.emitMenu.emit(true);
            setTimeout(() => { this.emitSidebar.emit(true); }, 750);
            return true;
        } else {
            return false;
        }
    }

    verifyAuthorization (): boolean {
        const authInformation = this.getAuthData();

        if (!authInformation) { return false; }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.accessToken = authInformation.access;
            this.decodeJwtToken(this.accessToken);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            return true;
        }

        return false;
    }

    getAuthData (): IJwtPayload | false {
        const access = localStorage.getItem('access') as string;
        const refresh = localStorage.getItem('refresh') as string;
        const expirationDate = localStorage.getItem('expiration') as string;
        const userId = localStorage.getItem('userId') as string;
        const userRole = localStorage.getItem('userRole') as ERole;
        const keepUserLoggedIn = JSON.parse(localStorage.getItem('keepUserLoggedIn') as string) === true;

        if (!access || !expirationDate) {
            return false;
        }

        return {
            access,
            refresh,
            expirationDate: new Date(expirationDate),
            userId,
            userRole,
            expiresIn: 0,
            keepUserLoggedIn
        };
    }

    private saveAuthData (access: string, refresh: string, expirationDate: Date, userId: string, keepUserLogged: boolean): void {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('keepUserLogged', String(keepUserLogged));
    }

    private clearAuthData (): void {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private async startRefreshTokenTimerAsync (jwtPayload: IJwtPayload): Promise<void> {
        const jwtToken = jwtPayload;
        const timeout = jwtToken.expiresIn * 1000;

        if (this.getUserIsLoggedIn()) {
            this.refreshTokenTimeout = setTimeout(async () => {
                const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handlePromises(this.generateRefreshToken());

                if (!!error || !result || !result?.success) { this.logoutAsync(); }
            }, timeout);
        } else {
            setTimeout(() => this.logoutAsync(), timeout);
        }
    }

    private stopRefreshTokenTimer (): void {
        clearTimeout(this.refreshTokenTimeout);
    }

    private decodeJwtToken (token: string): void {
        const helper = new JwtHelperService();
        this.decodedToken = helper.decodeToken(token) as IJwtToken;

        this.loggedUser = {
            role: this.decodedToken.role as ERole,
            email: this.decodedToken.email,
            userId: this.decodedToken.userId
        };
    }

    async logoutAsync (): Promise<void> {
        const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.logout(this.getAccessToken()));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'login.logout-error', success: false });

        this.stopRefreshTokenTimer();
        this.accessToken = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.clearAuthData();
        this.sharedService.handleSnackbarMessages({ translationKey: 'login.logout-success', success: true });
        this.router.navigate(['']);
        this.emitMenu.emit(false);
        this.emitSidebar.emit(false);
    }
}
