import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OtpService } from './OtpService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { environment } from './../../../environments/environment';

declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('mobile', { static: false }) mobileEle: ElementRef| undefined;;
  @ViewChild('otp', { static: false }) otpEle: ElementRef| undefined;;

  googleRecaptchaSiteKey = environment.reCaptchaSiteKey;

  errors;
  otpErrors;
  data;
  message;
  url = null;
  _token = null;
  mobile = null;
  usernameModel;
  isGenerate = true;
  isValidate = false;
  isForgotPassword = false;
  loginAsCompany = false;
  isSetInetrval = false;
  loopTime = "60";
  isEmailDuplicate = false;

  angForm: FormGroup;
  validateForm: FormGroup;

  matcher = {
    isErrorState: () => {
      return this.isEmailDuplicate; 
    }
  };

  constructor(private fb: FormBuilder,
    private otpService: OtpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    public userService: UserService,
    public toastr: ToastrManager,
    private cd: ChangeDetectorRef) {
    this.createForm();
    this.createValidateForm();
  }

  createForm() {
    this.angForm = this.fb.group({
      mobile: ['', Validators.required]
    });
  }

  createValidateForm() {
    this.validateForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRecaptcha('recaptcha-container-send-otp');
    let redirect: string = this.sharedService.checkUserCredential('login');

    if (redirect)
      return this.router.navigate([redirect]);

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.activatedRoute.snapshot.fragment)
        this.url = params['redirectUrl'] + "#" + this.activatedRoute.snapshot.fragment;
      else
        this.url = params['redirectUrl'];
    });
  }
  ngAfterContentInit() {
    this.cd.detectChanges();
    setTimeout(() => {
      this.mobileEle.nativeElement.focus();
    }, 500);
  }

  sendOtp(mobile) {
    const response = grecaptcha.getResponse();
    if(!response) {
      this.toastr.errorToastr("Please verify Captcha and click Generate OTP");
      return;
    }
    this.otpService.sendOtp(mobile, response).subscribe((res) => {
      grecaptcha.reset();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);

      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this._token = resJSON.body.response.data._token;
        this.mobile = mobile;
        this.isGenerate = false;
        this.isValidate = true;
        setTimeout(() => {
          this.otpEle.nativeElement.focus();
          this.loadRecaptcha('recaptcha-container-resend-otp');
        }, 500);
      }
    }, (err) => {
      this.errors = err.errors;
      grecaptcha.reset();
    });
  }

  validateOtp(otp) {
    this.otpService.validateOtp(otp, this.mobile, this._token).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);

      if (!resJSON.body.response.status) {
        if (resJSON.body.response.message == "Token is invalid. Please try again.") {
          this.message = null;
          this.isGenerate = true;
          this.isValidate = false;
        } else {
          this.message = null;
          this.toastr.errorToastr(resJSON.body.response.message);
        }
      } else {
        this.otpErrors = null;
        this.toastr.successToastr(resJSON.body.response.message);
        localStorage.setItem('_token', res.headers.get("Authorization"));
        localStorage.setItem('userId', resJSON.body.response.data.userId);
        localStorage.setItem('name', resJSON.body.response.data.name);
        localStorage.setItem('userRoles', JSON.stringify(resJSON.body.response.data.userRole));
        localStorage.setItem("isEmailVerified", resJSON.body.response.data.isEmailVerified);

        if (resJSON.body.response.data.newUser != undefined && resJSON.body.response.data.newUser) {
          localStorage.setItem('newUser', resJSON.body.response.data.newUser);
        } else {
          localStorage.setItem('newUser', null);
        }

        if (resJSON.body.response.data.companyId != undefined) {
          localStorage.setItem('companyId', resJSON.body.response.data.companyId);
          localStorage.setItem('company', resJSON.body.response.data.company);
        }
        if (resJSON.body.response.data.companyId != undefined && resJSON.body.response.data.companyId != "") {
          localStorage.setItem("isCompanySelected", "true");
        }

        return this.router.navigateByUrl('/auth/inboarding');
        // if(!resJSON.body.response.data.newUser && resJSON.body.response.data.isEmailVerified){
        //   var urlParams = new URLSearchParams(window.location.search);
        //   if(this.url != null){
        //     window.location.href = this.url;
        //   } else {
        //     if(urlParams.get('redirectUrl')){
        //         window.location.href = urlParams.get('redirectUrl');
        //     } else {
        //         window.location.href = '/auth/inboarding';
        //     }
        //   }
        // } else {
        //   if(this.url != null)
        //     window.location.href = '/profile/edit?redirectUrl='+this.url;
        //   else
        //     window.location.href = '/profile/edit';
        // }
      }
    }, (err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 500 || err.status == 403) {
          this.otpErrors = null;
          this.message = null;
          this.errors = "Re-enter the mobile number";
          this.isGenerate = true;
          this.isValidate = false;
        }
      }
    });
  }

  loginAsCompanyCheck($event) {
    if ($event.checked) {
      this.loginAsCompany = true;
    } else {
      this.loginAsCompany = false;
    }
  }

  showGenerateDiv() {
    this.message = null;
    this.isGenerate = true;
    this.isValidate = false;
    this.loadRecaptcha('recaptcha-container-send-otp');
  }

  reSendOtp() {
    const response = grecaptcha.getResponse();
    if(!response) {
      this.toastr.errorToastr("Please verify Captcha and click Resend OTP");
      return;
    }

    this.otpService.sendOtp(this.mobile, response).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);

      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this._token = resJSON.body.response.data._token;
      }
      grecaptcha.reset();
    }, (err) => {
      this.errors = err.errors;
      grecaptcha.reset();
    });
  }

  register() {
    localStorage.setItem('new_email_user', 'true');
    this.router.navigate(['/userprofile/basicinfo']);
  }

  login(username, password) {
    this.otpService.authenticate(username, password).subscribe((res: HttpResponse<any>) => {
      localStorage.setItem('_token', res.headers.get("Authorization"));
      this.userService.getUserDetailsFromToken().subscribe((userData: any) => {
        this.otpErrors = null;
        localStorage.setItem('userId', userData.body.response.data.id);
        localStorage.setItem('name', userData.body.response.data.name);
        const userRoles = userData.body.response.data.userRole ? userData.body.response.data.userRole : userData.body.response.data.roles;
        localStorage.setItem('userRoles', JSON.stringify(userRoles));
        localStorage.setItem("isEmailVerified", userData.body.response.data.isEmailVerified);
        localStorage.setItem('newUser', null);
        if (userData.body.response.data.company) {
          localStorage.setItem('companyId', userData.body.response.data.company.id);
          localStorage.setItem('company', userData.body.response.data.company.companyName);
          if (userData.body.response.data.company.id) {
            localStorage.setItem("isCompanySelected", "true");
          }
        }
        return this.router.navigateByUrl('/auth/inboarding');
      })
    }, (err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 403 || err.status == 401) {
          this.message = null;
          this.toastr.errorToastr('Incorrect username and password combination');
        }
      }
    });
  } 

  forgotPassword() {
    this.isForgotPassword = true;
    this.isGenerate = false;
    this.isValidate = false;
    this.isEmailDuplicate = false;
    grecaptcha.reset();
    this.loadRecaptcha('recaptcha-container-send-reset-link');
  }

  sendResetPasswordLink(email) {
    const response = grecaptcha.getResponse();
    if(!response) {
      this.toastr.errorToastr("Please verify Captcha and click Send button");
      return;
    }
    this.otpService.sendResetLink(email, response).subscribe((resJSON: HttpResponse<any>) => {
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
      }
      grecaptcha.reset();
    });
  }

  validateEmail(email) {
    this.isEmailDuplicate = false;
    this.userService.duplicateEmailValidation(email)
    .subscribe(resp => {
      let resSTR = JSON.stringify(resp);
      let resJSON = JSON.parse(resSTR);
      const count = resJSON.body.response.count;
      if(!count) {
        return;
      }
      if(count > 1) {
        this.isEmailDuplicate = true;
      }
    })
  }

  loadRecaptcha(elementId) {
    let thisRef = this;
    grecaptcha.ready(function() {
      grecaptcha.render(elementId, {
        "sitekey": thisRef.googleRecaptchaSiteKey
      });
    });
  }
}
