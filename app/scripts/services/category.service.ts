import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@app/environments/environment';
import { ICategory } from '@app/scripts/models/category.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { UtilService } from '@app/scripts/services/util.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    emitCategory: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    private url: string = environment.baseUri + '/categories';

    constructor(private http: HttpClient, private utilService: UtilService, private translateService: TranslateService) {}

    listCategories(): Observable<IQueryResult<ICategory>> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    getCategory(id: string): Observable<IQueryResult<ICategory>> {
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;

        return this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.utilService.errorHandler));
    }

    createCategory(category: ICategory): Observable<IQueryResult<ICategory>> {
        const url = `${this.url}?language=${this.translateService.currentLang}`;

        return this.http.post<IQueryResult<ICategory>>(url, category).pipe(catchError(this.utilService.errorHandler));
    }

    deleteCategory(category: ICategory | string): Observable<IQueryResult<ICategory>> {
        const id = typeof category === 'string' ? category : category._id;
        const url = `${this.url}/${id}?language=${this.translateService.currentLang}`;

        return this.http.delete<IQueryResult<ICategory>>(url).pipe(catchError(this.utilService.errorHandler));
    }
}
