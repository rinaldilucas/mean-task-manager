import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { TaskService } from '@app/scripts/services/task.service';

@Injectable({ providedIn: 'root' })
export class TaskIdResolverGuard {
  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<ITask> {
    if (route.params && route.params.id) {
      return this.taskService.get(route.params.id)
        .pipe(map((result: IQueryResult<ITask>) => result.data[0]));
    } else {
      return of({} as ITask);
    }
  }
}
