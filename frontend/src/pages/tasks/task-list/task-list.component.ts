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
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { IColumnsOptions } from '@app/scripts/models/columns-options.interface';
import { EStatus } from '@app/scripts/models/enum/status.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@root/src/scripts/services/shared.service';
import { TaskService } from '@root/src/scripts/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent extends Unsubscriber implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnOptions: IColumnsOptions = {
    lgColumns: ['date', 'title', 'description', 'status', 'category', 'actions'],
    mdColumns: ['date', 'title', 'description', 'status', 'actions'],
    smColumns: ['date', 'title', 'status', 'actions-mobile'],
    xsColumns: ['date', 'title', 'status', 'actions-mobile'],
  };

  displayedColumns: string[] = this.columnOptions.lgColumns;

  search = new FormControl();
  searchedTasks: ITask[] = [];
  isLoading = true;
  isSearching = false;

  tasksDataSource = new TableVirtualScrollDataSource<ITask>();
  tasks: ITask[] = [];
  status = EStatus;

  pageSize = 5;
  pageCount = 1;
  pageSizeOptions = [5, 15, 30];
  columnFilter = '';
  columnDirection = '';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private sharedService: SharedService,
    private router: Router,
    private titleService: Title,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateTitle();
    this.sharedService.setTableColumnsAndPagesize(this.displayedColumns, this.columnOptions, { pageSize: this.pageSize, pageSizeOptions: this.pageSizeOptions });
    this.removeSubscriptionsFromService = true;

    this.subs.sink = this.sharedService.tableColumnListener.subscribe((columnOptions: string[]) => (this.displayedColumns = columnOptions));
    this.subs.sink = this.sharedService.pageSizeListener.subscribe((options: { pageSize: number, pageSizeOptions: number[] }) => {
      this.paginator.pageSize = options.pageSize;
      this.paginator.pageSizeOptions = options.pageSizeOptions;
    });
    this.subs.sink = this.search.valueChanges.pipe(debounceTime(300)).subscribe(() => this.filterTasksAsync(this.search.value));

    this.refreshAsync();
    this.subs.sink = this.taskService.emitterTask.subscribe(() => this.refreshAsync());
  }

  add(): void {
    this.router.navigate(['tasks/add']);
  }

  edit(id: string): void {
    this.router.navigate(['tasks/edit', id]);
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll({ pageSize: this.pageSize })));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks, this.sort, this.paginator);
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  async changeStatusAsync(task: ITask, status: EStatus): Promise<void> {
    task.status = status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.save(task));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.status-change-error', error: true });

    this.sharedService.handleSnackbars({ translationKey: 'task-list.status-change' });
    this.taskService.emitterTask.emit();
    this.changeDetector.markForCheck();
  }

  async removeAsync(task: ITask): Promise<void> {
    const [, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.remove(task._id));
    if (error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.remove-error', error: true });

    this.sharedService.handleSnackbars({ translationKey: 'task-list.remove-success' });
    this.taskService.emitterTask.emit();
    this.changeDetector.markForCheck();
  }

  async onPaginateChangeAsync(event: PageEvent): Promise<void> {
    this.isLoading = true;
    const pageIndex = event.pageIndex;
    const searchTerm = this.search.value ?? null;
    this.pageSize = event.pageSize;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll({ pageSize: this.pageSize, searchTerm, pageIndex, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  async sortDataAsync(event: Sort): Promise<void> {
    this.isLoading = true;
    const searchTerm = this.search.value ?? null;
    this.columnFilter = event.active;
    this.columnDirection = event.direction;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll({ pageSize: this.pageSize, searchTerm, pageIndex: 0, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
    if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.paginator.pageIndex = 0;
    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  async filterTasksAsync(text: string): Promise<void> {
    if (text === '') {
      this.search.setValue('');
      this.isSearching = false;
      this.refreshAsync();
    } else if (text.length > 2) {
      this.isLoading = true;
      const searchTerm = text.trim().toLowerCase();

      const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll({ pageSize: this.pageSize, searchTerm, pageIndex: 0, sortFilter: this.columnFilter, sortDirection: this.columnDirection })));
      if (!result || !result.success || error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

      this.paginator.pageIndex = 0;
      this.tasks = result.data;
      this.pageCount = result.totalCount;
      this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
      this.isLoading = false;
      this.changeDetector.markForCheck();
    }
  }

  updateTitle(): void {
    this.titleService.setTitle(`${this.translate.instant('title.tasks')} — Mean Stack Template`);
    this.sharedService.emitterTitle.pipe(take(1)).subscribe(() => this.updateTitle());
  }

  async confirmDelete(task: ITask): Promise<void> {
    const res = await this.sharedService.handleDialogs(
      {
        component: ConfirmationDialogComponent,
        options: {
          title: 'task-form.confirmation-title',
          message: 'task-form.confirmation-message',
          action: 'task-form.confirmation-discard',
        },
      })

    if (res)
      this.removeAsync(task);;
  }
}
