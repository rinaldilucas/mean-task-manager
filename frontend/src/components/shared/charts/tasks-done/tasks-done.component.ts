import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { TranslateService } from '@ngx-translate/core';
import {
  ChartLegendLabelOptions,
  ChartLegendOptions,
  ChartOptions,
  ChartTitleOptions,
  ChartTooltipOptions,
  ChartType,
} from 'chart.js';
import { BaseChartDirective, Label, SingleDataSet } from 'ng2-charts';

import { Unsubscriber } from '@app/components/shared/unsubscriber/unsubscriber.component';
import { EStatus } from '@app/scripts/models/enums/status.enum';
import { ITask } from '@app/scripts/models/task.interface';

@Component({
  selector: 'app-tasks-done',
  templateUrl: './tasks-done.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDoneComponent extends Unsubscriber implements OnInit {
  @Input() tasks!: ITask[];
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

  chartType: ChartType = 'doughnut';
  chartLabels: Label[] = [];
  chartData: SingleDataSet = [];
  chartOptions: ChartOptions = {
    responsive: true,
    tooltips: { enabled: true },
    legend: {
      display: true,
      position: 'left',
      align: 'center',
      labels: { boxWidth: 35, padding: 16, fontSize: 16 },
    },
    title: { display: true },
  };

  constructor(
    private translate: TranslateService,
    private media: MediaObserver,
  ) {
    super();
  }

  ngOnInit(): void {
    this.refreshAsync();
  }

  async refreshAsync(): Promise<ITask | void> {
    (this.chartOptions.title as ChartTitleOptions).text = this.translate.instant('statistics.tasks-done');
    this.verifyResolutions();

    this.chartData = [];
    this.chartLabels = [];

    if (this.tasks.length) {
      this.chartData.push(this.tasks.filter((task) => task.status === EStatus.toDo).length);
      this.chartData.push(this.tasks.filter((task) => task.status === EStatus.progress).length);
      this.chartData.push(this.tasks.filter((task) => task.status === EStatus.done).length);
      this.chartLabels.push(this.translate.instant('statistics.status.to-do'));
      this.chartLabels.push(this.translate.instant('statistics.status.progress'));
      this.chartLabels.push(this.translate.instant('statistics.status.done'));
    }
  }

  verifyResolutions(): void {
    this.subs.sink = this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (change[0]?.mqAlias === 'lt-md' || change[0]?.mqAlias === 'sm' || change[0]?.mqAlias === 'xs') {
        (this.chartOptions.title as ChartTitleOptions).fontSize = 20;
        (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 22;
        (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 22;
        (((this.chartOptions as ChartOptions).legend as ChartLegendOptions).labels as ChartLegendLabelOptions).fontSize = 15;
      } else {
        (this.chartOptions.title as ChartTitleOptions).fontSize = 16;
        (this.chartOptions.tooltips as ChartTooltipOptions).titleFontSize = 14;
        (this.chartOptions.tooltips as ChartTooltipOptions).bodyFontSize = 14;
        (((this.chartOptions as ChartOptions).legend as ChartLegendOptions).labels as ChartLegendLabelOptions).fontSize = 14;
      }

      this.baseChart.chart.options = this.chartOptions;
      this.baseChart.chart.update();
    });
  }
}
