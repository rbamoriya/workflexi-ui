import { Component, OnInit } from '@angular/core';
import { OtpService } from '../../app/auth/login/OtpService';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as CONSTANTS_CLASS from '../../app/constants/constants';

@Component({
  selector: 'app-email-validate',
  templateUrl: './email-validate.component.html',
  styleUrls: ['./email-validate.component.scss']
})
export class EmailValidateComponent implements OnInit {

 
  errors;
  message;
  urlParams = null;

  public href: string = "";
  url: string = "";

  constructor(private http: HttpClient,
    private otpService : OtpService,
    public activatedRoute:ActivatedRoute,
    public toastr: ToastrManager,
    private router: Router) { }

  ngOnInit() {
    this.otpService.getAuthorizationToken();
    setTimeout(()=>{ this.validateEmailAddress(); }, 3000);
    this.urlParams = new URLSearchParams(window.location.search);
  }

  validateEmailAddress(){
    // let id : string = this.activatedRoute.snapshot.paramMap.get('id');
    this.otpService.validateEmailAddress(window.location.pathname.split("/").pop().replace("%2B", " ")).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
        this.router.navigate([CONSTANTS_CLASS.ROUTS.AUTH_LOGIN]);
      } else {
          this.toastr.successToastr(resJSON.body.response.message);
          localStorage.setItem('isEmailVerified', 'true');
          this.router.navigate([CONSTANTS_CLASS.ROUTS.AUTH_INBOARDING]);
          // if(this.urlParams.get('redirectUrl')){
          //     window.location.href = this.urlParams.get('redirectUrl');
          // } else {
          //     this.router.navigate(['/dashboard']);
          // }
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

}
