import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DelegationPageComponent } from './delegation-page/delegation-page.component';
import { MailPageComponent } from './mail-page/mail-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { BamPageComponent } from './bam-page/bam-page.component';
import { MymailPageComponent } from './mymail-page/mymail-page.component';
import { GuidelinePageComponent } from './guideline-page/guideline-page.component';
import { CompletedTransfersComponent } from './reports-page/completed-transfers/completed-transfers.component';
import { InprogressTransfersComponent } from './reports-page/inprogress-transfers/inprogress-transfers.component';
import { InProgressCorrespondencesComponent } from './reports-page/in-progress-correspondences/in-progress-correspondences.component';
import { DashboardComponent } from './bam-page/dashboard/dashboard.component';
import { SystemDashboardComponent } from './bam-page/system-dashboard/system-dashboard.component';
import { MasterLayoutComponent } from '../shared/master-layout/master-layout.component';
import { CompleteCorrespondencesComponent } from './reports-page/complete-correspondences/complete-correspondences.component';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'delegation',
        component: DelegationPageComponent,
      },
      {
        path: 'mail',
        component: MailPageComponent,
      },
      {
        path: 'reports',
        component: ReportsPageComponent,
      },
      {
        path: 'reports/inprogress-transfers',
        component: InprogressTransfersComponent,
      },
      {
        path: 'reports/completed-transfers',
        component: CompletedTransfersComponent,
      },
      {
        path: 'reports/inprogress-correspondences',
        component: InProgressCorrespondencesComponent,
      },
      {
        path: 'reports/completed-correspondences',
        component: CompleteCorrespondencesComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'MyMail',
        component: MymailPageComponent,
      },
      {
        path: 'Guidelines',
        component: GuidelinePageComponent,
      },
      {
        path: 'bam',
        component: BamPageComponent,
      },
      {
        path: 'bam/dashboard',
        component: DashboardComponent,
      },
      {
        path: 'bam/system-dashboard',
        component: SystemDashboardComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule { }
