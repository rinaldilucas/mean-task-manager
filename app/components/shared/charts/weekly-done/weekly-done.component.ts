import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { Colors, Label, MultiDataSet } from 'ng2-charts';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { TranslateService } from '@ngx-translate/core';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { SharedService } from '@services/shared.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'app-weekly-done',
    templateUrl: './weekly-done.component.html',
    styleUrls: ['./weekly-done.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeeklyDoneComponent implements OnInit {
    tasks!: ITask[];
    lineChartType: ChartType = 'line';
    lineChartLabels: Label[] = [];
    lineChartData: MultiDataSet = [];
    lineChartColors: Colors[] = [{ backgroundColor: ['#c5cbe9', '#5c6bc0', '#1b278d'] }];
    lineChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Title'
        }
    };

    constructor (
        private taskService: TaskService, //
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef,
        private translateService: TranslateService,
        private media: MediaObserver
    ) {}

    ngOnInit (): void {
        this.refresh();
        this.taskService.emitTask.subscribe(() => this.refresh());
    }

    async refresh (): Promise<ITask | void> {
        this.translateService.get('statistics.tasks-done-weekly').subscribe((text) => {
            debugger;
            (this.lineChartOptions.title as any).text = text;
            this.changeDetector.markForCheck();
        });

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.getTasksDoneWeekly());
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });
        this.tasks = result.data;

        for (let i = 4; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (7 * i));
            this.lineChartLabels.push(`${date.getDate().toLocaleString('default', { minimumIntegerDigits: 2, useGrouping: false })}/${(date.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`);
        }

        this.verifyResolutions();
        this.lineChartData = [[6, 12, 14, 18]];
        this.changeDetector.markForCheck();
    }

    verifyResolutions (): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'lt-md' || change[0].mqAlias === 'sm') {
                (this.lineChartOptions.title as ChartTitleOptions).fontSize = 26;
                (this.lineChartOptions.tooltips as ChartTooltipOptions).titleFontSize = 24;
                (this.lineChartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 24;
            } else {
                (this.lineChartOptions.title as ChartTitleOptions).fontSize = 16;
                (this.lineChartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
                (this.lineChartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
            }
            this.changeDetector.markForCheck();
        });
    }
}
