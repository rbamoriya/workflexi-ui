import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  responseHeader = null;
  apiEndpoint = environment.apiEndpoint;
  saUsername = environment.saUsername;
  saPassword = environment.saPassword;

  constructor(private http: HttpClient) {
    if(this.responseHeader == null)
      this.getAuthorizationToken();
  }

  httpOptions = {
	  headers: new HttpHeaders({
	    'Content-Type':  'application/json',
	    'Authorization': 'Basic ' + btoa(this.saUsername+':'+this.saPassword)
	  }),
    observe: 'response' as 'response'
  };

  getHttpOptions(username, password) {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(username+':'+password),
        'Skip-interception': ''
      }),
      observe: 'response' as 'response'
    };
  }

  getAuthorizationToken() {
    this.http.post(this.apiEndpoint+`/authenticate`, null ,this.httpOptions).subscribe((res: HttpResponse<any>) => {
      this.responseHeader = res.headers.get("Authorization");
      localStorage.setItem('admin_token', this.responseHeader);
    });
  }

  authenticate(username, password) {
    return this.http.post(this.apiEndpoint+`/authenticate`, null ,this.getHttpOptions(username, password));
  }

  sendOtp(mobile, captchaResponse) {
    if(this.responseHeader) {
      const httpOptionsGenerate = {
    	  headers: new HttpHeaders({
    	    'Content-Type':  'application/json',
    	    'Authorization':  this.responseHeader
    	  }),
        observe: 'response' as 'response'
      };
      const obj = {
        mobile: mobile,
        response: captchaResponse
      };
      return this.http.post(this.apiEndpoint+`/otp/generate`, obj, httpOptionsGenerate);
    } else {
      return null;
    }
  }

  validateOtp(otp, mobile, _token) {
    if(this.responseHeader) {
      const httpOptionsGenerate = {
    	  headers: new HttpHeaders({
    	    'Content-Type':  'application/json',
    	    'Authorization':  this.responseHeader
    	  }),
        observe: 'response' as 'response'
      };
      const obj = {
        mobile: mobile,
        otp: otp,
        _token: _token
      };
      return this.http.post(this.apiEndpoint+`/otp/validate`, obj, httpOptionsGenerate);
    } else {
      return null;
    }
  }

  validateEmailAddress(token){
    if(this.responseHeader) {
      const httpOptionsGenerate = {
    	  headers: new HttpHeaders({
    	    'Content-Type':  'application/json',
    	    'Authorization':  this.responseHeader
    	  }),
        observe: 'response' as 'response'
      };
      const obj = {
        token: token
      };
      return this.http.post(this.apiEndpoint+`/otp/validate/email`, obj, httpOptionsGenerate);
    } else {
      return null;
    }
  }

  sendResetLink(email, captchaResponse) {
    const obj = {
      'email': email,
      'response': captchaResponse
    }

    const httpOptionsGenerate = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.responseHeader
      }),
      observe: 'response' as 'response'
    };
    return this.http.post(this.apiEndpoint+`/user/resetPassword`, obj, httpOptionsGenerate);
  }

  updatePassword(token, password) {
    const obj = {
      'token': token,
      'password': password
    }

    const httpOptionsGenerate = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.responseHeader
      }),
      observe: 'response' as 'response'
    };
    return this.http.post(this.apiEndpoint+`/user/updatePassword`, obj, httpOptionsGenerate);
  }
}
