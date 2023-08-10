import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import Cookies from 'js-cookie';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IAuthData } from '@app/scripts/models/authData.interface';
import { ERole } from '@app/scripts/models/enum/role.enum';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { IJwtToken } from '@app/scripts/models/jwtToken.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { SharedService } from '@app/scripts/services/shared.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = environment.baseUri + '/auth';
  emitterMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  sidebarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private accessToken!: string;
  private refreshToken!: string;
  private decodedToken!: IJwtToken;
  private loggedUser!: IAuthData;
  private refreshTokenTimeout;
  private isAuthenticated = false;
  private keepUserLoggedIn = false;

  protected sharedService = this.injector.get(SharedService);

  constructor(
    private injector: Injector,
    private router: Router, //
    private http: HttpClient,
  ) { }

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
    const url = `${this.url}/email-exists/${email}`;

    return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler));
  }

  changePassword(userId: string, password: string): Promise<IQueryResult<IUser>> {
    const url = `${this.url}/changePassword`;
    const body = { _id: userId, password };

    return lastValueFrom(this.http.put<IQueryResult<IUser>>(url, body).pipe(catchError(this.sharedService.errorHandler)));
  }

  generateRefreshToken(): Promise<IQueryResult<IJwtPayload>> {
    const url = `${this.url}/refresh`;

    return lastValueFrom(this.http.post<IQueryResult<IJwtPayload>>(url, { ...this.loggedUser, refresh: this.getRefreshToken() })
      .pipe(tap((response: IQueryResult<IJwtPayload>) => this.authenticateToken(response.data[0])))
      .pipe(catchError(this.sharedService.errorHandler)));
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
    if (!this.refreshTokenTimeout) { this.refreshTokenTimeout = setTimeout(async () => this.logoutAsync(), expiresIn); }

    if (expiresIn > 0) {
      this.accessToken = authInformation.access;
      this.decodeJwtToken(this.accessToken);
      this.isAuthenticated = true;
      this.emitterMenu.emit(true);
      setTimeout(() => { this.sidebarEmitter.emit(true); }, 750);
      return true;
    }

    return false;
  }

  getAuthData(): IJwtPayload | false {
    const access = Cookies.get('access');
    const refresh = Cookies.get('refresh');
    const expirationDate = Cookies.get('expiration');
    const userId = Cookies.get('userId');
    const userRole = Cookies.get('userRole');
    const keepUserLoggedIn = Cookies.get('keepUserLoggedIn') === 'true';

    if (!access || !expirationDate) return false;



    return {
      access,
      refresh,
      expirationDate: new Date(expirationDate),
      userId,
      userRole,
      expiresIn: 0,
      keepUserLoggedIn,
    };
  }

  private saveAuthData(access: string, refresh: string, expirationDate: Date, userId: string, keepUserLogged: boolean): void {
    const options = {
      secure: true,
      sameSite: 'strict',
    };

    Cookies.set('access', access, options);
    Cookies.set('refresh', refresh, options);
    Cookies.set('expiration', expirationDate.toISOString(), options);
    Cookies.set('userId', userId, options);
    Cookies.set('keepUserLogged', String(keepUserLogged), options);
  }

  private clearAuthData(): void {
    Cookies.remove('access');
    Cookies.remove('refresh');
    Cookies.remove('expiration');
    Cookies.remove('userId');
  }

  private async startRefreshTokenTimerAsync(jwtPayload: IJwtPayload): Promise<void> {
    const jwtToken = jwtPayload;
    const timeout = jwtToken.expiresIn * 1000;

    if (this.getKeepUserLoggedIn()) {
      this.refreshTokenTimeout = setTimeout(async () => {
        const [result, error]: IQueryResult<IJwtPayload>[] = await this.sharedService.handlePromises(this.generateRefreshToken());

        if (!!error || !result || !result?.success) { this.logoutAsync(); }
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
    this.sharedService.handleSnackbarMessages({ translationKey: 'login.logout-success', success: true });
    this.router.navigate(['']);
    this.emitterMenu.emit(false);
    this.sidebarEmitter.emit(false);
  }
}
