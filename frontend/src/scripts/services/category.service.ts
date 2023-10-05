import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { ICategory } from '@app/scripts/models/category.interface';
import { environment } from '@root/environments/environment';
import { CrudService } from '@root/src/scripts/services/crud.service';

const endpoint = environment.baseUri + '/categories';

@Injectable({ providedIn: 'root' })
export class CategoryService extends CrudService<ICategory> {
  constructor(
    http: HttpClient,
    injector: Injector,
  ) {
    super(http, injector, endpoint);
  }
}
