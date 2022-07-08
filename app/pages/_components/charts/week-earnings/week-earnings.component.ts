import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, Colors } from 'ng2-charts';

@Component({
    selector: 'app-week-earnings',
    templateUrl: './week-earnings.component.html',
    styleUrls: ['./week-earnings.component.scss'],
})
export class WeekEarningsComponent {
    barChartLabels: Label[] = [' FEB', ' MAR', ' APR', ' MAY'];
    barChartType = 'bar' as ChartType;
    barChartLegend = true;
    barChartData = [{ data: [1000, 1224, 1445, 1880, 2300], label: ' Matches' }];
    barChartColors: Colors[] = [{ backgroundColor: ['#4caf50', '#4caf50', '#4caf50', '#4caf50'] }];
    barChartOptions: ChartOptions | any = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
            display: false,
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        title: {
            display: true,
            text: 'Week Earnings',
        },
    };
}
