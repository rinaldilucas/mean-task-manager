import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { IJwtToken } from '@app/scripts/models/jwtToken.interface';
import { UserService } from '@app/scripts/services/user.service';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { ERole } from '@app/scripts/models/enum/role.enum';
import { IAuthData } from '@app/scripts/models/authData.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { IUser } from '@app/scripts/models/user.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    emitMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    private rawToken!: string;
    private decodedToken!: IJwtToken;
    private tokenTimer!: ReturnType<typeof setTimeout>;
    private isAuthenticated = false;
    private loggedUser!: IAuthData;
    private authStatusListener = new Subject<boolean>();

    constructor (
        private router: Router, //
        public userService: UserService,
        private sharedService: SharedService
    ) {}

    getToken (): string {
        return this.rawToken;
    }

    getIsAuth (): boolean {
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

    async logoutAsync (): Promise<void> {
        const [result, error]: IQueryResult<IUser>[] = await this.sharedService.handlePromises(this.userService.logout(this.getToken()));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('login.logout-error', false);

        this.sharedService.handleSnackbarMessages('login.logout-success');
        this.rawToken = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['']);
        this.emitMenu.emit(false);
    }

    authenticateToken (result: IJwtPayload): boolean {
        const token = result.token;
        this.rawToken = token;

        if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.decodeJwtToken(this.rawToken);
            this.authStatusListener.next(true);
            const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);

            this.saveAuthData(token, expirationDate, this.loggedUser.userId);
            this.emitMenu.emit(true);
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
            this.rawToken = authInformation.token;
            this.decodeJwtToken(this.rawToken);
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            return true;
        }

        return false;
    }

    getAuthData (): IJwtPayload | false {
        const token = localStorage.getItem('token') as string;
        const expirationDate = localStorage.getItem('expiration') as string;
        const userId = localStorage.getItem('userId') as string;
        const userRole = localStorage.getItem('userRole') as ERole;

        if (!token || !expirationDate) {
            return false;
        }

        return {
            token,
            expirationDate: new Date(expirationDate),
            userId,
            userRole,
            expiresIn: 0
        };
    }

    private saveAuthData (token: string, expirationDate: Date, userId: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData (): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private setAuthTimer (duration: number): void {
        this.tokenTimer = setTimeout(() => this.logoutAsync(), duration * 1000);
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
}
