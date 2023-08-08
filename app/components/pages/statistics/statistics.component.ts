import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, take } from 'rxjs';

import { IQueryResult } from '@app/scripts/models/queryResult.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  tasks: ITask[] = [];

  isLoading = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private taskService: TaskService,
    private sharedService: SharedService,
    private titleService: Title,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.updateTitle();
    this.refreshAsync();
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll()));
    if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

    this.tasks = result.data;
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  updateTitle(): void {
    this.titleService.setTitle(`${this.translate.instant('title.statistics')} — Mean Stack Template`);
    this.sharedService.emitterTitle.pipe(take(1)).subscribe(() => this.updateTitle());
  }
}
