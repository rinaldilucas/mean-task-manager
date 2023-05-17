import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Observable, Subscription, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { IColumnsOptions } from '@scripts/models/columnsOptions.interface';
import { ITask } from '@scripts/models/task.interface';

@Injectable({ providedIn: 'root' })
export class SharedService {
    emitTitle: EventEmitter<string> = new EventEmitter<string>();
    tableColumnListener: EventEmitter<string[]> = new EventEmitter<string[]>();
    pageSizeListener: EventEmitter<{pageSize: number, pageSizeOptions: number[]}> = new EventEmitter<{pageSize: number, pageSizeOptions: number[]}>();
    subscriptions: Subscription[] = [];

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

    isValidForm (form: FormGroup<string>): boolean {
        if (!form.valid) {
            this.translateService.get('messages.mandatory-fields').pipe(take(1)).subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            this.highlightRequiredInput(form);
            return false;
        }
        return true;
    }

    highlightRequiredInput (form: FormGroup<string>): void {
        form.markAllAsTouched();
        for (const input of Object.keys(form.controls)) {
            if (!form.get(input)?.valid) {
                const invalidControl = document.querySelector(`[formcontrolname="${input}"]`);
                (invalidControl as HTMLInputElement).focus();
                break;
            }
        }
    }

    setTableColumnsAndPagesize (columnOptions: string[], columns: IColumnsOptions, { pageSize = 5, pageSizeOptions = [10, 20, 30] }): void {
        this.subscriptions.push(this.media.asObservable().subscribe((change: MediaChange[]) => {
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
        }));
    }

    handleSnackbarMessages ({ translationKey, success = true }): void {
        this.translateService.get(translationKey).pipe(take(1)).subscribe((text: string) => this.snackBar.open(text, undefined, { duration: success ? 5000 : 8000 }));
    }

    async handlePromises (promise: Promise<any>): Promise<Promise<any>> {
        try {
            const data = await promise;
            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }

    dispose (): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
