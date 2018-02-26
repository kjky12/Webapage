
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { User } from './user';

@Injectable()
export class AuthService {
  //private apiBaseUrl = `${environment.apiBaseUrl}/login`;
  private apiBaseUrl = `${environment.apiBaseUrl}`;
  //private apiBaseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private utilService: UtilService,
  ) { }

  login(username: string, password: string): Promise<any> { //  login 함수: api call이 성공하면 data(발급된 token)를 localStorage에 'token'으로 저장(여기1)합니다.
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/login`, { username: username, password: password })
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        //! [20180216 kjky12 ]뭔가 성고메세지를 보내서 여기까지 들어는 왓어
        localStorage.setItem('token', response.data); //1-1
      })
      .catch(this.utilService.handleApiError);
  }


  me(): Promise<User> { //me 함수: api call이 성공하면 data(user 정보)를 문자열로 변환한 후 localStorage에 'currentUser'로 저장(여기2-1)하고 data를 User로 return(여기2-2)합니다. 만약 api call이 실패하면 logout(여기2-3)합니다.
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/me`)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.data)); //여기2-1
        return response.data as User //여기2-2
      })
      .catch(response => {
        this.logout(); //여기2-3
        return this.utilService.handleApiError(response);
      });
  }

  refresh(): Promise<any> { // refresh 함수: api call이 성공하면 data(새로 발급된 token)를 localStorage에 'token'으로 저장(여기3-1)합니다. 만약 currentUser가 없다면 me함수를 호출(여기3-2)합니다. api call이 실패하면 logout(여기3-3)합니다.
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/refresh`)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        localStorage.setItem('token', response.data); //여기3-1
        if (!this.getCurrentUser()) return this.me(); //여기3-2
      })
      .catch(response => {
        this.logout(); //여기3-3
        return this.utilService.handleApiError(response);
      });
  }

  getToken(): string { //getToken 함수: localStorage에서 token을 찾아 return합니다
    return localStorage.getItem('token');
  }

  getCurrentUser(): User { //getCurrentUser 함수: localStorage에서 currentUser를 찾아 JSON으로 변경 한 후 User로 return합니다.
    return JSON.parse(localStorage.getItem('currentUser')) as User;
  }

  isLoggedIn(): boolean { //isLoggedIn 함수: localStorage에 token이 있으면 true를, 아니면 false를 return합니다.
    var token = localStorage.getItem('token');
    if (token)
      return true;
    else
      return false;
  }

  logout(): void { //logout 함수: localStorage에 token과 currentUser를 지우고 '/'페이지로 이동합니다.
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}