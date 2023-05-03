import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Colors, Label } from 'ng2-charts';

@Component({
    selector: 'app-week-earnings',
    templateUrl: './week-earnings.component.html',
    styleUrls: ['./week-earnings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekEarningsComponent {
    barChartLabels: Label[] = ['FEB', 'MAR', 'APR', 'MAY'];
    barChartType = 'bar' as ChartType;
    barChartLegend = true;
    barChartData = [{ data: [7, 9, 7, 8], label: 'Matches' }];
    barChartColors: Colors[] = [{ backgroundColor: ['#4caf50', '#4caf50', '#4caf50', '#4caf50'] }];
    barChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            display: false
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        },
        title: {
            display: true,
            text: 'Weekly Tasks'
        }
    };
}
