import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { lastValueFrom, take } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksDoneComponent } from '@app/components/shared/charts/tasks-done/tasks-done.component';
import { WeeklyDoneComponent } from '@app/components/shared/charts/weekly-done/weekly-done.component';
import { IQueryResult } from '@app/scripts/models/query-result.interface';
import { ITask } from '@app/scripts/models/task.interface';
import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';
import { SharedService } from '@app/scripts/services/shared.service';
import { TaskService } from '@app/scripts/services/task.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, TranslateModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, TasksDoneComponent, WeeklyDoneComponent],
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
  ) { }

  ngOnInit(): void {
    this.updateTitle();
    this.refreshAsync();
  }

  async refreshAsync(): Promise<void> {
    const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(lastValueFrom(this.taskService.findAll()));
    if (!result || !result.success || error) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

    this.tasks = result.data;
    this.isLoading = false;
    this.changeDetector.markForCheck();
  }

  updateTitle(): void {
    this.titleService.setTitle(`${this.translate.instant('title.statistics')} — Mean Stack Template`);
    this.sharedService.emitterTitle.pipe(take(1)).subscribe(() => this.updateTitle());
  }
}
