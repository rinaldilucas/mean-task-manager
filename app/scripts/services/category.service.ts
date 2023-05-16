import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@app/environments/environment';
import { ICategory } from '@scripts/models/category.interface';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { SharedService } from '@services/shared.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private readonly url = environment.baseUri + '/categories';

    constructor (private http: HttpClient, private sharedService: SharedService, private authService: AuthService) {}

    findAllByUser (): Promise<IQueryResult<ICategory[]>> {
        const userId = this.authService.getUserId();
        const url = `${this.url}/user/${userId}?`;

        return lastValueFrom(this.http.get<IQueryResult<ICategory[]>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    getCategory (id: string): Promise<IQueryResult<ICategory>> {
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.get<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }

    createCategory (category: ICategory): Promise<IQueryResult<ICategory>> {
        const url = `${this.url}`;
        category.userId = this.authService.getUserId();

        return lastValueFrom(this.http.post<IQueryResult<ICategory>>(url, category).pipe(catchError(this.sharedService.errorHandler)));
    }

    removeCategory (category: ICategory | string): Promise<IQueryResult<ICategory>> {
        const id = typeof category === 'string' ? category : category._id;
        const url = `${this.url}/${id}`;

        return lastValueFrom(this.http.delete<IQueryResult<ICategory>>(url).pipe(catchError(this.sharedService.errorHandler)));
    }
}
