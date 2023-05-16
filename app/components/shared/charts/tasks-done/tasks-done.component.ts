import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { TranslateService } from '@ngx-translate/core';
import { ChartLegendLabelOptions, ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { Subscription } from 'rxjs/internal/Subscription';
import { take } from 'rxjs/operators';

import { EStatus } from '@scripts/models/enum/status.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { SharedService } from '@services/shared.service';
import { TaskService } from '@services/task.service';

@Component({
    selector: 'app-tasks-done',
    templateUrl: './tasks-done.component.html',
    styleUrls: ['./tasks-done.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDoneComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];

    tasks!: ITask[];
    chartType: ChartType = 'doughnut';
    chartLabels: any[] = [];
    chartData: any = [];
    chartOptions: ChartOptions = {
        responsive: true,
        tooltips: { enabled: true },
        legend: { display: true, position: 'left', align: 'center', labels: { boxWidth: 35, padding: 16 } },
        title: { display: true }
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
        this.taskService.emitTask.pipe(take(1)).subscribe(() => this.refresh());
    }

    async refresh (): Promise<ITask | void> {
        this.translateService.get('statistics.tasks-done').pipe(take(1)).subscribe((text: string) => { (this.chartOptions.title as ChartTitleOptions).text = text; });

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.findAllByUser());
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });
        this.tasks = result.data;

        this.verifyResolutions();

        this.chartData = [];
        this.chartLabels = [];
        if (this.tasks.length) {
            this.chartData.push(this.tasks.filter((task) => task.status === EStatus.toDo).length);
            this.translateService.get('statistics.status.to-do').pipe(take(1)).subscribe((text: string) => { this.chartLabels.push(text); });
            this.chartData.push(this.tasks.filter((task) => task.status === EStatus.progress).length);
            this.translateService.get('statistics.status.progress').pipe(take(1)).subscribe((text: string) => { this.chartLabels.push(text); });
            this.chartData.push(this.tasks.filter((task) => task.status === EStatus.done).length);
            this.translateService.get('statistics.status.done').pipe(take(1)).subscribe((text: string) => { this.chartLabels.push(text); });
        }
        this.changeDetector.markForCheck();
    }

    verifyResolutions (): void {
        this.subscriptions.push(this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'lt-md' || change[0].mqAlias === 'sm' || change[0].mqAlias === 'xs') {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 20;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 22;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 22;
                this.chartOptions.scales?.yAxes?.forEach((yAxis) => { (yAxis as any).ticks.fontSize = 18; });
                this.chartOptions.scales?.xAxes?.forEach((xAxis) => { (xAxis as any).ticks.fontSize = 18; });
            } else {
                (this.chartOptions.title as ChartTitleOptions).fontSize = 16;
                (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
                (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
                (this.chartOptions.legend?.labels as ChartLegendLabelOptions).fontSize = 13;
            }
            this.changeDetector.markForCheck();
        }));
    }

    ngOnDestroy (): void {
        this.sharedService.dispose();
    }
}
