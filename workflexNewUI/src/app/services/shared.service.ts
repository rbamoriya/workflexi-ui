import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import * as CONSTANTS_CLASS from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private userService: UserService,
    private router: Router) { }

  isCompanySelected = false;

  checkUserCredential(page: string) {

    if(!localStorage.getItem('_token') || !localStorage.getItem('userId') || !localStorage.getItem('userRoles')) {
      return '/auth/login';
    }
    switch (page) {
      case 'login':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return;
        } 
        return '/auth/inboarding';

      case 'hiring-dashboard':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        } 
        return;

      case 'inboarding':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return;
        } 
        return;

      case 'basicinfo':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        }
        return;

      case 'home':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '';
        }
        return;
        
      case 'hiringinfo':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        }
        return;

      case 'gigworker-dashboard':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        }
        return;

      case 'skills':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        }
        return;

      case 'payments':
        
        if(!localStorage.getItem('category') || !localStorage.getItem('subcategory')) {
          return '/auth/inboarding';
        }
        return;
    
    }
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        return false;
      } else {
        if(!resJSON.body.response.data.name || !resJSON.body.response.data.email || resJSON.body.response.data.email === "" || resJSON.body.response.data.name === "") {
          return true;
        }
        return false;
      }
    }, (err) => {
      return false;
    });
  }
}
