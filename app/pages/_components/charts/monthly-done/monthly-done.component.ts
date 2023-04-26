import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, Colors } from 'ng2-charts';

@Component({
    selector: 'app-monthly-done',
    templateUrl: './monthly-done.component.html',
    styleUrls: ['./monthly-done.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyDoneComponent {
    lineChartType: ChartType = 'line';
    lineChartLabels: Label[] = ['FEB', 'MAR', 'APR', 'MAY'];
    lineChartData: MultiDataSet = [[6, 12, 14, 18, 15]];
    lineChartColors: Colors[] = [{ backgroundColor: ['#5c6bc0'] }];
    lineChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: { enabled: true },
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Monhtly Tasks Done'
        }
    };
}
