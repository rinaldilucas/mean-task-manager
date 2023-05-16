import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { AuthService } from '@services/auth.service';
import { SharedService } from '@services/shared.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
    emitTask: EventEmitter<ITask> = new EventEmitter<ITask>();
    private readonly url = environment.baseUri + '/tasks';

    constructor (private http: HttpClient, private sharedService: SharedService, private authService: AuthService) {}

    findAllByUser ({ pageSize, searchTerm, pageIndex = 0, sortFilter, sortDirection }: { pageSize?: number; searchTerm?: string; pageIndex?: number; sortFilter?: string; sortDirection?: string; } = {}): Promise<IQueryResult<ITask[]>> {
        const userId = this.authService.getUserId();
        let url = `${this.url}/user/${userId}?`;

        if (sortFilter) url += `sortFilter=${sortFilter}&sortDirection=${sortDirection}&`;
        if (pageSize) url += `pageSize=${pageSize}&`;
        if (pageIndex) url += `pageIndex=${pageIndex}&`;
        if (searchTerm) url += `searchTerm=${searchTerm}`;

        return lastValueFrom(this.http.get<IQueryResult<ITask[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getTasksByDateInterval ({ startDate, finalDate }: { startDate: Date; finalDate: Date; }): Promise<IQueryResult<ITask>> {
        const userId = this.authService.getUserId();
        let url = `${this.url}/by-interval/${userId}?`;
        url += `startDate=${startDate.toISOString()}&`;
        url += `finalDate=${finalDate.toISOString()}&`;

        return lastValueFrom(this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getTask (id: string): Promise<IQueryResult<ITask>> {
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    createTask (task: ITask): Promise<IQueryResult<ITask>> {
        const url = `${this.url}`;
        task.userId = this.authService.getUserId();

        return lastValueFrom(this.http.post<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)));
    }

    removeTask (task: ITask | string): Promise<IQueryResult<ITask>> {
        const id = typeof task === 'string' ? task : task._id;
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    updateTask (task: ITask): Promise<IQueryResult<ITask>> {
        const url = `${this.url}`;
        task.userId = this.authService.getUserId();

        return lastValueFrom(this.http.put<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)));
    }
}
