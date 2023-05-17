import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { ICategory } from '@scripts/models/category.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { CategoryService } from '@services/category.service';

@Injectable({ providedIn: 'root' })
export class TaskCategoryResolverGuard {
    constructor (private categoryService: CategoryService) { }

    resolve (): Observable<ICategory[][]> {
        return this.categoryService.findAllByUser()
            .pipe(map((result: IQueryResult<ICategory[]>) => result.data));
    }
}
