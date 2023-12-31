import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { IJwtPayload } from '@app/scripts/models/jwt-payload.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { IUser } from '@app/scripts/models/user.interface';
import { CrudService } from '@app/scripts/services/crud.service';
import { environment } from '@root/environments/environment';

const endpoint = environment.baseUri + '/users';

@Injectable({ providedIn: 'root' })
export class UserService extends CrudService<IUser> {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, endpoint);
  }

  authenticate(email: string, password: string, keepUserLoggedIn: boolean): Observable<IQueryResult<IJwtPayload>> {
    const credentials = { email, password, keepUserLoggedIn };
    const url = `${endpoint}/authenticate`;

    return this.http.post<IQueryResult<IJwtPayload>>(url, credentials).pipe(catchError(this.sharedService.errorHandler));
  }

  checkIfEmailExists(email: string): Observable<IQueryResult<{ emailExists: string }>> {
    const url = `${endpoint}/exists/${email}`;

    return this.http.get<IQueryResult<{ emailExists: string }>>(url).pipe(catchError(this.sharedService.errorHandler));
  }

  changePassword(userId: string, password: string): Observable<IQueryResult<IUser>> {
    const url = `${endpoint}/changePassword/${userId}`;
    const body = { password };

    return this.http.put<IQueryResult<IUser>>(url, body).pipe(catchError(this.sharedService.errorHandler));
  }

  refreshToken(): Observable<IQueryResult<IJwtPayload>> {
    const url = `${endpoint}/refreshToken`;

    return this.http
      .post<IQueryResult<IJwtPayload>>(url, {
        ...this.authService.getLoggedUser(),
        refresh: this.authService.getRefreshToken(),
      })
      .pipe(
        tap((response: IQueryResult<IJwtPayload>) => {
          const jwtPayload = response.data[0];
          if (jwtPayload) {
            this.authService.authenticateToken(jwtPayload);
          }
        }),
        catchError(this.sharedService.errorHandler),
      );
  }

  logout(token: string): Observable<IQueryResult<IUser>> {
    const url = `${endpoint}/logout`;

    return this.http.post<IQueryResult<IUser>>(url, { token }).pipe(catchError(this.sharedService.errorHandler));
  }
}
