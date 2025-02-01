import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { KpiService } from '../../../../../../services/kpi.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-table-structure-average-duration-for-correspondence-completion',
  templateUrl: './table-structure-average-duration-for-correspondence-completion.component.html',
  styleUrls: ['./table-structure-average-duration-for-correspondence-completion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    NgbModule,
    FormsModule
  ]
})
export class TableStructureAverageDurationForCorrespondenceCompletionComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  data: any[] = [];
  totalAverage: number = 0;
  @Input() year: number = 2025;
  @Input() entities: any[] = [];
  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  pages: number[] = [];

  // Datatable properties
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private kpiService: KpiService) { }

  ngOnInit() {
    this.initDtOptions();
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  private initDtOptions() {
    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers',
      paging: false,
      searching: false,
      autoWidth: false,
      language: {
        emptyTable: "No data available",
        zeroRecords: "No matching records found",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        paginate: {
          first: "<i class='text-secondary fa fa-angle-left'></i>",
          previous: "<i class='text-secondary fa fa-angle-double-left'></i>",
          next: "<i class='text-secondary fa fa-angle-double-right'></i>",
          last: "<i class='text-secondary fa fa-angle-right'></i>",
        }
      },
      dom: "t",
      ordering: false
    };
  }

  private loadData() {
    this.kpiService.ListStructureAverageDurationForCorrespondenceCompletion(this.year).subscribe((response: any) => {
      // Map the data to include both structureId and structureName
      this.data = response.data.map((item: any) => {
        const entity = this.entities.find(e => e.id === item.structureId);
        return {
          ...item,
          structureName: entity ? entity.name : 'Unknown Structure', // Add structure name from entities
          structureId: item.structureId // Keep original structureId
        };
      });
      this.totalItems = response.recordsTotal;
      this.totalAverage = response.data.reduce((acc: number, item: any) => acc + item.average, 0) / response.data.length;
      this.calculatePagination();
      this.dtTrigger.next(null);
    });
  }

  drawStructureUserTable(type: string, average: number, year: number, userId: number | null, structureId: number) {
    // Implement the logic to draw the structure user table
    console.log(`Drawing table for ${type} with average ${average}, year ${year}, userId ${userId}, structureId ${structureId}`);
  }

  openStructureChart(type: string, average: number, year: number, userId: number | null, structureId: number) {
    // Implement the logic to open the structure chart
    console.log(`Opening chart for ${type} with average ${average}, year ${year}, userId ${userId}, structureId ${structureId}`);
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.dtOptions.pageLength);
    this.startIndex = (this.currentPage - 1) * this.dtOptions.pageLength + 1;
    this.endIndex = Math.min(this.startIndex + this.dtOptions.pageLength - 1, this.totalItems);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadData();
  }
}
