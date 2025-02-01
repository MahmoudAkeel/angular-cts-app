import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { ChartSystemCountPerCategoryAndStatusComponent } from './charts/chart-system-count-per-category-and-status/chart-system-count-per-category-and-status.component';
import { Helpers } from '../../../shared/helpers';
import { LookupsService } from '../../../../services/lookups.service';

@Component({
  selector: 'app-system-dashboard',
  standalone: true,
  imports: [ChartSystemCountPerCategoryAndStatusComponent],
  templateUrl: './system-dashboard.component.html',
  styleUrl: './system-dashboard.component.scss'
})
export class SystemDashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;


  fromDate: string = Helpers.formatDateToYYYYMMDD(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  toDate: string = Helpers.formatDateToYYYYMMDD(new Date());
  categories: any[] = [];

  constructor(private lookupsService: LookupsService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.lookupsService.getCategories(undefined).subscribe((res: any) => {
      this.categories = res;
    });
  }





}