import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { TranslateService } from '@ngx-translate/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Observable, Subscription, lastValueFrom, take, throwError } from 'rxjs';

import { IColumnsOptions } from '@app/scripts/models/columns-options.interface';
import { ITask } from '@app/scripts/models/task.interface';

@Injectable({ providedIn: 'root' })
export class SharedService {
  emitterTitle: EventEmitter<string> = new EventEmitter<string>();
  tableColumnListener: EventEmitter<string[]> = new EventEmitter<string[]>();
  pageSizeListener: EventEmitter<{ pageSize: number, pageSizeOptions: number[] }> = new EventEmitter<{ pageSize: number, pageSizeOptions: number[] }>();
  static subscriptions: Subscription[] = [];

  constructor(
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private media: MediaObserver,
    private dialog: MatDialog,
  ) { }

  setDataSource(list: ITask[], sort?: MatSort, paginator?: MatPaginator): TableVirtualScrollDataSource<ITask> {
    const dataSource = new TableVirtualScrollDataSource(list);
    if (sort)
      dataSource.sort = sort;
    if (paginator)
      dataSource.paginator = paginator;

    return dataSource;
  }

  errorHandler(result: HttpErrorResponse): Observable<never> {
    const errorResponse = {
      success: result.error.success,
      status: result.status,
      message: '',
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

  isValidForm(form: FormGroup<string>): boolean {
    if (!form.valid) {
      this.translateService.get('messages.mandatory-fields').pipe(take(1)).subscribe((text: string) => this.snackBar.open(text, undefined, { duration: 8000 }));
      this.highlightRequiredInput(form);
      return false;
    }
    return true;
  }

  highlightRequiredInput(form: FormGroup<string>): void {
    form.markAllAsTouched();
    for (const input of Object.keys(form.controls)) {
      if (!form.get(input)?.valid) {
        const invalidControl = document.querySelector(`[formcontrolname="${input}"]`);
        (invalidControl as HTMLInputElement).focus();
        break;
      }
    }
  }

  setTableColumnsAndPagesize(columnOptions: string[], columns: IColumnsOptions, { pageSize = 5, pageSizeOptions = [10, 20, 30] }): void {
    SharedService.subscriptions.push(this.media.asObservable().subscribe((change: MediaChange[]) => {
      pageSize = 20;
      pageSizeOptions = [20];

      if (change[0].mqAlias === 'xs') {
        columnOptions = columns.xsColumns;
      } else if (change[0].mqAlias === 'sm') {
        columnOptions = columns.smColumns;
      } else if (change[0].mqAlias === 'md') {
        columnOptions = columns.mdColumns;
        pageSize = 5;
        pageSizeOptions = [5, 15, 30];
      } else {
        columnOptions = columns.lgColumns;
        pageSize = 5;
        pageSizeOptions = [5, 15, 30];
      }

      this.tableColumnListener.emit(columnOptions);
      this.pageSizeListener.emit({ pageSize, pageSizeOptions });
    }));
  }

  static removeSubscriptions(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleSnackbars({ translationKey, error = false, customDuration, queuedMessage: queuedTranslationKey }: { translationKey: string, error?: boolean, customDuration?: number, queuedMessage?: string }): void {
    this.translateService.get(translationKey).pipe(take(1)).subscribe((text: string) => {
      const duration = customDuration ? customDuration : error ? 8000 : 5000;
      this.snackBar.open(text, undefined, { duration }).afterDismissed().subscribe(() => {
        if (queuedTranslationKey)
          this.handleSnackbars({ translationKey: queuedTranslationKey, customDuration: duration });
      });
    });
  }

  async handleDialogs({ component, options, width, minWidth, height, minHeight, disableClose }: { component: any; options?: any; minWidth?: string; width?: string; minHeight?: string; height?: string; disableClose?: boolean }): Promise<any> {
    const dialogRef = this.dialog.open(component, {
      width: width || '500px',
      minWidth: minWidth || undefined,
      height: height || 'auto',
      minHeight: minHeight || undefined,
      disableClose: disableClose || false,
      data: options || null,
    });

    return await lastValueFrom(dialogRef.afterClosed()).then(res => {
      if (!res) return false;

      return res;
    })
  }

  async handlePromises(promise: Promise<any>): Promise<Promise<any>> {
    try {
      const data = await promise;
      return [data, null];
    } catch (error) {
      return [null, error];
    }
  }
}
