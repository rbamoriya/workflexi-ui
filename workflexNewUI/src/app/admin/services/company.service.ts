import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  _token = null;
  userId = null;
  httpHeaderOptions = null;

  constructor( 
    private http: HttpClient,
    ) { 
      this._token = localStorage.getItem('_token');
      this.userId = localStorage.getItem('userId');
      this.httpHeaderOptions = {
  	    headers: new HttpHeaders({
  	      'Content-Type':  'application/json',
  	      'Authorization': this._token
  	    }),
        observe: 'response' as 'response'
    }
  }

  getAllCompanies() {
    return this.http.get<any>(`${environment.apiEndpoint}/company/getallCompanies`, this.httpHeaderOptions);
  }

  getCompanyData(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/company/details/${id}`, this.httpHeaderOptions);
  }

  verifyCompany(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/company/verify/${id}?action=approved`, this.httpHeaderOptions)
  }

  unverifyCompany(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/company/verify/${id}?action=unapproved`, this.httpHeaderOptions)
  }
}
