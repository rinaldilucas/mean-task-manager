import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { SharedService } from '@app/scripts/services/shared.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    emitCategory: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    private url: string = environment.baseUri + '/categories';

    constructor(private http: HttpClient, private sharedService: SharedService) {}

    listCategories(): Promise<IQueryResult<ICategory> | undefined> {
        const url = `${this.url}`;

        return this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    getCategory(id: string): Promise<IQueryResult<ICategory> | undefined> {
        const url = `${this.url}/${id}`;

        return this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    createCategory(category: ICategory): Promise<IQueryResult<ICategory> | undefined> {
        const url = `${this.url}`;

        return this.http.post<IQueryResult<ICategory>>(url, category).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }

    removeCategory(category: ICategory | string): Promise<IQueryResult<ICategory> | undefined> {
        const id = typeof category === 'string' ? category : category._id;
        const url = `${this.url}/${id}`;

        return this.http.delete<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)).toPromise();
    }
}
