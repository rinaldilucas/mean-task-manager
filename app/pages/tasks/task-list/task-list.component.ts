import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { ITask } from '@app/scripts/models/task.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { TaskService } from '@app/scripts/services/task.service';
import { UtilService } from '@app/scripts/services/util.service';
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

    lgColumns = ['date', 'title', 'description', 'status', 'category', 'actions'];
    mdColumns = ['date', 'title', 'description', 'status', 'actions'];
    smColumns = ['date', 'title', 'status', 'actions-mobile'];
    xsColumns = ['date', 'title', 'status', 'actions-mobile'];
    displayedColumns: string[] = this.lgColumns;

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
        private changeDetector: ChangeDetectorRef,
        private taskService: TaskService,
        private utilService: UtilService,
        private router: Router,
        private snackBar: MatSnackBar,
        private media: MediaObserver,
        private titleService: Title,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.translateService.get('title.tasks').subscribe((text: string) => this.titleService.setTitle(`${text} — Mean Stack Template`));
        this.verifyResolution();
        this.refresh();
        this.taskService.emitTask.subscribe(() => this.refresh());
    }

    refresh(): void {
        this.taskService.listTasksByUser(this.pageSize).subscribe((result: IQueryResult<ITask>) => {
            this.tasks = result.data;
            this.pageCount = result.count;
            this.tasksDataSource = this.utilService.setDataSource(this.tasks, this.sort, this.paginator);
            this.isLoading = false;
            this.changeDetector.markForCheck();
        });
    }

    verifyResolution(): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'xs') this.displayedColumns = this.xsColumns;
            else if (change[0].mqAlias === 'sm') this.displayedColumns = this.smColumns;
            else if (change[0].mqAlias === 'md') this.displayedColumns = this.mdColumns;
            else this.displayedColumns = this.lgColumns;
            this.changeDetector.detectChanges();
        });
    }

    add(): void {
        this.router.navigate([`${this.router.url.split(/\/(add|edit)\/?/gi)[0]}/add`]);
    }

    edit(id: string): void {
        this.router.navigate([`${this.router.url.split(/\/(add|edit)\/?/gi)[0]}/edit`, id]);
    }

    changeStatus(task: ITask, status: EStatus): void {
        task.status = status;

        this.taskService.updateTask(task).subscribe({
            next: () => {
                this.snackBar.open('Task status changed.', undefined, { duration: 5000 });
                this.taskService.emitTask.emit();
                this.changeDetector.markForCheck();
            },
            error: () => this.snackBar.open('Error changing task status.', undefined, { duration: 8000 }),
        });
    }

    delete(task: ITask): void {
        this.taskService.deleteTask(task._id).subscribe({
            next: () => {
                this.snackBar.open('Task removed.', undefined, { duration: 5000 });
                this.taskService.emitTask.emit();
                this.changeDetector.markForCheck();
            },
            error: () => this.snackBar.open('Error removing task.', undefined, { duration: 8000 }),
        });
    }

    filterTasks(text: string) {
        if (text === '') {
            this.searchInput.nativeElement.value = '';
            this.isSearching = false;
            this.refresh();
        } else {
            const searchTerm = text.trim().toLowerCase();

            this.taskService.listTasksByUser(this.pageSize, searchTerm).subscribe((result: IQueryResult<ITask>) => {
                this.tasks = result.data;
                this.pageCount = result.count;
                this.tasksDataSource = this.utilService.setDataSource(this.tasks);
                this.isLoading = false;
                this.changeDetector.markForCheck();
            });
        }
    }

    onPaginateChange(event: PageEvent): any {
        const pageIndex = event.pageIndex;
        const searchTerm = this.searchInput.nativeElement.value ?? null;
        this.pageSize = event.pageSize;

        this.taskService.listTasksByUser(this.pageSize, searchTerm, pageIndex).subscribe((result: IQueryResult<ITask>) => {
            this.tasks = result.data;
            this.pageCount = result.count;
            this.tasksDataSource = this.utilService.setDataSource(this.tasks);
            this.isLoading = false;
            this.changeDetector.markForCheck();
        });
    }
}
