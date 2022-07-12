import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, Colors } from 'ng2-charts';

@Component({
    selector: 'app-initial-funds',
    templateUrl: './initial-funds.component.html',
    styleUrls: ['./initial-funds.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitialFundsComponent implements OnInit {
    lineChartType: ChartType = 'line';
    lineChartLabels: Label[] = [' FEB', ' MAR', ' APR', ' MAY'];
    lineChartData: MultiDataSet = [[1000, 1224, 1445, 1880, 2300]];
    lineChartColors: Colors[] = [{ backgroundColor: ['#4caf50'] }];
    lineChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Funds',
        },
    };

    ngOnInit(): void {}
}
