import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom } from 'rxjs';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { AuthService } from '@services/auth.service';
import { CrudService } from '@services/crud.service';
import { SharedService } from '@services/shared.service';

const endpoint = environment.baseUri + '/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService extends CrudService<ITask> {
    emitTask: EventEmitter<ITask> = new EventEmitter<ITask>();

    constructor (
        protected override http: HttpClient, //
        protected override sharedService: SharedService,
        protected override authService: AuthService
    ) {
        super(http, sharedService, authService, endpoint);
    }

    override findAllByUser ({ pageSize, searchTerm, pageIndex = 0, sortFilter, sortDirection }: { pageSize?: number; searchTerm?: string; pageIndex?: number; sortFilter?: string; sortDirection?: string; } = {}): Observable<IQueryResult<ITask[]>> {
        const userId = this.authService.getUserId();
        let url = `${endpoint}/user/${userId}?`;

        if (sortFilter) url += `sortFilter=${sortFilter}&sortDirection=${sortDirection}&`;
        if (pageSize) url += `pageSize=${pageSize}&`;
        if (pageIndex) url += `pageIndex=${pageIndex}&`;
        if (searchTerm) url += `searchTerm=${searchTerm}`;

        return this.http.get<IQueryResult<ITask[]>>(url).pipe(catchError(this.sharedService.errorHandler));
    }

    getTasksByDateInterval ({ startDate, finalDate }: { startDate: Date; finalDate: Date; }): Promise<IQueryResult<ITask>> {
        const userId = this.authService.getUserId();
        let url = `${endpoint}/by-interval/${userId}?`;
        url += `startDate=${startDate.toISOString()}&`;
        url += `finalDate=${finalDate.toISOString()}&`;

        return lastValueFrom(this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }
}
