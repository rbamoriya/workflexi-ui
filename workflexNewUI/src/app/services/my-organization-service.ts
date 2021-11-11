import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyOrganizationService {

  _token = null;
  userId = null;
  apiEndpoint = environment.apiEndpoint;
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
  }

  isRejectExceeded(){
    return this.http.get(this.apiEndpoint+"/company/access/isRejectExceeded", this.httpHeaderOptions);
  }

  isRequestInitiated(){
    return this.http.get(this.apiEndpoint+"/company/access/isInitiated", this.httpHeaderOptions);
  }

  processRejected(){
    return this.http.get(this.apiEndpoint+"/company/access/processRejected", this.httpHeaderOptions);
  }

  assignRoleRequest(serializedForm){
    return this.http.post(this.apiEndpoint+`/company/access/create`, serializedForm, this.httpHeaderOptions);
  }

  createCompany(serializedForm){
    return this.http.post(this.apiEndpoint+`/company/create`, serializedForm, this.httpHeaderOptions);
  }

  updateCompany(serializedForm, companyId){
    return this.http.put(this.apiEndpoint+`/company/update/`+companyId, serializedForm, this.httpHeaderOptions);
  }

  getInitiatedCompanyUsers(companyId){
    return this.http.get(this.apiEndpoint+"/company/initiatedUsers/"+companyId, this.httpHeaderOptions);
  }

  processRejectedCompanyAccess(companyId){
    return this.http.get(this.apiEndpoint+"/company/assignedUsers/"+companyId, this.httpHeaderOptions);
  }

  approvalRejectRequests(serializedForm, companyId, action){
    return this.http.put(this.apiEndpoint+`/company/access/process/`+companyId+`?action=`+action, serializedForm, this.httpHeaderOptions);
  }

  unAssignUserRequests(serializedForm, companyId){
    return this.http.put(this.apiEndpoint+`/company/unAssign/`+companyId, serializedForm, this.httpHeaderOptions);
  }

  companyList(){
    return this.http.get(this.apiEndpoint+"/company/list", this.httpHeaderOptions);
  }

  public parseGoogleAddress(event) {
    const address_components = event.address_components;
    const address = {
      city: '',
      state: '',
      postalCode: ''
    };
    address_components.forEach(element => {
      if(element.types && element.types.length > 0) {
        if (element.types.indexOf('locality') > -1) {
          address.city = element.long_name;
        } else if(element.types.indexOf('administrative_area_level_1') > -1) {
          address.state = element.long_name;
        } else if(element.types.indexOf('postal_code') > -1) {
          address.postalCode = element.long_name;
        }
      }
      
    });
    return address;
  }

}
