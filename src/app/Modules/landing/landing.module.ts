import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelegationPageComponent } from './delegation-page/delegation-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MailPageComponent } from './mail-page/mail-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { LandingRoutingModule } from './landing-routing.module';
import { MymailPageComponent } from './mymail-page/mymail-page.component';
import { BamPageComponent } from './bam-page/bam-page.component';
import { GuidelinePageComponent } from './guideline-page/guideline-page.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompletedTransfersComponent } from './reports-page/completed-transfers/completed-transfers.component';
import { InprogressTransfersComponent } from './reports-page/inprogress-transfers/inprogress-transfers.component';
import { InProgressCorrespondencesComponent } from './reports-page/in-progress-correspondences/in-progress-correspondences.component';
import { SharedModule } from '../shared/shared.module';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { ConfirmationmodalComponent } from '../shared/confirmationmodal/confirmationmodal.component'
import { ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    DelegationPageComponent,
    LandingPageComponent,
    MailPageComponent,
    ReportsPageComponent,
    SearchPageComponent,
    MymailPageComponent,
    BamPageComponent,
    GuidelinePageComponent,
    InprogressTransfersComponent,
    CompletedTransfersComponent,
    InProgressCorrespondencesComponent,
    ConfirmationmodalComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    NgbNavModule,
    DataTablesModule,
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    JsonPipe,
    NgbModule,
    NgSelectModule,
    ToasterComponent,
    ReactiveFormsModule,
    HighchartsChartModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class LandingModule { }
