import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    emitCategory: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    private url: string = environment.baseUri + '/categories';

    constructor (private http: HttpClient, private sharedService: SharedService) {}

    listCategories (): Promise<IQueryResult<ICategory[]>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.get<IQueryResult<ICategory[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getCategory (id: string): Promise<IQueryResult<ICategory>> {
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    createCategory (category: ICategory): Promise<IQueryResult<ICategory>> {
        const url = `${this.url}`;

        return lastValueFrom(this.http.post<IQueryResult<ICategory>>(url, category).pipe(catchError(this.sharedService.errorHandler)));
    }

    removeCategory (category: ICategory | string): Promise<IQueryResult<ICategory>> {
        const id = typeof category === 'string' ? category : category._id;
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }
}
