import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  regmodel: NgbDateStruct | undefined;
  fromModal: NgbDateStruct | undefined;
  tomodel: NgbDateStruct | undefined;


  ngOnInit() {
    this.regmodel = { year: 2025, month: 1, day: 21 }; 
    this.fromModal = { year: 2025, month: 1, day: 21 }; 
    this.tomodel = { year: 2025, month: 1, day: 22 };
  }

  Category = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
  ];


  Sending = [
    { id: 1, name: 'Sending entity 1' },
    { id: 2, name: 'Sending entity 2' },
    { id: 3, name: 'Sending entity 3' },
  ];


  Receiving = [
    { id: 1, name: 'Receiving entity 1' },
    { id: 2, name: 'Receiving entity 2' },
    { id: 3, name: 'Receiving entity 3' },
  ];

}
