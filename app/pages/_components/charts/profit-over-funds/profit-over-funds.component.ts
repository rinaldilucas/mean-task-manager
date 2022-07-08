import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, Colors } from 'ng2-charts';

@Component({
    selector: 'app-profit-over-funds',
    templateUrl: './profit-over-funds.component.html',
    styleUrls: ['./profit-over-funds.component.scss'],
})
export class ProfitOverFundsComponent {
    donutChartType: ChartType = 'doughnut';
    donutChartLabels: Label[] = [' Wins', ' Losses'];
    donutChartData: MultiDataSet = [[22, 16]];
    donutChartColors: Colors[] = [{ backgroundColor: ['#4caf50', '#d32f2f'] }];
    donutChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: {
            position: 'right',
        },
        title: {
            display: true,
            text: 'Profit Over Funds',
        },
    };
}
