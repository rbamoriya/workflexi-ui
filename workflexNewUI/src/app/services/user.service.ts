import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = null;
  userId = null;
  apiEndpoint = environment.apiEndpoint;
  saUsername = environment.saUsername;
  saPassword = environment.saPassword;
  httpHeaderOptions = null;

  constructor(private http: HttpClient) {
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };

    this.getAuthorizationToken();
  }

  init() {
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': localStorage.getItem('_token')
  	  }),
      observe: 'response' as 'response'
    };
  }

  getAuthorizationToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(this.saUsername+':'+this.saPassword)
      }),
      observe: 'response' as 'response'
    };
    this.http.post(this.apiEndpoint+`/authenticate`, null, httpOptions).subscribe((res: HttpResponse<any>) => {
      localStorage.setItem('admin_token', res.headers.get("Authorization"));
    });
  }

  getUserDetails(){
    this.init();
    return this.http.get(this.apiEndpoint+"/user/details/"+this.userId, this.httpHeaderOptions);

  }

  getUserDetailsFromToken(){
    this.init();
    return this.http.get(this.apiEndpoint+"/user/details/", this.httpHeaderOptions);
  }

  getUserImage(name: string){
    this.init();
    return this.http.get(this.apiEndpoint+"/download/users/"+name, { headers: new HttpHeaders({
      'Authorization': this._token,
      'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'}).pipe (
      tap (
        data => {
          // consol
          //FileSaver.saveAs(data, file);
        },
        //error => console.log(error)
      )
     );
  }

  getUserImageDetail(userId) {
    this._token = localStorage.getItem('_token');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };
    return this.http.get(this.apiEndpoint+"/user/details/"+userId, this.httpHeaderOptions);
  }

  updateUserDetails(serializedForm){
    return this.http.put(this.apiEndpoint+`/user/update/`+this.userId, serializedForm, this.httpHeaderOptions);
  }

  createUser(serializedForm) {
    const httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': localStorage.getItem('admin_token')
  	  }),
      observe: 'response' as 'response'
    };
    return this.http.post(this.apiEndpoint+`/user/create`, serializedForm, httpHeaderOptions);
  }

  duplicateEmailValidation(email) {
    const userId = localStorage.getItem('userId') == null ? '' : localStorage.getItem('userId');
    const token = localStorage.getItem('_token') ? localStorage.getItem('_token'): localStorage.getItem('admin_token');
    return this.http.get(this.apiEndpoint+"/user/duplicateEmailValidation?email="+email+"&id="+userId, { headers: new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/octet-stream',
      }), observe: 'response' as 'response'});
  }

}
