// src/app/user.service.ts
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//! 폼을 넘겨주기위해
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import 'rxjs/add/operator/toPromise';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { User } from './user';

@Injectable()
export class UserService {

  form: FormGroup;

  private apiBaseUrl = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
  ) { }

  index(): Promise<User[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}`)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        return response.data as User[]
      })
      .catch(this.utilService.handleApiError);
  }

  show(username: string): Promise<User> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${username}`)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        return response.data as User
      })
      .catch(this.utilService.handleApiError);
  }

  create(user: User): Promise<User> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}`, user)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        return response.data as User
      })
      .catch(this.utilService.handleApiError);
  }



  update(username: string, user: User): Promise<User> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${username}`, user)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        return response.data as User
      })
      .catch(this.utilService.handleApiError);
  }

  destroy(username: string): Promise<User> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${username}`)
      .toPromise()
      .then(this.utilService.checkSuccess)
      .then(response => {
        return response.data as User
      })
      .catch(this.utilService.handleApiError);
  }
}
