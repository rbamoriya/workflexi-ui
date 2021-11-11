import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchProviderService {

  responseHeader = null;
  apiEndpoint = environment.apiEndpoint;
  httpHeaderOptions = null;

  constructor(private http: HttpClient) {
    this.httpHeaderOptions = {
      headers: new HttpHeaders({
        'Allow': "*",
        'Content-Type': "application/json; charset=utf-8",
        'Access-Control-Allow-Origin': '*',
        'Allow-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': "Origin, X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization"
      }),
      observe: 'response' as 'response'
    };
  }

  init() {
    this.httpHeaderOptions = {
      headers: new HttpHeaders({
        'Allow': "*",
        'Content-Type': "application/json; charset=utf-8",
        'Access-Control-Allow-Origin': '*',
        'Allow-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': "Origin, X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization"
      }),
      observe: 'response' as 'response'
    };
  }

  searchGigs(searchText,name,location,minExp,maxExp,page) {
    this.init();
    return this.http.get(this.apiEndpoint + `/provider/search?keyword=` + searchText + 
              `&name=`+name + `&location=`+location+
              `&minExperience=`+minExp + `&maxExperience=`+maxExp + `&page=`+page, this.httpHeaderOptions);
  }
}
