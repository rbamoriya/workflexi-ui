import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  _token = null;
  userId = null;
  constructor(private http: HttpClient) {
    this._token = localStorage.getItem('_token');
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    if(this._token != null && this.userId != null){
       localStorage.clear();
      // localStorage.removeItem("_token");
      // localStorage.removeItem("userId");
      // localStorage.removeItem("name");
      // localStorage.removeItem("userRoles");
      // localStorage.removeItem("isEmailVerified");
      // localStorage.removeItem("newUser");
      // localStorage.removeItem("companyId");
      // localStorage.removeItem("company");
      // localStorage.removeItem("isCompanySelected");
       window.location.href = '/home';
    }
  }

}
