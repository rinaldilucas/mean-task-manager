import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { take } from 'rxjs';

import { ConfirmationDialogComponent } from '@app/components/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { IColumnsOptions } from '@app/scripts/models/columns-options.interface';
import { EStatus } from '@app/scripts/models/enums/status.enum';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent extends Unsubscriber implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = true;
  isSearching = false;

  search = new FormControl();
  searchedTasks: ITask[] = [];
  tasksDataSource = new TableVirtualScrollDataSource<ITask>();
  tasks: ITask[] = [];
  status = EStatus;

  pageSize = 5;
  pageCount = 1;
  pageSizeOptions = [5, 15, 30];
  columnFilter = '';
  columnDirection = '';
  columnOptions: IColumnsOptions = {
    lgColumns: ['date', 'title', 'description', 'status', 'category', 'actions'],
    mdColumns: ['date', 'title', 'description', 'status', 'actions'],
    smColumns: ['date', 'title', 'status', 'actions-mobile'],
    xsColumns: ['date', 'title', 'status', 'actions-mobile'],
  };
  displayedColumns: string[] = this.columnOptions.lgColumns;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private sharedService: SharedService,
    private router: Router,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateTitle();
    this.sharedService.setTableColumnsAndPagesize(this.displayedColumns, this.columnOptions, {
      pageSize: this.pageSize,
      pageSizeOptions: this.pageSizeOptions,
    });
    this.removeSubscriptionsFromService = true;

    this.subs.sink = this.taskService.onTaskChange.subscribe(() => this.refreshAsync());
    this.subs.sink = this.sharedService.onTableColumnChange.subscribe(
      (columnOptions: string[]) => (this.displayedColumns = columnOptions),
    );
    this.subs.sink = this.sharedService.onPageSizeChange.subscribe((options: { pageSize: number; pageSizeOptions: number[] }) => {
      if (this.paginator) {
        this.paginator.pageSize = options.pageSize;
        this.paginator.pageSizeOptions = options.pageSizeOptions;
      }
    });

    this.refreshAsync();
  }

  add(): void {
    this.router.navigate(['tasks/new']);
  }

  edit(id: string): void {
    this.router.navigate(['tasks/edit', id]);
  }

  async refreshAsync(): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(
      this.taskService.getAll({ pageSize: this.pageSize }),
    );
    if (!result || !result.success || error)
      return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks, this.sort, this.paginator);

    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  async changeStatusAsync(task: ITask, status: EStatus): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector, detectChanges: true });

    task.status = status;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(this.taskService.save(task));
    if (!result || !result.success || error)
      return this.sharedService.handleSnackbars({ translationKey: 'task-list.status-change-error', error: true });

    this.sharedService.handleSnackbars({ translationKey: 'task-list.status-change' });
    this.taskService.onTaskChange.emit();
  }

  async removeAsync(task: ITask): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    const [, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(this.taskService.remove(task._id));
    if (error) return this.sharedService.handleSnackbars({ translationKey: 'task-list.remove-error', error: true });

    this.sharedService.handleSnackbars({ translationKey: 'task-list.remove-success' });
    this.taskService.onTaskChange.emit();
  }

  async onPaginateChangeAsync(event: PageEvent): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    const pageIndex = event.pageIndex;
    const searchTerm = this.search.value ?? null;
    this.pageSize = event.pageSize;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(
      this.taskService.getAll({
        pageSize: this.pageSize,
        searchTerm,
        pageIndex,
        sortFilter: this.columnFilter,
        sortDirection: this.columnDirection,
      }),
    );
    if (!result || !result.success || error)
      return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  async sortDataAsync(event: Sort): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });
    const searchTerm = this.search.value ?? null;
    this.columnFilter = event.active;
    this.columnDirection = event.direction;

    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(
      this.taskService.getAll({
        pageSize: this.pageSize,
        searchTerm,
        pageIndex: 0,
        sortFilter: this.columnFilter,
        sortDirection: this.columnDirection,
      }),
    );

    if (!result || !result.success || error)
      return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

    this.paginator.pageIndex = 0;
    this.tasks = result.data;
    this.pageCount = result.totalCount;
    this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  async filterTasksAsync(text?: string): Promise<void> {
    this.isLoading = this.sharedService.handleLoading({ isLoading: true, changeDetector: this.changeDetector });

    if (!text) {
      this.isSearching = false;
      this.refreshAsync();
    } else {
      this.isSearching = true;
      const searchTerm = text.trim().toLowerCase();

      const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(
        this.taskService.getAll({
          pageSize: this.pageSize,
          searchTerm,
          pageIndex: 0,
          sortFilter: this.columnFilter,
          sortDirection: this.columnDirection,
        }),
      );

      if (!result || !result.success || error)
        return this.sharedService.handleSnackbars({ translationKey: 'task-list.refresh-error', error: true });

      this.tasks = result.data;
      this.pageCount = result.totalCount;
      this.tasksDataSource = this.sharedService.setDataSource(this.tasks);
      this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });

      if (this.paginator) this.paginator.pageIndex = 0;
    }
    this.search.setValue('');
  }

  updateTitle(): void {
    this.sharedService.handleTitle(this.translate.instant('title.tasks'));
    this.sharedService.onTitleChange
      .pipe(take(1))
      .subscribe(() => this.sharedService.handleTitle(this.translate.instant('title.tasks')));
  }

  async confirmDelete(task: ITask): Promise<void> {
    const dialogRef = await this.sharedService.handleDialogs({
      component: ConfirmationDialogComponent,
      options: {
        title: 'task-list.confirmation-title',
        message: 'task-list.confirmation-message',
        action: 'task-list.confirmation-action',
      },
      disableClose: true,
    });

    if (dialogRef) this.removeAsync(task);
  }
}
