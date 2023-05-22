import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { IUser } from '@scripts/models/user.interface';
import { CrudService } from '@services/crud.service';

const endpoint = environment.baseUri + '/users';

@Injectable({ providedIn: 'root' })
export class UserService extends CrudService<IUser> {
    constructor (
        http: HttpClient, //
        injector: Injector
    ) {
        super(http, injector, endpoint);
    }

    checkIfEmailExists (email: string): Observable<IQueryResult<IUser>> {
        const url = `${endpoint}/email/${email}`;

        return this.http.get<IQueryResult<IUser>>(url).pipe(catchError(this.sharedService.errorHandler));
    }
}
