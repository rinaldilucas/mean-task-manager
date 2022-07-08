import { Injectable } from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ITask } from '@app/scripts/models/task.interface';

@Injectable()
export class UtilService {
    setDataSource(list: ITask[], sort: MatSort, paginator: MatPaginator): TableVirtualScrollDataSource<ITask> {
        const dataSource = new TableVirtualScrollDataSource(list);
        dataSource.sort = sort;
        dataSource.paginator = paginator;

        return dataSource;
    }

    errorHandler(result: HttpErrorResponse): Observable<never> {
        let errorObject;

        errorObject = {
            success: result.error.success,
            status: result.status,
            message: '',
        };

        if (!!result?.error?.message) {
            errorObject.message = result.error.message;
            console.log(`[${result.status}] - Message: ${result.error.message}`);
        } else if (!!result?.error) {
            console.log(`[${result.status}] - Message: ${result.error}`);
        } else {
            console.log(`[${result.status}] - Message: ${result.message}`);
        }

        return throwError(errorObject);
    }
}
