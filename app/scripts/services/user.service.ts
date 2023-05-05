import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { SharedService } from '@scripts/services/shared.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    emitUser: EventEmitter<IUser> = new EventEmitter<IUser>();
    private url: string = environment.baseUri + '/users';

    constructor (private http: HttpClient, private sharedService: SharedService) {}

    listUsers (): Promise<IQueryResult<IUser[]>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.get<IQueryResult<IUser[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
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
}
