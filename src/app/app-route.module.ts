import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { HomeComponent } from './home/home.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';

import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component'; //*
import { UserIndexComponent } from './user-index/user-index.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users/new', component: UserNewComponent },
  {
    path: 'users', canActivate: [AuthGuard], //1
    children: [
      { path: '', component: UserIndexComponent },
    ]
  },
  { path: '**', component: ErrorpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule { }