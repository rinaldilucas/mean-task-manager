import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { IJwtToken } from '@app/scripts/models/jwToken.interface';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    emitMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    private isAuthenticated = false;
    private token: string;
    private tokenTimer: ReturnType<typeof setTimeout>;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private router: Router, public userService: UserService) {}

    getToken(): string {
        return this.token;
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    getUserId(): string {
        return this.userId;
    }

    getAuthStatusListener(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    authenticateToken(result: IJwtToken): boolean {
        const token = result.token;
        this.token = token;

        if (token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = result.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

            this.saveAuthData(token, expirationDate, this.userId);
            this.emitMenu.emit(true);
            return true;
        } else {
            return false;
        }
    }

    logout(): void {
        this.userService.logout(this.getToken()).subscribe();
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
        this.emitMenu.emit(false);
    }

    verifyAuthorization(): boolean {
        const authInformation = this.getAuthData();

        if (!authInformation) {
            return false;
        }

        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            return true;
        }

        return false;
    }

    getAuthData(): IJwtToken {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if (!token || !expirationDate) {
            return undefined;
        }

        return {
            token,
            expirationDate: new Date(expirationDate),
            userId,
        };
    }

    private setAuthTimer(duration: number): void {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }
}
