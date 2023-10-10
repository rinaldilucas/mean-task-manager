import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { ICategory } from '@app/scripts/models/category.interface';
import { CrudService } from '@app/scripts/services/crud.service';
import { environment } from '@root/environments/environment';

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
