import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { IQuery } from '@scripts/models/query.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';

@Injectable({ providedIn: 'root' })
export class QueriesHandlerService {
    constructor (public http: HttpClient) {}

    handle<T> (query: IQuery<T>): Observable<IQueryResult<T> | T> {
        if (!query.isValid()) return throwError(() => ({} as IQueryResult<T>));

        return query.execute(this);
    }
}
