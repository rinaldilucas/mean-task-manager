/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { AuthService } from '@app/scripts/services/auth.service';
import { SharedService } from '@app/scripts/services/shared.service';

export class CrudService<T> {
  protected sharedService = this.injector.get(SharedService);
  protected authService = this.injector.get(AuthService);

  constructor(
    protected http: HttpClient,
    protected injector: Injector,
    private endpoint: string,
  ) {}

  getAll(): Observable<IQueryResult<T[]>> {
    return this.http.get<IQueryResult<T[]>>(this.endpoint).pipe(catchError(this.sharedService.errorHandler));
  }

  get(id: string): Observable<IQueryResult<T>> {
    const url = `${this.endpoint}/${id}`;

    return this.http.get<IQueryResult<T>>(url).pipe(catchError(this.sharedService.errorHandler));
  }

  save(record: T): Observable<IQueryResult<T>> {
    if ((record as any)._id) return this.update(record);
    else return this.create(record);
  }

  private create(record: T): Observable<IQueryResult<T>> {
    if (!this.sharedService.isUserType(record)) {
      (record as any).userId = this.authService.getUserId();
    }
    return this.http.post<IQueryResult<T>>(this.endpoint, record).pipe(catchError(this.sharedService.errorHandler));
  }

  private update(record: T): Observable<IQueryResult<T>> {
    const url = `${this.endpoint}/${(record as any)._id}`;

    return this.http.put<IQueryResult<T>>(url, record).pipe(catchError(this.sharedService.errorHandler));
  }

  remove(record: T | string): Observable<IQueryResult<T>> {
    const id = typeof record === 'string' ? record : (record as any)._id;
    const url = `${this.endpoint}/${id}`;

    return this.http.delete<IQueryResult<T>>(url).pipe(catchError(this.sharedService.errorHandler));
  }
}
