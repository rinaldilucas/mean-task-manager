import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IUser } from '@app/scripts/models/user.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { IJwtPayload } from '@app/scripts/models/jwtPayload.interface';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    emitUser: EventEmitter<IUser> = new EventEmitter<IUser>();
    private url: string = environment.baseUri + '/users';

    constructor (private http: HttpClient, private sharedService: SharedService) {}

    listUsers (): Promise<IQueryResult<IUser>[]> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.get<IQueryResult<IUser>[]>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getUser (id: string): Promise<IQueryResult<IUser>> {
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    checkIfEmailExists (email: string): Observable<IQueryResult<IUser>> {
        const url = `${this.url}/email/${email}`;

        return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler));
    }

    removeUser (user: IUser | string): Promise<IQueryResult<IUser>> {
        const id = typeof user === 'string' ? user : user._id;
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    updateUser (user: IUser): Promise<IQueryResult<IUser>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.put<IQueryResult<IUser>>(url, user).pipe(catchError(this.sharedService.errorHandler)));
    }

    authenticate (email: string, password: string): Promise<IQueryResult<IJwtPayload>> {
        const credentials = { email, password };
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

    changePassword (userId: string, password: string): Promise<IQueryResult<any>> {
        const url = `${this.url}/changePassword`;
        const body = { _id: userId, password };

        return lastValueFrom(this.http.put<IQueryResult<any>>(url, body).pipe(catchError(this.sharedService.errorHandler)));
    }
}
