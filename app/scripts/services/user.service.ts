import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { AuthService } from '@services/auth.service';
import { CrudService } from '@services/crud.service';
import { SharedService } from '@services/shared.service';

const endpoint = environment.baseUri + '/users';

@Injectable({ providedIn: 'root' })
export class UserService extends CrudService<IUser> {
    emitUser: EventEmitter<IUser> = new EventEmitter<IUser>();

    constructor (
        protected override http: HttpClient, //
        protected override sharedService: SharedService,
        protected override authService: AuthService
    ) {
        super(http, sharedService, authService, endpoint);
    }

    checkIfEmailExists (email: string): Observable<IQueryResult<IUser>> {
        const url = `${endpoint}/email/${email}`;

        return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler));
    }
}
