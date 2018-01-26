
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { ApiResponse } from './api-response';
import { FormGroup } from '@angular/forms';

@Injectable()
export class UtilService {
  public checkSuccess(response: any): Promise<any> { // checkSuccess 함수는 api return field 중 success 항목이 false인 경우 api가 실패한 것과 동일하게 reject를 보내는 함수입니다.
    if (response.success)
      return Promise.resolve(response);
    else return Promise.reject(response);
  }

  public handleApiError(error: any): Promise<any> { // handleApiError 함수는 api에 error가 있는 경우에 production 환경이 아닌 경우 브라우저에 error를 표시하는 함수입니다.
    if (!environment.production)
      console.error('An error occurred', error);
    return Promise.reject(error);
  }


  public updateFormErrors(form: FormGroup, formErrors: any, formErrorMessages: any) { //1
    if (!form) {
      return;
    }

    for (const field in formErrors) {
      formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = formErrorMessages[field];
        if (messages) {
          for (const key in control.errors) {
            formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  public makeAllFormFieldsDirty(form: FormGroup) { //2
    if (!form) {
      return;
    }

    for (var field in form.controls) {
      const control = form.get(field);
      if (control)
        control.markAsDirty();
    }
  }

  public makeFormDirtyAndUpdateErrors(form: FormGroup, formErrors: any, formErrorMessages: any) { //3
    this.makeAllFormFieldsDirty(form);
    this.updateFormErrors(form, formErrors, formErrorMessages);
  }

  public handleFormSubmitError(response: ApiResponse, form: FormGroup, formErrors: any): void { //4
    if (response.errors) {
      for (const field in formErrors) {
        const control = form.get(field);
        if (response.errors[field] && response.errors[field].message) {
          formErrors[field] += response.errors[field].message;
        }
      }
      if (response.errors.unhandled) {
        response.message += response.errors.unhandled;
      }
    }
  }

}