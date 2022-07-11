import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { IJwtToken } from '@app/scripts/models/jwtToken.interface';
import { UserService } from '@app/scripts/services/user.service';
import { ERole } from '@app/scripts/models/enum/role.enum';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { IAuthData } from '@app/scripts/models/authData.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    emitMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    private isAuthenticated = false;
    private loggedUser: IAuthData;
    private tokenTimer: ReturnType<typeof setTimeout>;
    private authStatusListener = new Subject<boolean>();
    private rawToken: string;
    private decodedToken: IJwtToken;

    constructor(private router: Router, public userService: UserService) {}

    getToken(): string {
        return this.rawToken;
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getUserId(): string {
        return this.loggedUser.userId;
    }

    getUsername(): string {
        return this.loggedUser.username;
    }

    getUserRole(): ERole {
        return this.loggedUser.role;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    authenticateToken(result: IJwtPayload): boolean {
        const token = result.token;
        this.rawToken = token;

        if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.decodeJwtToken(result);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.emitMenu.emit(true);
            return true;
        } else {
            return false;
        }
    }

    verifyAuthorization(): boolean {
        const authInformation = this.getAuthData();

        if (!authInformation) {
            return false;
        }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.isAuthenticated = true;
            this.loggedUser.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            return true;
        }

        return false;
    }

    decodeJwtToken(payload: IJwtPayload): void {
        const helper = new JwtHelperService();
        this.decodedToken = helper.decodeToken(payload.token) as IJwtToken;

        this.loggedUser = {
            role: this.decodedToken.role as ERole,
            username: this.decodedToken.username,
            userId: this.decodedToken.userId,
            expirationDate: new Date(new Date().getTime() + payload.expiresIn * 1000),
        };

        localStorage.setItem('token', payload.token);
        localStorage.setItem('expiration', this.loggedUser.expirationDate.toISOString());
        localStorage.setItem('userId', this.loggedUser.userId);
        localStorage.setItem('username', this.loggedUser.username);
    }

    getAuthData(): IAuthData {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role') as ERole;

        if (!token || !expirationDate) {
            return undefined;
        }

        return {
            expirationDate: new Date(expirationDate),
            userId,
            username,
            role,
        };
    }

    private setAuthTimer(duration: number): void {
        this.tokenTimer = setTimeout(() => this.logout(), duration * 1000);
    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }

    logout(): void {
        this.userService.logout(this.getToken()).subscribe();
        this.rawToken = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
        this.emitMenu.emit(false);
    }
}
