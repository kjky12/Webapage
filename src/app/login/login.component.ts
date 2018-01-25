import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  redirectTo: string;
  errorResponse: ApiResponse;

  // form을 담는 FormGroup 타입 오브젝트입니다. 
  form: FormGroup; 
  
  //  form field들의 실제 에러메세지를 저장하는 오브젝트입니다. 이 오브젝트에 에러메세지가 있다면 html에 보여지게 됩니다
  formErrors = { 
    'username':'',
    'password':'',
  };

  // form field의 에러메세지를 미리 설정해 놓는 부분입니다. username을 살펴보면, 'required'라는 에러가 있을때 'Username is required!'라는 메세지가 표시되게 하는 것입니다. 이 'required'라는 에러 이름은 validator 에서 정해진 이름입니다. 이처럼 validator에서 정해진 에러 이름을 사용하거나 특정한 이름으로 직접 에러를 만들 수도 있습니다.
  formErrorMessages = { 
    'username': {
      'required': 'Username is required!',
    },
    'password': {
      'required': 'Password is required!',
    },
  };

  //form을 생성하는 함수입니다.
  buildForm(): void { 
    this.form = this.formBuilder.group({ 
      //formBuilder.group함수를 사용해서 form group을 생성한 후 this.form에 넣습니다.username:["", Validators.required]를 살펴보면,Form_Control_이름:[초기값, Validator_타입] 의 형태입니다.
      username:["", Validators.required],
      password:["", Validators.required],
    });

    this.form.valueChanges.subscribe(data => { 
      /* this.form(FormGroup 타입)의 .valueChange는 this.form에 값의 변화가 있는 경우 Observable을 생성합니다. 즉, form의 값변화가 감지되는 경우
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages) 가 실행됩니다.
      utilService.updateFormErrors는 this.form의 에러상태를 체크하여 this.formErrors에 this.formErrorMessages의 에러메세지를 업데이트하는 함수입니다. 
      나중에 util.service.ts의 코드에서 다시 살펴보겠습니다.*/
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private authService: AuthService,
  ) {
    this.buildForm();
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit() {
  }

  submit() { //  form이 submit되면 실행되는 함수입니다.
    // 먼저 this.utilService.makeFormDirtyAndUpdateErrors를 실행하여 form 에러메세지를 업데이트합니다
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      // login API를 호출합니다
      this.authService.login(this.form.value.username, this.form.value.password) 
      .then(data =>{
        //로그인 성공시 redirect 할 곳이 있으면 redirect하고 아니면 '/'로 보냅니다.
        this.router.navigate([this.redirectTo?this.redirectTo:'/']); 
      })
      .catch(response =>{
        this.errorResponse = response;
        //로그인 실패시 this.utilService.handleFormSubmitError를 실행하여 서버에러메세지를 업데이트합니다
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors); 
      });
    }
  }

}
