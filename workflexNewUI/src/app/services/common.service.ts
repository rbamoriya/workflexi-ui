import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  _token = null;
  userId = null;
  newUser = null;
  isEmailVerified = null;

  constructor(private http: HttpClient) {
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.newUser = localStorage.getItem('newUser');
    this.isEmailVerified = localStorage.getItem('isEmailVerified');
  }

  isAuthenticated(){
    if(this._token == null || this.userId == null){
       localStorage.clear();
      //  window.location.href = '/otp/generate?redirectUrl='+window.location.href;
       window.location.href = '/home';
    }
  }

  isProfileFilled(){
    if(this.newUser == "true" || (this.isEmailVerified != null && this.isEmailVerified != "true")){
       window.location.href = '/profile/edit?redirectUrl='+window.location.href;
    }
  }

  isEmailVerifiedByUser(){
    if(this.isEmailVerified != null && this.isEmailVerified != "true"){
       window.location.href = '/profile/edit?redirectUrl='+window.location.href;
    }
  }

  getMmDdYyyy(ddMmYyyy): string {
    if(!ddMmYyyy) {
      return ddMmYyyy;
    }
    const initial = ddMmYyyy.split(/\//);
    if(!initial || initial.length != 3) {
      return ddMmYyyy;
    }
    return [ initial[1], initial[0], initial[2] ].join('/');
  }

}
