import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { IAuthData } from '@app/scripts/models/auth-data.interface';
import { ERole } from '@app/scripts/models/enums/role.enum';
import { IJwtPayload } from '@app/scripts/models/jwt-payload.interface';
import { IJwtToken } from '@app/scripts/models/jwt-token.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { CookiesService } from '@app/scripts/services/cookies.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { environment } from '@root/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = environment.baseUri + '/auth';
  onMenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  onSidebarChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private accessToken!: string;
  private refreshToken!: string;
  private decodedToken!: IJwtToken;
  private loggedUser!: IAuthData;
  private refreshTokenTimeout;
  private isAuthenticated = false;
  private keepUserLoggedIn = false;

  protected sharedService = this.injector.get(SharedService);
  protected cookiesService = this.injector.get(CookiesService);

  constructor(
    private injector: Injector,
    private router: Router,
    private http: HttpClient,
  ) {}

  getKeepUserLoggedIn(): boolean {
    return this.keepUserLoggedIn;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.loggedUser.userId;
  }

  getUserRole(): ERole {
    return this.loggedUser.role;
  }

  getLoggedUser(): IAuthData {
    return this.loggedUser;
  }

  authenticate(email: string, password: string, keepUserLoggedIn: boolean): Promise<IQueryResult<IJwtPayload>> {
    const credentials = { email, password, keepUserLoggedIn };
    const url = `${this.url}/authenticate`;

    return lastValueFrom(this.http.post<IQueryResult<IJwtPayload>>(url, credentials).pipe(catchError(this.sharedService.errorHandler)));
  }

  register(user: IUser): Promise<IQueryResult<IUser>> {
    const url = `${this.url}/register`;

    return lastValueFrom(this.http.post<IQueryResult<IUser>>(url, user).pipe(catchError(this.sharedService.errorHandler)));
  }

  checkIfEmailExists(email: string): Observable<IQueryResult<IUser>> {
    const url = `${this.url}/emailExists/${email}`;

    return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler));
  }

  changePassword(userId: string, password: string): Promise<IQueryResult<IUser>> {
    const url = `${this.url}/changePassword`;
    const body = { _id: userId, password };

    return lastValueFrom(this.http.put<IQueryResult<IUser>>(url, body).pipe(catchError(this.sharedService.errorHandler)));
  }

  generateRefreshToken(): Promise<IQueryResult<IJwtPayload>> {
    const url = `${this.url}/refresh`;

    return lastValueFrom(
      this.http
        .post<IQueryResult<IJwtPayload>>(url, { ...this.loggedUser, refresh: this.getRefreshToken() })
        .pipe(tap((response: IQueryResult<IJwtPayload>) => this.authenticateToken(response.data[0])))
        .pipe(catchError(this.sharedService.errorHandler)),
    );
  }

  logout(token: string): Promise<IQueryResult<IUser>> {
    const url = `${this.url}/logout`;

    return lastValueFrom(this.http.post<IQueryResult<IUser>>(url, { token }).pipe(catchError(this.sharedService.errorHandler)));
  }

  authenticateToken(result: IJwtPayload): boolean {
    const access = result.access;
    const refresh = result.refresh;
    this.accessToken = access;
    this.refreshToken = refresh;
    this.keepUserLoggedIn = result.keepUserLoggedIn || this.keepUserLoggedIn;

    if (access) {
      const expiresInDuration = result.expiresIn;
      this.isAuthenticated = true;
      this.decodeJwtToken(this.accessToken);
      const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);

      this.saveAuthData(access, refresh, expirationDate, this.loggedUser.userId, this.keepUserLoggedIn);
      this.startRefreshTokenTimerAsync(result);
      return true;
    } else {
      return false;
    }
  }

  verifyAuthorization(): boolean {
    const authInformation = this.getAuthData();

    if (!authInformation) return false;

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (!this.refreshTokenTimeout) {
      this.refreshTokenTimeout = setTimeout(async () => this.logoutAsync(), expiresIn);
    }

    if (expiresIn > 0) {
      this.accessToken = authInformation.access;
      this.decodeJwtToken(this.accessToken);
      this.isAuthenticated = true;
      this.onMenuChange.emit(true);
      setTimeout(() => {
        this.onSidebarChange.emit(true);
      }, 750);
      return true;
    }

    return false;
  }

  getAuthData(): IJwtPayload | false {
    const access = this.cookiesService.getItem('access');
    const refresh = this.cookiesService.getItem('refresh') as string;
    const expirationDate = this.cookiesService.getItem('expiration');
    const userId = this.cookiesService.getItem('userId') as string;
    const keepUserLoggedIn = this.cookiesService.getItem('keepUserLoggedIn') === 'true';

    if (!access || !expirationDate) return false;

    return {
      access,
      refresh,
      expirationDate: new Date(expirationDate),
      userId,
      expiresIn: 0,
      keepUserLoggedIn,
    };
  }

  private saveAuthData(access: string, refresh: string, expirationDate: Date, userId: string, keepUserLogged: boolean): void {
    this.cookiesService.setItem('access', access);
    this.cookiesService.setItem('refresh', refresh);
    this.cookiesService.setItem('expiration', expirationDate.toISOString());
    this.cookiesService.setItem('userId', userId);
    this.cookiesService.setItem('keepUserLogged', String(keepUserLogged));
  }

  private clearAuthData(): void {
    this.cookiesService.removeItem('access');
    this.cookiesService.removeItem('refresh');
    this.cookiesService.removeItem('expiration');
    this.cookiesService.removeItem('userId');
  }

  private async startRefreshTokenTimerAsync(jwtPayload: IJwtPayload): Promise<void> {
    const jwtToken = jwtPayload;
    const timeout = jwtToken.expiresIn * 1000;

    if (this.getKeepUserLoggedIn()) {
      this.refreshTokenTimeout = setTimeout(async () => {
        const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handlePromises(this.generateRefreshToken());

        if (!result || !result.success || error) {
          this.logoutAsync();
        }
      }, timeout);
    } else {
      setTimeout(() => this.logoutAsync(), timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  private decodeJwtToken(token: string): void {
    const helper = new JwtHelperService();
    this.decodedToken = helper.decodeToken(token) as IJwtToken;

    this.loggedUser = {
      role: this.decodedToken.role as ERole,
      email: this.decodedToken.email,
      userId: this.decodedToken.userId,
    };
  }

  async logoutAsync(): Promise<void> {
    await this.sharedService.handlePromises(this.logout(this.getAccessToken()));
    this.stopRefreshTokenTimer();
    this.accessToken = '';
    this.isAuthenticated = false;
    this.clearAuthData();
    this.sharedService.handleSnackbars({ translationKey: 'login.logout-success' });
    this.router.navigate(['']);
    this.onMenuChange.emit(false);
    this.onSidebarChange.emit(false);
  }
}
