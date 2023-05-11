import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';

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
    chartType: ChartType = 'line';
    chartLabels: Label[] = [];
    chartData: MultiDataSet = [];
    chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: { display: false },
        title: { display: true },
        scales: {
            yAxes: [{ ticks: {} }],
            xAxes: [{ ticks: {} }]
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
            (this.chartOptions.title as any).text = text;
            this.changeDetector.markForCheck();
        });

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.getTasksDoneWeekly());
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });
        this.tasks = result.data;

        this.verifyResolutions();

        const weeksQuantity = 4;
        const weekDays = 7;
        for (let index = weeksQuantity, j = 0; index > 0; index--, j++) {
            const initialDate = new Date();
            initialDate.setDate(initialDate.getDate() - (weekDays * (j + 1)));
            const finalDate = new Date();
            finalDate.setDate(finalDate.getDate() - (weekDays * j));

            const tasks = this.tasks.filter((task) => {
                const taskDate = new Date(task.createdAt);
                return taskDate >= initialDate && taskDate <= finalDate;
            });

            this.chartData.push(tasks.length as any);
            this.chartLabels.push(`${finalDate.getDate().toLocaleString('default', { minimumIntegerDigits: 2, useGrouping: false })}/${(finalDate.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`);
        }
        this.chartData.reverse();
        this.chartLabels.reverse();

        this.changeDetector.markForCheck();
    }

    verifyResolutions (): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'lt-md' || change[0].mqAlias === 'sm' || change[0].mqAlias === 'xs') {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 26;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 24;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 24;
                this.chartOptions.scales?.yAxes?.forEach((yAxis) => { (yAxis as any).ticks.fontSize = 18; });
                this.chartOptions.scales?.xAxes?.forEach((xAxis) => { (xAxis as any).ticks.fontSize = 18; });
            } else {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 16;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
                this.chartOptions.scales?.yAxes?.forEach((yAxis) => { (yAxis as any).ticks.fontSize = 13; });
                this.chartOptions.scales?.xAxes?.forEach((xAxis) => { (xAxis as any).ticks.fontSize = 13; });
            }
            this.changeDetector.markForCheck();
        });
    }
}
