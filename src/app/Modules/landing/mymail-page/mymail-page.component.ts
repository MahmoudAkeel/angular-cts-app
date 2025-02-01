import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ApiResponseItem {
  subject: string;
  details: string;
  date: string;
  ref: string;
  isRead: boolean;
  isOverDue: boolean;
}

@Component({
  selector: 'app-mymail-page',
  templateUrl: './mymail-page.component.html',
  styleUrls: ['./mymail-page.component.scss']
})
export class MymailPageComponent implements OnInit {
  accessToken: string | null;
  newItems: ApiResponseItem[] = [];
  loading: boolean = true;
  dtOptions: DataTables.Settings = {};

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem('access_token');
  }

  ngOnInit() {
    this.initDtOptions();
    this.fetchInboxData();
  }

  initDtOptions() {
    this.dtOptions = {
      pageLength: 10,
      pagingType: 'full_numbers',
      paging: true,
      searching: false,
      autoWidth: false,
      language: {
        paginate: {
          first: "<i class='text-secondary fa fa-angle-left'></i>",
          previous: "<i class='text-secondary fa fa-angle-double-left'></i>",
          next: "<i class='text-secondary fa fa-angle-double-right'></i>",
          last: "<i class='text-secondary fa fa-angle-right'></i>",
        }
      },
      dom: "tp",
      ordering: false
    };
  }

  fetchInboxData() {
    if (!this.accessToken) {
      console.error('Access token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });

    this.http.post<any>('https://cts-qatar.d-intalio.com/Transfer/ListInbox', {}, { headers })
      .subscribe(response => {
        console.log('API Response:', response); // Log the response
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          this.newItems = response.data.map((item: ApiResponseItem) => ({
            subject: item.subject,
            details: `Transferred from: ${item.details}`,
            date: item.date,
            ref: item.ref,
            isRead: item.isRead,
            isOverDue: item.isOverDue,
          }));
        } else {
          console.error('Unexpected response format:', response.data);
        }
        this.loading = false;
      }, error => {
        console.error('Error fetching inbox data:', error);
        this.loading = false;
      });
  }

  showMailDetails() {
    // Implement the logic to show mail details
    console.log('Show mail details');
  }
}
