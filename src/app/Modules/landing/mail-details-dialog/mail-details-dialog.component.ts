import { Component, Inject, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FlatTreeNode {
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

  @ViewChild('tabsContainer', { static: false }) tabsContainer!: ElementRef;
//  tabs = ['Transfer', 'Attributes', 'Attachments', 'Notes', 'Linked correspondence', 'NonArchivedAttachment', 'Visual tracking', 'Transfers history', 'Activity log'];
  tabs = [ 'Attributes', 'Attachments', 'Notes', 'Linked correspondence', 'NonArchivedAttachment', 'Visual tracking', 'Transfers history', 'Activity log'];
  isScrollable: boolean = false;
  activeTabIndex: number = 0;
  selectedNode: any = null;

  dtOptions: DataTables.Settings = {};

  treeControl: FlatTreeControl<FlatTreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;

  TREE_DATA: TreeNode[] = [
    {
      name: 'Documents',
      children: [
        {
          name: 'Original document',
          children: [
            { name: '_نموذج مراسلة خارجية2.pdf' }
          ]
        }
      ]
    },
    {
      name: 'Documents',
      children: [
        {
          name: 'Original document',
          children: [
            { name: '_نموذج مراسلة خارجية2.pdf' },
            { name: '_نموذج مراسلة خارجية2.pdf' },
            { name: '_نموذج مراسلة خارجية2.pdf' }
          ]
        }
      ]
    }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef) {
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
    const node: TreeNode = { name: attachment.text };  // Using 'text' as the name for the node

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
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };


  hasChild = (_: number, node: FlatTreeNode) => node.expandable;


  selectNode(node: any, event: Event) {
    event.preventDefault();
    this.selectedNode = node;
  }

  Items = [
    {
      subject: 'Boeing 777F aircraft emergency equipment layout',
      date: '10/08/2020 1:54pm',
      ref: '2020/Out/04777/AS',
    },
    {
      subject: 'Boeing 777F aircraft emergency equipment layout',
      date: '10/08/2020 1:54pm',
      ref: '2020/Out/04777/AS',
    },
    {
      subject: 'Boeing 777F aircraft emergency equipment layout',
      date: '10/08/2020 1:54pm',
      ref: '2020/Out/04777/AS',
    },
  ];
}
