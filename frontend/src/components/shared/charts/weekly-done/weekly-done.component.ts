import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { TranslateService } from '@ngx-translate/core';
import { ChartOptions, ChartTitleOptions, ChartTooltipOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';

import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { ITask } from '@app/scripts/models/task.interface';

@Component({
  selector: 'app-weekly-done',
  templateUrl: './weekly-done.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyDoneComponent extends Unsubscriber implements OnInit {
  @Input() tasks!: ITask[];
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

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
      yAxes: [
        {
          gridLines: { lineWidth: 0.5 },
          ticks: {
            display: true,
            maxTicksLimit: 3,
            minor: { fontSize: 14 },
          },
        },
      ],
      xAxes: [
        {
          gridLines: { display: false },
          ticks: {
            minor: { fontSize: 14 },
          },
        },
      ],
    },
  };

  constructor(
    private translate: TranslateService,
    private media: MediaObserver,
  ) {
    super();
  }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<ITask | void> {
    (this.chartOptions.title as any).text = this.translate.instant('statistics.tasks-done-weekly');
    this.verifyResolutions();

    const numberOfWeeks = 4;
    const weekDays = 7;
    const startDate = new Date();
    startDate.setDate(new Date().getDate() - weekDays * (numberOfWeeks + 1));

    for (let index = 0, j = numberOfWeeks; j > 0; index++, j--) {
      const initialDate = new Date();
      initialDate.setDate(initialDate.getDate() - weekDays * (index + 1));
      const finalDate = new Date();
      finalDate.setDate(finalDate.getDate() - weekDays * index);

      const tasksByInterval = this.tasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= initialDate && taskDate <= finalDate;
      });

      this.chartData.push(tasksByInterval.length as any);
      this.chartLabels.push(
        `${finalDate.getDate().toLocaleString('default', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}/${(finalDate.getMonth() + 1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`,
      );
    }
    this.chartData.reverse();
    this.chartLabels.reverse();
  }

  verifyResolutions(): void {
    this.subs.sink = this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0]?.mqAlias === 'lt-md' || change[0]?.mqAlias === 'sm' || change[0]?.mqAlias === 'xs') {
        (this.chartOptions.title as ChartTitleOptions).fontSize = 20;
        (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 22;
        (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 22;
        this.chartOptions.scales?.yAxes?.forEach((yAxis) => {
          (yAxis as any).ticks.minor.fontSize = 14;
        });
        this.chartOptions.scales?.xAxes?.forEach((xAxis) => {
          (xAxis as any).ticks.minor.fontSize = 14;
        });
      } else {
        (this.chartOptions.title as ChartTitleOptions).fontSize = 16;
        (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
        (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
        this.chartOptions.scales?.yAxes?.forEach((yAxis) => {
          (yAxis as any).ticks.minor.fontSize = 14;
        });
        this.chartOptions.scales?.xAxes?.forEach((xAxis) => {
          (xAxis as any).ticks.minor.fontSize = 14;
        });
      }

      this.baseChart.chart.options = this.chartOptions;
      this.baseChart.chart.update();
    });
  }
}
