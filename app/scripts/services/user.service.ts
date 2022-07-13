import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { first, map, switchMap } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IUser } from '@app/scripts/models/user.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { UtilService } from '@app/scripts/services/util.service';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { AbstractControl } from '@angular/forms';
@Injectable({ providedIn: 'root' })
export class UserService {
    emitUser: EventEmitter<IUser> = new EventEmitter<IUser>();
    private url: string = environment.baseUri + '/users';

    constructor(private http: HttpClient, private utilService: UtilService, private translateService: TranslateService) {}

    listUsers(): Observable<IQueryResult<IUser>[]> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.get<IQueryResult<IUser>[]>(url).pipe(catchError(this.utilService.errorHandler));
    }

    getUser(id: string): Observable<IQueryResult<IUser>> {
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;

        return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    getUserByUsername(username: string): Observable<IQueryResult<IUser>> {
        const url = `${this.url}/username/${username}?language=${this.translateService.currentLang}`;

        return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    deleteUser(user: IUser | string): Observable<IQueryResult<IUser>> {
        const id = typeof user === 'string' ? user : user._id;
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;

        return this.http.delete<IQueryResult<IUser>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    updateUser(user: IUser): Observable<IQueryResult<IUser>> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.put<IQueryResult<IUser>>(url, user).pipe(catchError(this.utilService.errorHandler));
    }

    authenticate(username: string, password: string): Observable<IQueryResult<IJwtPayload>> {
        const credentials = { username, password };
        const url = `${this.url}/authenticate?language=${this.translateService.currentLang}`;

        return this.http.post<IQueryResult<IJwtPayload>>(url, credentials).pipe(catchError(this.utilService.errorHandler));
    }

    register(user: IUser): Observable<IQueryResult<IUser>> {
        const url = `${this.url}/register?language=${this.translateService.currentLang}`;

        return this.http.post<IQueryResult<IUser>>(url, user).pipe(catchError(this.utilService.errorHandler));
    }

    logout(token: string): Observable<IQueryResult<IUser>> {
        const url = `${this.url}/logout?language=${this.translateService.currentLang}`;

        return this.http.post<IQueryResult<IUser>>(url, { token }).pipe(catchError(this.utilService.errorHandler));
    }

    verifyUsernameTaken() {
        return (control: AbstractControl) => {
            return control.valueChanges.pipe(
                switchMap((username: string) => this.getUserByUsername(username)),
                map((response: IQueryResult<IUser>) => (response.count > 0 ? { userexists: true } : null)),
                first(),
            );
        };
    }
}
