import { Component, Inject, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchPageService } from '../../../services/search-page.service';
import { Router } from '@angular/router';
import { AttachmentsApiResponce } from '../../../models/attachments.model';
import { DocAttributesApiResponse } from '../../../models/searchDocAttributes.model';

interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
}

interface FlatTreeNode {
  id: number;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-mail-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, NgbDatepickerModule, DataTablesModule, MatTreeModule],
  templateUrl: './mail-details-dialog.component.html',
  styleUrls: ['./mail-details-dialog.component.scss']
})

export class MailDetailsDialogComponent implements AfterViewChecked, OnInit {

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  accessToken: string | null = null;
  @ViewChild('tabsContainer', { static: false }) tabsContainer!: ElementRef;
  tabs = ['Attributes', 'Attachments', 'Notes', 'Linked correspondence', 'NonArchivedAttachment', 'Visual tracking', 'Transfers history', 'Activity log'];
  isScrollable: boolean = false;
  activeTabIndex: number = 0;
  selectedNode: any = null;

  dtOptions: DataTables.Settings = {};

  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;
  selectedDocumentId!: number;
  documentViewerUrl!: SafeResourceUrl;

  TREE_DATA: TreeNode[] = [];

  attributes: any;
  nonArchAttachments: any;
  linkedDocs: any;
  activityLogs: any;
  notes: any;
  transHistory: any;
  attachments: any;
  visualTracking: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: any, id: string, referenceNumber: string },
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private searchService: SearchPageService
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      (node: FlatTreeNode) => node.level,
      (node: FlatTreeNode) => node.expandable,
      (node: TreeNode) => node.children
    );

    this.treeControl = new FlatTreeControl<FlatTreeNode>(
      (node: FlatTreeNode) => node.level,
      (node: FlatTreeNode) => node.expandable
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // Initially, TREE_DATA is empty
    this.dataSource.data = this.TREE_DATA;
  }

  ngOnInit() {
    console.log('Dialog opened with ID:', this.data.id, 'and Reference Number:', this.data.referenceNumber);
    this.accessToken = this.authService.getToken();
    if (!this.accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.initDtOptions();
    this.fetchDetails(this.data.id);
  }

  initDtOptions() {
    this.dtOptions = {
      pageLength: 10,
      search: false,
      order: [],
      pagingType: 'full_numbers',
      paging: true,
      searching: false,
      displayStart: 0,
      autoWidth: false,
      language: {
        paginate: {
          first: "<i class='text-secondary fa fa-angle-left'></i>",
          previous: "<i class='text-secondary fa fa-angle-double-left'></i>",
          next: "<i class='text-secondary fa fa-angle-double-right'></i>",
          last: "<i class='text-secondary fa fa-angle-right'></i>",
        },
      },
      dom: "tp",
      ordering: false
    };
  }


  private transformAttachmentsToTree(mailAttachments: any[]): TreeNode[] {
    return mailAttachments.map(attachment => this.createTreeNode(attachment));
  }

  private createTreeNode(attachment: any): TreeNode {
    // Use 'name', 'text', or a default value for the node name
    const node: TreeNode = {
      id: attachment.id,
      name: attachment.name || attachment.text || 'Unnamed Attachment'
    };

    // If attachments are nested, they might be under "children" or "childAttachments"
    if ((attachment.children && attachment.children.length > 0) ||
      (attachment.childAttachments && attachment.childAttachments.length > 0)) {
      const childrenData = attachment.children || attachment.childAttachments;
      node.children = childrenData.map((child: any) => this.createTreeNode(child));
    }
    return node;
  }

  private _transformer = (node: TreeNode, level: number): FlatTreeNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };

  selectNode(node: any, event: Event) {
    event.preventDefault();
    this.selectedNode = node;
    // Check if the node ID starts with 'file_'
    if (this.selectedNode.id && this.selectedNode.id.toString().startsWith('file_')) {
      this.selectedDocumentId = parseInt(this.selectedNode.id.toString().split('_')[1], 10);
      this.getViewerUrl();
    }
  }

  ngAfterViewChecked() {
    if (this.tabsContainer) {
      const newScrollState = this.checkScroll();
      if (this.isScrollable !== newScrollState) {
        this.isScrollable = newScrollState;
        this.cdr.detectChanges();
      }
    }
  }

  scrollLeft() {
    if (this.tabsContainer) {
      this.tabsContainer.nativeElement.scrollBy({ left: -150, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.tabsContainer) {
      this.tabsContainer.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  checkScroll(): boolean {
    return this.tabsContainer && this.tabsContainer.nativeElement.scrollWidth > this.tabsContainer.nativeElement.clientWidth;
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }



  hasChild = (_: number, node: FlatTreeNode) => node.expandable;




  async fetchDetails(docID: string) {
    try {
      const [attributes, nonArchAttachments, linkedDocs, activityLogs, notes, transHistory, attachments, visualTracking] = await Promise.all([
        this.getAttributes(docID),
        this.getNonArchAttachments(docID),
        this.getLinkedDocuments(docID),
        this.getActivityLogs(docID),
        this.getNotes(docID),
        this.getHistory(docID),
        this.getAttachments(docID),
        this.getVisualTracking(docID)
      ]);

      this.attributes = attributes;
      this.nonArchAttachments = nonArchAttachments;
      this.linkedDocs = linkedDocs;
      this.activityLogs = activityLogs;
      this.notes = notes;
      this.transHistory = transHistory;
      this.attachments = attachments;
      this.visualTracking = visualTracking;

      // Build the attachments tree if data is valid and is an array
      if (this.attachments && Array.isArray(this.attachments)) {
        this.TREE_DATA = this.transformAttachmentsToTree(this.attachments);
        this.dataSource.data = this.TREE_DATA;
        console.log("Transformed TREE_DATA:", this.TREE_DATA);
        // Trigger change detection in case the tree view needs updating
        this.cdr.detectChanges();
      }

    } catch (error) {
      console.error("Error loading data", error);
    }
  }

  getAttributes(docID: string): Promise<DocAttributesApiResponse> {
    return new Promise((resolve, reject) => {
      this.searchService.getDocAttributes(this.accessToken!, docID).subscribe(
        (response: any) => {
          this.attributes = response || [];
          console.log("attributes", this.attributes);
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
          this.TREE_DATA = this.transformAttachmentsToTree(this.attachments);
          this.dataSource.data = this.TREE_DATA;
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getVisualTracking(docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.searchService.getVisualTracking(docID).subscribe(
        (response) => {
          this.visualTracking = response || [];
          resolve(response);
        },
        (error: any) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  getViewerUrl() {
    const baseUrl = 'https://java-qatar.d-intalio.com/VIEWER/file';
    const token = this.authService.getToken();

    if (!token) {
      console.error("Token is missing or expired.");
      return;
    }

    const params = {
      documentId: this.selectedDocumentId,
      language: 'en',
      token: encodeURIComponent(token),
      version: 'autocheck',
      structId: 1,
      viewermode: 'view'
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    this.documentViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}?${queryString}`);
    console.log("Viewer URL: ", this.documentViewerUrl);
  }
}
