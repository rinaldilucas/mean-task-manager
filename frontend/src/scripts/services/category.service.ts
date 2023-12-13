import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable, catchError } from 'rxjs';

import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { CrudService } from '@app/scripts/services/crud.service';
import { environment } from '@root/environments/environment';

const endpoint = environment.baseUri + '/categories';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CrudService<ICategory> {
  constructor(http: HttpClient, injector: Injector) {
    super(http, injector, endpoint);
  }

  override getAll(): Observable<IQueryResult<ICategory[]>> {
    let params = new HttpParams();
    params = params.append('onlyMine', true);

    return this.http.get<IQueryResult<ICategory[]>>(endpoint, { params }).pipe(catchError(this.sharedService.errorHandler));
  }
}
