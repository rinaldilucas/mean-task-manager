import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Colors } from 'ng2-charts';

import { EStatus } from '@scripts/models/enum/status.enum';
import { IQueryResult } from '@scripts/models/queryResult.interface';
import { ITask } from '@scripts/models/task.interface';
import { SharedService } from '@scripts/services/shared.service';
import { TaskService } from '@scripts/services/task.service';

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
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: { display: true, position: 'left' },
        title: { display: true, text: 'Tasks Done' }
    };

    constructor (
        private taskService: TaskService, //
        private sharedService: SharedService,
        private changeDetector: ChangeDetectorRef

    ) {}

    ngOnInit (): void {
        this.getDailyEarnings();
        this.taskService.emitTask.subscribe(() => this.getDailyEarnings());
    }

    async getDailyEarnings (): Promise<ITask | void> {
        const [result, error]: IQueryResult<ITask>[] = await this.sharedService.handlePromises(this.taskService.listTasksByUser(99));
        if (!!error || !result || !result?.success) return this.sharedService.handleSnackbarMessages({ translationKey: 'task-list.refresh-error', success: false });

        this.tasks = result.data;
        this.pieChartData = [];
        this.pieChartLabels = [];
        if (this.tasks.length) {
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.toDo).length);
            this.pieChartLabels.push('To Do');
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.progress).length);
            this.pieChartLabels.push('In Progress');
            this.pieChartData.push(this.tasks.filter((task) => task.status === EStatus.done).length);
            this.pieChartLabels.push('Done');
        }
        this.changeDetector.markForCheck();
    }
}
