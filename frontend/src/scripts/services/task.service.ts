import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';

import { Observable, catchError } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { CrudService } from '@app/scripts/services/crud.service';
import { environment } from '@root/environments/environment';

const endpoint = environment.baseUri + '/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService extends CrudService<ITask> {
  onTaskChange: EventEmitter<void> = new EventEmitter<void>();

  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, endpoint);
  }

  override getAll({
    pageSize,
    searchTerm,
    pageIndex = 0,
    sortFilter,
    sortDirection,
    startDate,
    finalDate,
  }: {
    pageSize?: number;
    searchTerm?: string;
    pageIndex?: number;
    sortFilter?: string;
    sortDirection?: string;
    startDate?: Date;
    finalDate?: Date;
  } = {}): Observable<IQueryResult<ITask[]>> {
    let params = new HttpParams();
    if (sortFilter) {
      params = params.set('sortFilter', sortFilter).set('sortDirection', sortDirection as string);
    }
    if (pageSize) params = params.set('pageSize', pageSize);
    if (pageIndex) params = params.set('pageIndex', pageIndex);
    if (searchTerm) params = params.set('searchTerm', searchTerm as string);
    if (startDate && finalDate) {
      params = params.set('startDate', startDate.toISOString()).set('finalDate', finalDate.toISOString());
    }

    return this.http.get<IQueryResult<ITask[]>>(endpoint, { params }).pipe(catchError(this.sharedService.errorHandler));
  }
}
