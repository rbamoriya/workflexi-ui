import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GigWorkerService {
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

  getAllGigs() {
    return this.http.get<any>(`${environment.apiEndpoint}/provider/getall`, this.httpHeaderOptions);
  }

  getGigsDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/provider/details/${id}`, this.httpHeaderOptions);
  }

  deleteGigDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/provider/delete/${id}`, this.httpHeaderOptions);
  }

  approveGigVideo(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/provider/approveUpload/${id}`, this.httpHeaderOptions);
  }

  unapproveGigVideo(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/provider/unapproveUpload/${id}`, this.httpHeaderOptions);
  }
  
}
