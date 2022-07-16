import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { ITask } from '@app/scripts/models/task.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { TaskService } from '@app/scripts/services/task.service';
import { SharedService } from '@app/scripts/services/shared.service';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

    columnOptions = {
        lgColumns: ['date', 'title', 'description', 'status', 'category', 'actions'],
        mdColumns: ['date', 'title', 'description', 'status', 'actions'],
        smColumns: ['date', 'title', 'status', 'actions-mobile'],
        xsColumns: ['date', 'title', 'status', 'actions-mobile'],
    };

    displayedColumns: string[] = this.columnOptions.lgColumns;

    title = 'Tasks';
    search = '';
    searchedTasks: ITask[] = [];
    isLoading = true;
    isSearching = false;

    tasksDataSource = new TableVirtualScrollDataSource<ITask>();
    tasks: ITask[] = [];
    status = EStatus;

    pageSize = 5;
    pageCount = 1;
    pageSizeOptions = [5, 10, 20];

    constructor(
        private changeDetector: ChangeDetectorRef, //
        private taskService: TaskService,
        private sharedService: SharedService,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.translateService.get('title.tasks').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.sharedService.setTableColumns(this.displayedColumns, this.columnOptions);
        this.sharedService.tableColumnListener.subscribe((columnOptions: any) => (this.displayedColumns = columnOptions));
        this.refreshAsync();
        this.taskService.emitTask.subscribe(() => this.refreshAsync());
    }

    async refreshAsync(): Promise<void> {
        const [result, error] = await this.sharedService.handlePromises(this.taskService.listTasksByUser(this.pageSize));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-list.refresh-error', false);

        this.tasks = result.data;
        this.pageCount = result.count;
        this.tasksDataSource = this.sharedService.setDataSource(this.tasks, this.sort, this.paginator);
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    add(): void {
        this.router.navigate(['tasks/add']);
    }

    edit(id: string): void {
        this.router.navigate(['tasks/edit', id]);
    }

    async changeStatusAsync(task: ITask, status: EStatus): Promise<void> {
        task.status = status;

        const [result, error] = await this.sharedService.handlePromises(this.taskService.updateTask(task));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-list.status-change-error', false);

        this.sharedService.handleSnackbarMessages('task-list.status-change');
        this.taskService.emitTask.emit();
        this.changeDetector.markForCheck();
    }

    async removeAsync(task: ITask): Promise<void> {
        const [result, error] = await this.sharedService.handlePromises(this.taskService.removeTask(task._id));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-list.remove-error', false);

        this.sharedService.handleSnackbarMessages('task-list.remove-success');
        this.taskService.emitTask.emit();
        this.changeDetector.markForCheck();
    }

    async onPaginateChangeAsync(event: PageEvent): Promise<void> {
        this.isLoading = true;
        const pageIndex = event.pageIndex;
        const searchTerm = this.searchInput.nativeElement.value ?? null;
        this.pageSize = event.pageSize;

        const [result, error] = await this.sharedService.handlePromises(this.taskService.listTasksByUser(this.pageSize, searchTerm, pageIndex));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-list.refresh-error', false);

        this.tasks = result.data;
        this.pageCount = result.count;
        this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
        this.isLoading = false;
        this.changeDetector.markForCheck();
    }

    async filterTasksAsync(text: string): Promise<void> {
        if (text === '') {
            this.searchInput.nativeElement.value = '';
            this.isSearching = false;
            this.refreshAsync();
        } else {
            this.isLoading = true;
            const searchTerm = text.trim().toLowerCase();

            const [result, error] = await this.sharedService.handlePromises(this.taskService.listTasksByUser(this.pageSize, searchTerm, 0));
            if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages('task-list.refresh-error', false);

            this.paginator.pageIndex = 0;
            this.tasks = result.data;
            this.pageCount = result.count;
            this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
            this.isLoading = false;
            this.changeDetector.markForCheck();
        }
    }
}
