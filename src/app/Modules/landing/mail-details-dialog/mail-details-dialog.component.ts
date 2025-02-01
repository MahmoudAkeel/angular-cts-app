import { Component, Inject, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, AfterViewInit, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

export class MailDetailsDialogComponent implements AfterViewChecked {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  @ViewChild('tabsContainer', { static: false }) tabsContainer!: ElementRef;
  //  tabs = ['Transfer', 'Attributes', 'Attachments', 'Notes', 'Linked correspondence', 'NonArchivedAttachment', 'Visual tracking', 'Transfers history', 'Activity log'];
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    console.log("data", this.data);
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
    this.dataSource.data = this.TREE_DATA;
  }

  ngOnInit() {
    this.initDtOptions();


    // Transform the data passed to the dialog into tree data format
    if (this.data && this.data.mailAttachments) {
      this.TREE_DATA = this.transformAttachmentsToTree(this.data.mailAttachments);
      this.dataSource.data = this.TREE_DATA;
    }
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
      // search:{search:""},
      autoWidth: false,
      // ordering: true,
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
    const node: TreeNode = { id: attachment.id, name: attachment.text };  // Using 'text' as the name for the node

    if (attachment.children && attachment.children.length > 0) {
      node.children = attachment.children.map((child: any) => this.createTreeNode(child));
    }

    return node;
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


  private _transformer = (node: TreeNode, level: number): FlatTreeNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };


  hasChild = (_: number, node: FlatTreeNode) => node.expandable;


  selectNode(node: any, event: Event) {
    debugger
    event.preventDefault();
    this.selectedNode = node;
    if (this.selectedNode.id && this.selectedNode.id.startsWith('file_')) {
      this.selectedDocumentId = this.selectedNode.id.split('_')[1];
      this.getViewerUrl();

    }
  }

  getViewerUrl() {
    debugger;
    const baseUrl = 'https://java-qatar.d-intalio.com/VIEWER/file'; // Fixed URL
    const token = this.authService.getToken();

    if (!token) {
      console.error("Token is missing or expired.");
      return;
    }

    const params = {
      documentId: +this.selectedDocumentId, // Try using the working document ID
      language: 'en',
      token: encodeURIComponent(token),
      version: 'autocheck', // Try adding this
      structId: 1,         // Try adding this
      viewermode: 'view'
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    this.documentViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}?${queryString}`);
    console.log("Viewer URL: ", this.documentViewerUrl);
  }


}
