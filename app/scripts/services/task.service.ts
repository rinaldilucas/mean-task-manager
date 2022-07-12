import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@app/environments/environment';
import { ITask } from '@app/scripts/models/task.interface';
import { UtilService } from '@app/scripts/services/util.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { AuthService } from '@app/scripts/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
    emitTask: EventEmitter<ITask> = new EventEmitter<ITask>();
    private url: string = environment.baseUri + '/tasks';

    constructor(private http: HttpClient, private utilService: UtilService, private authService: AuthService, private translateService: TranslateService) {}

    listTasksByUser(): Observable<IQueryResult<ITask>> {
        const id = this.authService.getUserId();
        const url = `${this.url}/user/${id}?language=${this.translateService.currentLang}`;
        return this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    getTask(id: string): Observable<IQueryResult<ITask>> {
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;
        return this.http.get<IQueryResult<ITask>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    createTask(task: ITask): Observable<IQueryResult<ITask>> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.post<IQueryResult<ITask>>(url, task).pipe(catchError(this.utilService.errorHandler));
    }

    deleteTask(task: ITask | string): Observable<IQueryResult<ITask>> {
        const id = typeof task === 'string' ? task : task._id;
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;

        return this.http.delete<IQueryResult<ITask>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    updateTask(task: ITask): Observable<IQueryResult<ITask>> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.put<IQueryResult<ITask>>(url, task).pipe(catchError(this.utilService.errorHandler));
    }
}
