import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { environment } from '@app/environments/environment';
import { ICategory } from '@scripts/models/category.interface';
import { CrudService } from '@services/crud.service';

const endpoint = environment.baseUri + '/categories';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CrudService<ICategory> {
  constructor(
    http: HttpClient, //
    injector: Injector,
  ) {
    super(http, injector, endpoint);
  }
}
