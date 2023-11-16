import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { CategoryService } from '@app/scripts/services/category.service';
import { TaskService } from '@app/scripts/services/task.service';

export const TaskResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const taskService = inject(TaskService);
  const categoryService = inject(CategoryService);

  let $tasks = of({} as ITask);
  if (route.params.id) $tasks = taskService.get(route.params.id).pipe(map((result: IQueryResult<ITask>) => result.data[0]));

  const $categories = categoryService.getAll().pipe(map((result: IQueryResult<ICategory[]>) => result.data));

  switch (state.url) {
    default:
      return combineLatest([$tasks, $categories]).pipe(map(([task, categories]) => ({ task, categories })));
  }
};
