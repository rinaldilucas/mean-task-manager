import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  isLoading = true;

  tasks: ITask[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.updateTitle();
    this.refreshAsync();
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handleObservables(this.taskService.getAll());
    if (!result || !result.success || error)
      return this.sharedService.handleSnackbars({
        translationKey: 'task-list.refresh-error',
        error: true,
      });

    this.tasks = result.data;
    this.isLoading = this.sharedService.handleLoading({ isLoading: false, changeDetector: this.changeDetector });
  }

  updateTitle(): void {
    this.sharedService.handleTitle(this.translate.instant('title.statistics'));
    this.sharedService.onTitleChange
      .pipe(take(1))
      .subscribe(() => this.sharedService.handleTitle(this.translate.instant('title.statistics')));
  }
}
