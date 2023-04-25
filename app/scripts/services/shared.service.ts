import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Observable, throwError } from 'rxjs';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ITask } from '@app/scripts/models/task.interface';

@Injectable({ providedIn: 'root' })
export class SharedService {
    emitTitle: EventEmitter<any> = new EventEmitter<any>();
    inputErrorListener: EventEmitter<boolean> = new EventEmitter<boolean>();
    tableColumnListener: EventEmitter<boolean> = new EventEmitter<boolean>();
    pageSizeListener: EventEmitter<{pageSize: number, pageSizeOptions: number[]}> = new EventEmitter<{pageSize: number, pageSizeOptions: number[]}>();

    constructor (private translateService: TranslateService, private snackBar: MatSnackBar, private media: MediaObserver) {}

    setDataSource (list: ITask[], sort?: MatSort, paginator?: MatPaginator): TableVirtualScrollDataSource<ITask> {
        const dataSource = new TableVirtualScrollDataSource(list);
        if (sort) dataSource.sort = sort;
        if (paginator) dataSource.paginator = paginator;

        return dataSource;
    }

    errorHandler (result: HttpErrorResponse): Observable<never> {
        const errorResponse = {
            success: result.error.success,
            status: result.status,
            message: ''
        };

        if (result?.error?.message) {
            errorResponse.message = result.error.message;
            console.log(`[${result.status}] - Message: ${result.error.message}`);
        } else if (result?.error?.validationErrors?.length > 0) {
            console.log(`[${result.status}] - Message: Validation Error.`);
            console.table(result.error.validationErrors);
        } else if (result?.error) {
            console.log(`[${result.status}] - Message: ${result.error}`);
        } else {
            console.log(`[${result.status}] - Message: ${result.message}`);
        }

        return throwError(() => errorResponse);
    }

    isValidForm (form: FormGroup<any>): boolean {
        if (!form.valid) {
            this.translateService.get('messages.mandatory-fields').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            this.highlightRequiredInput(form);
            return false;
        }
        return true;
    }

    highlightRequiredInput (form: FormGroup<any>): void {
        form.markAllAsTouched();
        for (const input of Object.keys(form.controls)) {
            if (!form.get(input)?.valid) {
                const invalidControl = document.querySelector(`[formcontrolname="${input}"]`);
                (invalidControl as HTMLInputElement).focus();
                break;
            }
        }
        this.inputErrorListener.emit(true);
    }

    setTableColumnsAndPagesize (columnOptions: any, columns: any, { pageSize = 5, pageSizeOptions = [10, 20, 30] }): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'xs') {
                columnOptions = columns.xsColumns;
                pageSize = 20;
                pageSizeOptions = [20];
            } else if (change[0].mqAlias === 'sm') {
                columnOptions = columns.smColumns;
                pageSize = 20;
                pageSizeOptions = [20];
            } else if (change[0].mqAlias === 'md') {
                columnOptions = columns.mdColumns;
                pageSize = 10;
                pageSizeOptions = [10, 20, 30];
            } else {
                columnOptions = columns.lgColumns;
                pageSize = 10;
                pageSizeOptions = [10, 20, 30];
            }

            this.tableColumnListener.emit(columnOptions);
            this.pageSizeListener.emit({ pageSize, pageSizeOptions });
        });
    }

    handleSnackbarMessages (translationKey: string, success = true): void {
        this.translateService.get(translationKey).subscribe((text: string) => this.snackBar.open(text, undefined, { duration: success ? 5000 : 8000 }));
    }

    async handlePromises (promise: Promise<any>): Promise<any> {
        try {
            const data = await promise;
            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
}
