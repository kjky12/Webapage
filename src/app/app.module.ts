import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //*
import { HttpClientModule } from '@angular/common/http'; 



import { AppRouteModule }    from './app-route.module';

import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { RequestInterceptor } from './request-interceptor.service';
import { UserService } from './user.service'; 


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorpageComponent,
    LoginComponent,
    UserNewComponent
  ],
  imports: [
    BrowserModule,
    AppRouteModule,
    HttpClientModule, //1
    FormsModule, //
    ReactiveFormsModule, //
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    }, 
    UtilService,
    AuthService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
