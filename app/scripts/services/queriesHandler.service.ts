import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { IQuery } from '@app/scripts/models/query.interface';

@Injectable({ providedIn: 'root' })
export class QueriesHandlerService {
    constructor (public http: HttpClient) {}

    handle<T> (query: IQuery<T>): Observable<IQueryResult<T> | T> {
        if (!query.isValid()) return throwError(() => ({} as IQueryResult<T>));

        return query.execute(this);
    }
}
