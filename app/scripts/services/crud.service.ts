import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Injector } from '@angular/core';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';

export class CrudService<T> {
    protected sharedService = this.injector.get(SharedService);
    protected authService = this.injector.get(AuthService);

    constructor (
        protected http: HttpClient, //
        private injector: Injector,
        private endpoint: string
    ) {}

    findAllByUser (): Observable<IQueryResult<T[]>> {
        const userId = this.authService.getUserId();
        const url = `${this.endpoint}/user/${userId}?`;

        return this.http.get<IQueryResult<T[]>>(url).pipe(catchError(this.sharedService.errorHandler));
    }

    get (id: string): Observable<IQueryResult<T>> {
        const url = `${this.endpoint}/${id}`;

        return this.http.get<IQueryResult<T>>(url).pipe(catchError(this.sharedService.errorHandler));
    }

    save (record: T): Promise<IQueryResult<T>> {
        if (record['_id']) return this.update(record);
        else return this.create(record);
    }

    remove (record: T | string): Promise<IQueryResult<T>> {
        const id = typeof record === 'string' ? record : record['_id'];
        const url = `${this.endpoint}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<T>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    private create (record: T): Promise<IQueryResult<T>> {
        const url = `${this.endpoint}`;
        record['userId'] = this.authService.getUserId();

        return lastValueFrom(this.http.post<IQueryResult<T>>(url, record).pipe(catchError(this.sharedService.errorHandler)));
    }

    private update (record: T): Promise<IQueryResult<T>> {
        const url = `${this.endpoint}`;
        record['userId'] = this.authService.getUserId();

        return lastValueFrom(this.http.put<IQueryResult<T>>(url, record).pipe(catchError(this.sharedService.errorHandler)));
    }
}
