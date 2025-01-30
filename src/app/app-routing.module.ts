import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Modules/auth/login-page/login-page.component';
import { MasterLayoutComponent } from './Modules/shared/master-layout/master-layout.component';
import { AuthGuard } from './Modules/auth/auth.guard';

const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'landing',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Modules/landing/landing.module').then(
            (module) => module.LandingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
