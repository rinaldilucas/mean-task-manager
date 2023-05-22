import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { debounceTime, lastValueFrom, take } from 'rxjs';

import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog';
import { Unsubscriber } from '@app/components/shared/unsubscriber.component';
import { IColumnsOptions } from '@scripts/models/columnsOptions.interface';
import { EStatus } from '@scripts/models/enum/status.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { SharedService } from '@services/shared.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent extends Unsubscriber implements OnInit {
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    columnOptions: IColumnsOptions = {
        lgColumns: ['date', 'title', 'description', 'status', 'category', 'actions'],
        mdColumns: ['date', 'title', 'description', 'status', 'actions'],
        smColumns: ['date', 'title', 'status', 'actions-mobile'],
        xsColumns: ['date', 'title', 'status', 'actions-mobile']
    };

    displayedColumns: string[] = this.columnOptions.lgColumns;

    title = 'Tasks';
    search = new FormControl();
    searchedTasks: ITask[] = [];
    isLoading = true;
    isSearching = false;

    tasksDataSource = new TableVirtualScrollDataSource<ITask>();
    tasks: ITask[] = [];
    status = EStatus;

    pageSize = 10;
    pageCount = 1;
    pageSizeOptions = [10, 20, 30];
    columnFilter = '';
    columnDirection = '';

    constructor (
        private changeDetector: ChangeDetectorRef,
        private taskService: TaskService,
        private sharedService: SharedService,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService,
        private dialog: MatDialog
    ) {
        super();
    }

    ngOnInit (): void {
        this.updateTitle();
        this.sharedService.setTableColumnsAndPagesize(this.displayedColumns, this.columnOptions, { pageSize: this.pageSize, pageSizeOptions: this.pageSizeOptions });
        this.disposeServicesOnDestroy = true;

        this.addSubscription(this.sharedService.tableColumnListener.subscribe((columnOptions: string[]) => (this.displayedColumns = columnOptions)));
        this.addSubscription(this.sharedService.pageSizeListener.subscribe((options: { pageSize: number, pageSizeOptions: number[]}) => {
            this.paginator.pageSize = options.pageSize;
            this.paginator.pageSizeOptions = options.pageSizeOptions;
        }));
        this.addSubscription(this.search.valueChanges.pipe(debounceTime(300)).subscribe(() => this.filterTasksAsync(this.search.value)));

        this.refreshAsync();
        this.addSubscription(this.taskService.taskEmitter.subscribe(() => this.refreshAsync()));
    }

    add (): void {
        this.router.navigate(['tasks/add']);
    }

    edit (id: string): void {
        this.router.navigate(['tasks/edit', id]);
    }

    async refreshAsync (): Promise<void> {
        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAllByUser({ pageSize: this.pageSize })));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

        this.tasks = result.data;
        this.pageCount = result.totalCount;
        this.tasksDataSource = this.sharedService.setDataSource(this.tasks, this.sort, this.paginator);
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    async changeStatusAsync (task: ITask, status: EStatus): Promise<void> {
        task.status = status;

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.save(task));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.status-change-error', success: false });

        this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.status-change', success: true });
        this.taskService.taskEmitter.emit();
        this.changeDetector.markForCheck();
    }

    async removeAsync (task: ITask): Promise<void> {
        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.remove(task._id));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.remove-error', success: false });

        this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.remove-success', success: true });
        this.taskService.taskEmitter.emit();
        this.changeDetector.markForCheck();
    }

    async onPaginateChangeAsync (event: PageEvent): Promise<void> {
        this.isLoading = true;
        const pageIndex = event.pageIndex;
        const searchTerm = this.search.value ?? null;
        this.pageSize = event.pageSize;

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAllByUser({ pageSize: this.pageSize, searchTerm, pageIndex, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

        this.tasks = result.data;
        this.pageCount = result.totalCount;
        this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    async sortDataAsync (event: Sort): Promise<void> {
        this.isLoading = true;
        const searchTerm = this.search.value ?? null;
        this.columnFilter = event.active;
        this.columnDirection = event.direction;

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAllByUser({ pageSize: this.pageSize, searchTerm, pageIndex: 0, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

        this.paginator.pageIndex = 0;
        this.tasks = result.data;
        this.pageCount = result.totalCount;
        this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    async filterTasksAsync (text: string): Promise<void> {
        if (text === '') {
            this.search.setValue('');
            this.isSearching = false;
            this.refreshAsync();
        } else if (text.length > 2) {
            this.isLoading = true;
            const searchTerm = text.trim().toLowerCase();

            const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAllByUser({ pageSize: this.pageSize, searchTerm, pageIndex: 0, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
            if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

            this.paginator.pageIndex = 0;
            this.tasks = result.data;
            this.pageCount = result.totalCount;
            this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
            this.isLoading = false;
            this.changeDetector.markForCheck();
        }
    }

    updateTitle (): void {
        this.translateService.get('title.tasks').pipe(take(1)).subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.sharedService.titleEmitter.pipe(take(1)).subscribe(() => this.updateTitle());
    }

    confirmDelete (task: ITask): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { title: 'task-list.confirmation-title', message: 'task-list.confirmation-message', action: 'task-list.confirmation-delete' }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe((result: boolean) => {
            if (result) { this.removeAsync(task); }
        });
    }
}
