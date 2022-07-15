import { EventEmitter, Injectable } from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

import { ITask } from '@app/scripts/models/task.interface';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Injectable({ providedIn: 'root' })
export class SharedService {
    inputErrorListener: EventEmitter<boolean> = new EventEmitter<boolean>();
    tableColumnListener: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private translateService: TranslateService, private snackBar: MatSnackBar, private media: MediaObserver) {}

    setDataSource(list: ITask[], sort?: MatSort, paginator?: MatPaginator): TableVirtualScrollDataSource<ITask> {
        const dataSource = new TableVirtualScrollDataSource(list);
        if (sort) dataSource.sort = sort;
        if (paginator) dataSource.paginator = paginator;

        return dataSource;
    }

    errorHandler(result: HttpErrorResponse): Observable<never> {
        let errorResponse: any;

        errorResponse = {
            success: result.error.success,
            status: result.status,
            message: '',
        };

        if (!!result?.error?.message) {
            errorResponse.message = result.error.message;
            console.log(`[${result.status}] - Message: ${result.error.message}`);
        } else if (result?.error?.validationErrors?.length > 0) {
            console.log(`[${result.status}] - Message: Validation Error.`);
            console.table(result.error.validationErrors);
        } else if (!!result?.error) {
            console.log(`[${result.status}] - Message: ${result.error}`);
        } else {
            console.log(`[${result.status}] - Message: ${result.message}`);
        }

        return throwError(() => errorResponse);
    }

    isValidForm(form: FormGroup<any>): boolean {
        if (!form.valid) {
            this.translateService.get('messages.mandatory-fields').subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
            this.highlightRequiredInput(form);
            return false;
        }
        return true;
    }

    highlightRequiredInput(form: FormGroup<any>): void {
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

    setTableColumns(columnOptions: any, columns: any): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'xs') columnOptions = columns.xsColumns;
            else if (change[0].mqAlias === 'sm') columnOptions = columns.smColumns;
            else if (change[0].mqAlias === 'md') columnOptions = columns.mdColumns;
            else columnOptions = columns.lgColumns;

            this.tableColumnListener.emit(columnOptions);
        });
    }

    handleSnackbarMessages(translationKey: string, success = true): void {
        this.translateService.get(translationKey).subscribe((text: string) => this.snackBar.open(text, undefined, { duration: success ? 5000 : 8000 }));
    }

    async handlePromises(promise: Promise<any>): Promise<any> {
        try {
            const data = await promise;
            return [data, null];
        } catch (error) {
            return [null, error];
        }
    }
}
