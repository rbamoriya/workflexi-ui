import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeekerService extends BaseService{

  _token = null;
  userId = null;
  apiEndpoint = environment.apiEndpoint;
  httpHeaderOptions = null;
  
  constructor(private http: HttpClient) {
    super();
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    };
  }

  private getHttpHeaderOptionsWithAdminToken(): any {
    return {
  	  headers: new HttpHeaders({
  	    'Content-Type':  'application/json',
  	    'Authorization': localStorage.getItem('admin_token')
  	  }),
      observe: 'response' as 'response'
    };
  }

  createSeeker(data, useAdminToken = false){
    const httpHeaderOptions = useAdminToken ? this.getHttpHeaderOptionsWithAdminToken() :  this.httpHeaderOptions;
    return this.http.post(this.apiEndpoint+`/seeker/create`, data, httpHeaderOptions);
  }

  getSeekerId(companyId){
    return this.http.get(this.apiEndpoint+`/seeker/getSeekerId?companyId=`+this.sanitizeParameter(companyId), this.httpHeaderOptions);
  }

  updateSeeker(serializedForm, seekerId){
    return this.http.put(this.apiEndpoint+`/seeker/update/`+seekerId, serializedForm, this.httpHeaderOptions);
  }

}
