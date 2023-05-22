import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { CrudService } from '@services/crud.service';

const endpoint = environment.baseUri + '/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService extends CrudService<ITask> {
    taskEmitter: EventEmitter<ITask> = new EventEmitter<ITask>();

    constructor (
        http: HttpClient, //
        injector: Injector
    ) {
        super(http, injector, endpoint);
    }

    override findAllByUser ({ pageSize, searchTerm, pageIndex = 0, sortFilter, sortDirection }: { pageSize?: number; searchTerm?: string; pageIndex?: number; sortFilter?: string; sortDirection?: string; } = {}): Observable<IQueryResult<ITask[]>> {
        const userId = this.authService.getUserId();
        const url = `${endpoint}/user/${userId}?`;

        let params = new HttpParams();
        if (sortFilter) { params = params.set('sortFilter', sortFilter).set('sortDirection', sortDirection as string); }
        if (pageSize) params = params.set('pageSize', pageSize);
        if (pageIndex) params = params.set('pageIndex', pageIndex);
        if (searchTerm) params = params.set('searchTerm', searchTerm as string);

        return this.http.get<IQueryResult<ITask[]>>(url, { params }).pipe(catchError(this.sharedService.errorHandler));
    }

    getTasksByDateInterval ({ startDate, finalDate }: { startDate: Date; finalDate: Date; }): Promise<IQueryResult<ITask>> {
        const userId = this.authService.getUserId();
        const url = `${endpoint}/by-interval/${userId}?`;

        let params = new HttpParams();
        params = params.set('startDate', startDate.toISOString());
        params = params.set('finalDate', finalDate.toISOString());

        return lastValueFrom(this.http.get<IQueryResult<ITask>>(url, { params }).pipe(catchError(this.sharedService.errorHandler)));
    }
}
