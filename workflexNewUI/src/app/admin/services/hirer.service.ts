import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HirerService {
  _token = null;
  userId = null;
  httpHeaderOptions = null;

  constructor( 
  private http: HttpClient,
  ) { 
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
    this.httpHeaderOptions = {
  	  headers: new HttpHeaders
      ({
  	    'Content-Type':  'application/json',
  	    'Authorization': this._token
  	  }),
      observe: 'response' as 'response'
    }
  }

  getAllHirer() {
    return this.http.get<any>(`${environment.apiEndpoint}/seeker/getall`, this.httpHeaderOptions);
  }

  getHirerDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/seeker/details/${id}`, this.httpHeaderOptions);
  }

  deleteHirerDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/seeker/delete/${id}`, this.httpHeaderOptions);
  }
}
