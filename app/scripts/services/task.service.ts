import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
    emitTask: EventEmitter<ITask> = new EventEmitter<ITask>();
    private url: string = environment.baseUri + '/tasks';

    constructor(private http: HttpClient, private sharedService: SharedService, private authService: AuthService) {}

    listTasksByUser(pageSize: number, searchTerm?: string, pageIndex?: number): Promise<IQueryResult<ITask> | undefined> {
        const id = this.authService.getUserId();
        let url = `${this.url}/user/${id}?`;

        if (!!pageSize) url += `pageSize=${pageSize}&`;
        if (!!pageIndex) url += `pageIndex=${pageIndex}&`;
        if (!!searchTerm) url += `searchTerm=${searchTerm}`;

        return this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    filterTasksByUser(searchTerm: string): Promise<IQueryResult<ITask> | undefined> {
        const id = this.authService.getUserId();
        const url = `${this.url}/user/${id}?searchTerm=${searchTerm}`;

        return this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    getTask(id: string): Promise<IQueryResult<ITask> | undefined> {
        const url = `${this.url}/${id}`;

        return this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    createTask(task: ITask): Promise<IQueryResult<ITask> | undefined> {
        const url = `${this.url}`;

        return this.http.post<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    removeTask(task: ITask | string): Promise<IQueryResult<ITask> | undefined> {
        const id = typeof task === 'string' ? task : task._id;
        const url = `${this.url}/${id}`;

        return this.http.delete<IQueryResult<ITask>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    updateTask(task: ITask): Promise<IQueryResult<ITask> | undefined> {
        const url = `${this.url}`;

        debugger;
        return this.http.put<IQueryResult<ITask>>(url, task).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }
}
