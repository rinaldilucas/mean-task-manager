import { Injectable } from '@angular/core';

import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { CategoryService } from '@root/src/scripts/services/category.service';

@Injectable({ providedIn: 'root' })
export class TaskCategoryResolver {
  constructor(private categoryService: CategoryService) { }

  resolve(): Observable<ICategory[][]> {
    return this.categoryService.findAll()
      .pipe(map((result: IQueryResult<ICategory[]>) => result.data));
  }
}
