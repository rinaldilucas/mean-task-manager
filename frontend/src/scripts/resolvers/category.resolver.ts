import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';

import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { CategoryService } from '@app/scripts/services/category.service';

export const CategoryResolver: ResolveFn<any> = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const categoryService = inject(CategoryService);

  const $categories = categoryService.getAll().pipe(map((result: IQueryResult<ICategory[]>) => result.data));

  switch (state.url) {
    default:
      return $categories;
  }
};
