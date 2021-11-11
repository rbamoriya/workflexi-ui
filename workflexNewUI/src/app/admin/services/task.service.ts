import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
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

  getAllTask() {
    return this.http.get<any>(`${environment.apiEndpoint}/milestone/getallMilestone`, this.httpHeaderOptions);
  }

  getTaskDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/milestone/details/${id}`, this.httpHeaderOptions);
  }

  deleteTaskDetails(id) {
    return this.http.get<any>(`${environment.apiEndpoint}/milestone/delete/${id}`, this.httpHeaderOptions);
  }
}
