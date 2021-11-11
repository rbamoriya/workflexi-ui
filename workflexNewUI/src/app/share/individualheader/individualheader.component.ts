import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GigworkerDashboardService } from 'src/app/services/gigworker-dashboard.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { UserService } from '../../services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { ProviderService } from 'src/app/services/provider.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-individualheader',
  templateUrl: './individualheader.component.html',
  styleUrls: ['./individualheader.component.scss']
})
export class IndividualheaderComponent implements OnInit {
  showMenu = '';
  hide ='';
  switchType:string;
  balance;
  
  constructor(private router: Router,private http: HttpClient,
    private gigworkerDashboardService: GigworkerDashboardService,
    private userService: UserService,
    public toastr: ToastrManager,
    private providerService : ProviderService,
    public sharedService : SharedService,
    private sanitizer : DomSanitizer) {
     }

  searchText: string = '';
  userDetails;
  headerSrcData: any;
  isAdmin: boolean = false;

  toggleDisplayDiv(){
    this.showMenu = 'menushow';
    this.hide = 'hide'
  };
  toggleHideDiv(){
    this.showMenu = '';
    this.hide = ''
  }
  ngOnInit() {
    this.getUserDetails();
    this.walletBalance();
    if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
        
      this.switchType = localStorage.getItem('category');
    } else {
      this.switchType = '';
    }
    if(localStorage.getItem('isCompanySelected') === "true") {
        
      this.sharedService.isCompanySelected = true;
    } else {
      this.sharedService.isCompanySelected = false;
    }
    
    const userRole = JSON.parse(localStorage.getItem('userRoles'));
    userRole.forEach(role => {
      if(role.authority == 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  searchForGigs() {
    if(this.searchText) {
      if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
        if(localStorage.getItem('category') === 'Gig Worker'){
          window.location.href = CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD + "?search=" + this.searchText;
        }else{
          window.location.href = CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD + "?search=" + this.searchText;
        }
      }
    }
  }

  viewProfile(){
    if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if(localStorage.getItem('category') === 'Gig Worker'){
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIGWORKER_PROFILE]);
      }else{
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_PROFILE]);
      }
    }
  }

  switchCategory(){
    if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if(localStorage.getItem('category') === 'Gig Worker'){
        localStorage.setItem("category", "Hirer");
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
      }else{
        localStorage.setItem("category", "Gig Worker");
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
      }
    }
  }

  changeStatus() {
    if (this.sharedService.isCompanySelected === false) {
      this.sharedService.isCompanySelected = true;
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
    } else {
      this.sharedService.isCompanySelected = false;
      localStorage.setItem("subcategory", "Individual");
      localStorage.setItem("isCompanySelected", "false");
      if(localStorage.getItem('category') === 'Gig Worker'){
        if(this.router.url == CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD){
          window.location.reload();
        }else {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
        }
       
      }else{
        if(this.router.url == CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD){
          window.location.reload();
        }else {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
        }
      }
    }
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.userDetails = resJSON.body.response.data;
        if(resJSON.body.response.data.photo != undefined && resJSON.body.response.data.photo != null && resJSON.body.response.data.photo != ''){
          this.getUserImage(resJSON.body.response.data.photo);
          
        } else {
          if(this.userDetails.gender == 'FeMale'){
            this.headerSrcData = 'assets/images/defaultWomanImg.png';
          } else {
            this.headerSrcData = 'assets/images/defaultManImg.png';
          }
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  dashboard(){
    if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if(localStorage.getItem('category') === 'Gig Worker'){

        return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
      }else{

        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
      }
    }
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  walletBalance(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    this.providerService.walletBalance(companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        //this.message = resJSON.body.response.message;
        this.balance = JSON.parse(resJSON.body.response.data).balance;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });

  }
  
  getUserImage(name: string) {
    this.userService.getUserImage(name).subscribe(data => {
      var dd = URL.createObjectURL(data);
      this.headerSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
    });
  }
  
}
