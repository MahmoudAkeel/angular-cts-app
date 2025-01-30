import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LookupsService } from '../../../services/lookups.service';
import { SearchPageService } from '../../../services/search-page.service';
import { ToasterService } from '../../../services/toaster.service';
import { User } from '../../../models/user.model';
import { Entity } from '../../../models/searchEntity.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SearchFilter } from '../../../models/searchFilter.model';
import { DelegationToUsers } from '../../../models/delegationTo.model';
import { ActivityLogResponse } from '../../../models/activity.model';
import { DocAttributesApiResponse } from '../../../models/searchDocAttributes.model';
import { SearchResponse } from '../../../models/searchresponse.model';
import { AttachmentsApiResponce } from '../../../models/attachments.model';
import { MatDialog } from '@angular/material/dialog';
import { MailDetailsDialogComponent } from '../mail-details-dialog/mail-details-dialog.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  regmodel: NgbDateStruct | undefined;
  fromModal: NgbDateStruct | undefined;
  tomodel: NgbDateStruct | undefined;

  accessToken: string | null = null;

  searchModel: SearchFilter = new SearchFilter();

  searchUsers: Partial<User>[] = [];
  delegationUsers: Partial<DelegationToUsers>[] = [];
  entities: Partial<Entity>[] = [];
  response: SearchResponse | null = null;
  dtOptions: DataTables.Settings = {};
  categories: any[] = [];
  priorities: any[] = [];
  privacies: any[] = [];
  importances: any[] = [];
  statuses: any[] = [];

  notes: any[] = [];
  linkedDocs: any[] = [];
  nonArchAttachments: any[] = [];
  transHistory: any[] = [];
  activityLogs: ActivityLogResponse[] = [];
  attributes: DocAttributesApiResponse | null = null;
  attachments: AttachmentsApiResponce[] | null = [];

  loading: boolean = true; // Loading state
  constructor(
    private searchService: SearchPageService,
    private router: Router,
    private lookupservice: LookupsService,
    private authService: AuthService,
    private toaster: ToasterService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    //this.regmodel = { year: 2025, month: 1, day: 21 };
    //this.fromModal = { year: 2025, month: 1, day: 21 };
    //this.tomodel = { year: 2025, month: 1, day: 22 };

    this.accessToken = this.authService.getToken();
    if (!this.accessToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.initDtOptions();

    this.getEntites();
    this.getUsers();
    this.getDelegationUsers();
    this.getCategories();
    this.getImportance();
    this.getPriorities();
    this.getStatuses();
    this.getPrivacies();
  }

  getEntites(): void {
    this.lookupservice.getEntities(this.accessToken!).subscribe(
      (response) => {
        this.entities = response || [];
        this.entities.unshift({ id: 0, name: 'Select Entity' });
        this.searchModel.documentReceiver = "0";
        this.searchModel.documentSender = "0";
        this.searchModel.toStructure = "0";
        this.searchModel.fromStructure = "0";
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getUsers(): void {
    this.lookupservice.getSearchUsers(this.accessToken!).subscribe(
      (response) => {
        this.searchUsers = response || [];
        this.searchUsers.unshift({ id: 0, fullName: 'Select User' });
        this.searchModel.delegationId = "0";
        this.searchModel.toUser = "0";
        this.searchModel.fromUser = "0";
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getDelegationUsers(): void {
    this.lookupservice.getDelegationToUsers(this.accessToken!).subscribe(
      (response) => {
        this.delegationUsers = response || [];
        this.delegationUsers.unshift({ id: 0, fromUser: 'My Inbox' });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getCategories(): void {
    this.lookupservice.getCategories(this.accessToken!, undefined).subscribe(
      (response) => {
        this.categories = response || [];

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getStatuses(): void {
    this.lookupservice.getStatus(this.accessToken!).subscribe(
      (response) => {
        this.statuses = response || [];

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPrivacies(): void {
    this.lookupservice.getPrivacy(this.accessToken!).subscribe(
      (response) => {
        this.privacies = response || [];

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getImportance(): void {
    this.lookupservice.getImportance(this.accessToken!).subscribe(
      (response) => {
        this.importances = response || [];

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPriorities(): void {
    this.lookupservice.getPriorities(this.accessToken!).subscribe(
      (response) => {
        this.priorities = response || [];

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  convertToNgbDateStruct(dateStr: string): NgbDateStruct | undefined {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('/');
    return { year: +year, month: +month, day: +day };
  }



  initDtOptions(): void {
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
        },
      },
      dom: 'tp',
      ordering: false,
    };
  }

  formatDate(date: NgbDateStruct | undefined): string {
    if (!date) return '';
    const month = date.month.toString().padStart(2, '0');
    const day = date.day.toString().padStart(2, '0');
    const year = date.year.toString();
    return `${year}/${month}/${day}`;
  }

  onSearch() {
    console.log(this.searchModel);
    const formattedSearchModel = { ...this.searchModel };

    // Change IDs sent by zero to empty & format dates
    (Object.keys(formattedSearchModel) as (keyof SearchFilter)[]).forEach((key) => {
      if (key !== "delegationId" && typeof formattedSearchModel[key] === "string" && formattedSearchModel[key] === "0") {
        (formattedSearchModel[key] as string) = "";
      }

      // Check if the key corresponds to one of the date fields that need to be formatted
      if (key === "fromTransferDate" || key === "toTransferDate" || key === "DocumentDate") {
        const value = formattedSearchModel[key];

        // Check if the value is a NgbDateStruct
        if (value && typeof value !== "string" && (value as NgbDateStruct).year) {
          const date = value as NgbDateStruct;
          formattedSearchModel[key] = this.formatDate(date);  // Convert to "yyyy/mm/dd"
        }
      }
    });

    debugger;
    this.searchService.searchInbox(this.accessToken!, formattedSearchModel).subscribe((result: SearchResponse) => {
      this.response = result;
      this.response.data.forEach(item => {
        item.categoryText = item.categoryId != null ? this.categories[item.categoryId - 1].text : '';
        item.statusText = item.statusId != null ? this.statuses[item.statusId - 1].text : '';
        item.priorityText = item.priorityId != null ? this.priorities[item.priorityId - 1].text : '';
        item.privacyText = item.privacyId != null ? this.privacies[item.privacyId - 1].text : '';
        item.importanceText = item.importanceId != null ? this.importances[item.importanceId - 1].text : '';
      },
        (error: any) => {
          console.error('Error getting search result:', error);
          this.toaster.showToaster(error ?.message || 'Something went wrong');
        });
    });

  }

  ResetForm() {
    this.searchModel.delegationId = "0";
    this.searchModel.toUser = "0";
    this.searchModel.fromUser = "0";
    this.searchModel.documentReceiver = "0";
    this.searchModel.documentSender = "0";
    this.searchModel.toStructure = "0";
    this.searchModel.fromStructure = "0";
  }

  clearForm() {
    this.searchModel = new SearchFilter();
    this.response = null;
    this.ResetForm();
  }

  getAttributes(docID: string): Promise<DocAttributesApiResponse> {
    return new Promise((resolve, reject) => {
      this.searchService.getDocAttributes(this.accessToken!, docID).subscribe(
        (response: any) => {
          this.attributes = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getNotes(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getNotes(this.accessToken!, docID).subscribe(
        (response) => {
          this.notes = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getActivityLogs(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getActivityLog(this.accessToken!, docID).subscribe(
        (response) => {
          this.activityLogs = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getLinkedDocuments(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getLinkedCorrespondence(this.accessToken!, docID).subscribe(
        (response) => {
          this.linkedDocs = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getNonArchAttachments(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getNonArchivedAttachment(this.accessToken!, docID).subscribe(
        (response) => {
          this.linkedDocs = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getHistory(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getTransHistory(this.accessToken!, docID).subscribe(
        (response: any) => {
          this.transHistory = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getAttachments(docID: string): Promise<AttachmentsApiResponce> {
    return new Promise((resolve, reject) => {
      this.searchService.getAttachments(this.accessToken!, docID).subscribe(
        (response: any) => {
          this.attachments = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  async showDetails(row: any) {

    const [attributes, nonArchAttachments, linkedDocs, activityLogs, notes, transHistory, attachments] = await Promise.all([
      this.getAttributes(row.id),
      this.getNonArchAttachments(row.id),
      this.getLinkedDocuments(row.id),
      this.getActivityLogs(row.id),
      this.getNotes(row.id),
      this.getHistory(row.id),
      this.getAttachments(row.id)
    ]);

    // Now open the dialog once all the data has been retrieved
    this.dialog.open(MailDetailsDialogComponent, {
      disableClose: true,
      width: '90%',
      height: '90%',
      data: {
        rowData: row, notesData: notes, linkedDoc: linkedDocs, archAttach: nonArchAttachments,
        logs: activityLogs, history: transHistory, mailAttachments: attachments
      }
    });

  } catch(error: any) {
    console.error("Error loading data", error);
  }
}
