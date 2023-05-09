import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartLegendLabelOptions, ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { Colors } from 'ng2-charts';

import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { TranslateService } from '@ngx-translate/core';
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
export class TasksDoneComponent implements OnInit {
    tasks!: ITask[];
    pieChartType: ChartType = 'doughnut';
    pieChartLabels: any[] = [];
    pieChartData: any = [];
    pieChartColors: Colors[] = [{ backgroundColor: ['#c5cbe9', '#5c6bc0', '#1b278d'] }];
    pieChartOptions: ChartOptions = {
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
        this.getDailyEarnings();
        this.taskService.emitTask.subscribe(() => this.getDailyEarnings());
    }

    async getDailyEarnings (): Promise<ITask | void> {
        this.translateService.get('statistics.tasks-done').subscribe((text: string) => { (this.pieChartOptions.title as ChartTitleOptions).text = text; });

        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.listTasksByUser());
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });
        this.tasks = result.data;

        this.verifyResolutions();

        this.pieChartData = [];
        this.pieChartLabels = [];
        if (this.tasks.length) {
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.toDo).length);
            this.translateService.get('statistics.status.to-do').subscribe((text: string) => { this.pieChartLabels.push(text); });
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.progress).length);
            this.translateService.get('statistics.status.progress').subscribe((text: string) => { this.pieChartLabels.push(text); });
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.done).length);
            this.translateService.get('statistics.status.done').subscribe((text: string) => { this.pieChartLabels.push(text); });
        }
        this.changeDetector.markForCheck();
    }

    verifyResolutions (): void {
        this.media.asObservable().subscribe((change: MediaChange[]) => {
            if (change[0].mqAlias === 'lt-md' || change[0].mqAlias === 'sm') {
                (this.pieChartOptions.title as ChartTitleOptions).fontSize = 26;
                (this.pieChartOptions.tooltips as ChartTooltipOptions).titleFontSize = 24;
                (this.pieChartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 24;
                (this.pieChartOptions.legend?.labels as ChartLegendLabelOptions).fontSize = 24;
            } else {
                (this.pieChartOptions.title as ChartTitleOptions).fontSize = 16;
                (this.pieChartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
                (this.pieChartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
                (this.pieChartOptions.legend?.labels as ChartLegendLabelOptions).fontSize = 13;
            }
            this.changeDetector.markForCheck();
        });
    }
}
