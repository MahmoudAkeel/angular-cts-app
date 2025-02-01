import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsService } from '../../../../../../services/charts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LookupsService } from '../../../../../../services/lookups.service';

@Component({
  selector: 'app-chart-documents-inProgressOverdue-and-onTime',
  templateUrl: './chart-documents-inProgressOverdue-and-onTime.component.html',
  styleUrls: ['./chart-documents-inProgressOverdue-and-onTime.component.css'],
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, FormsModule],
})
export class ChartDocumentsInProgressOverdueAndOnTimeComponent implements OnInit, OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options | undefined;

  @Input() fromDate: string = '';
  @Input() toDate: string = '';
  @Input() categories: { id: number, text: string }[] = [];

  tempFromDate: string = this.fromDate; // Temporary variable for modal input
  tempToDate: string = this.toDate; // Temporary variable for modal input
  isModalOpen: boolean = false;

  constructor(private chartsService: ChartsService, private lookupsService: LookupsService) { }

  ngOnInit() {
    // Only load chart data when categories are available
    if (this.categories && this.categories.length > 0) {
      this.loadChartData();
    }
  }

  ngOnChanges() {
    // Reload chart data whenever categories input changes and is not empty
    if (this.categories && this.categories.length > 0) {
      this.loadChartData();
    }
  }

  private loadChartData() {
    this.chartsService
      .GetDocumentsInProgressOverdueAndOnTimePerCategoryByUser({
        fromDate: this.fromDate,
        toDate: this.toDate,
        structureId: '1',
      })
      .subscribe((res: { overDue: any[]; onTime: any[] }) => {
        const categoryNames: string[] = [];
        const overdueData: number[] = [];
        const onTimeData: number[] = [];
        console.log('categories', this.categories);
        this.categories.forEach(cat => {
          const overdueItem = res.overDue.find(item => item.categoryId === cat.id) || { count: 0 };
          const onTimeItem = res.onTime.find(item => item.categoryId === cat.id) || { count: 0 };

          if (overdueItem.count > 0 || onTimeItem.count > 0) {
            categoryNames.push(cat.text);
            overdueData.push(overdueItem.count);
            onTimeData.push(onTimeItem.count);
          }
        });

        this.drawChart(categoryNames, overdueData, onTimeData);
      });
  }

  private drawChart(categories: string[], overdueData: number[], onTimeData: number[]) {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Categories'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Document Count'
        }
      },
      tooltip: {
        shared: true,
        pointFormat: '<b>{series.name}</b>: {point.y} documents<br/>'
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'Overdue',
          type: 'column',
          data: overdueData,
          color: '#D32F2F' // Red
        },
        {
          name: 'On-Time',
          type: 'column',
          data: onTimeData,
          color: '#388E3C' // Green
        }
      ]
    };
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (this.isModalOpen) {
      this.tempFromDate = this.fromDate;
      this.tempToDate = this.toDate;
    }
  }

  applyFilter() {
    this.fromDate = this.tempFromDate;
    this.toDate = this.tempToDate;
    this.loadChartData();
    this.toggleModal();
  }
}
