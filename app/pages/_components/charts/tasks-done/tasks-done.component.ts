import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Colors } from 'ng2-charts';

import { TaskService } from '@app/scripts/services/task.service';
import { ITask } from '@app/scripts/models/task.interface';
import { IQueryResult } from '@app/scripts/models/queryResult.interface';

@Component({
    selector: 'app-tasks-done',
    templateUrl: './tasks-done.component.html',
    styleUrls: ['./tasks-done.component.scss'],
})
export class TasksDoneComponent implements OnInit {
    tasks: ITask[];
    pieChartType: ChartType = 'doughnut';
    pieChartLabels: any[] = [];
    pieChartData: any = [];
    pieChartColors: Colors[] = [{ backgroundColor: ['#4caf50', '#d32f2f', '#dddddd'] }];
    pieChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: { display: true, position: 'right' },
        title: { display: true, text: 'Tasks Done' },
    };

    constructor(private taskService: TaskService) {}

    ngOnInit(): void {
        this.getDailyEarnings();
        this.taskService.emitTask.subscribe(() => this.getDailyEarnings());
    }

    getDailyEarnings(): void {
        this.taskService.listTasksByUser().subscribe((result: IQueryResult<ITask>) => {
            this.tasks = result.data;
            this.pieChartData = [];
            this.pieChartLabels = [];

            // if (!!this.tasks.length) {
            //     this.pieChartData.push(this.tasks.filter((task) => task.status === 'ToDo').length);
            //     this.pieChartLabels.push(`${this.tasks.filter((task) => task.status === 'ToDo').length} To Do`);
            //     this.pieChartData.push(this.tasks.filter((task) => task.status === 'progress').length);
            //     this.pieChartLabels.push(`${this.tasks.filter((task) => task.status === 'progress').length} Progress`);
            //     this.pieChartData.push(this.tasks.filter((task) => task.status === 'done').length);
            //     this.pieChartLabels.push(`${this.tasks.filter((task) => task.status === 'done').length} Done`);
            // }
        });
    }
}
