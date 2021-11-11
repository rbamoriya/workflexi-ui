
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';
import { SharedService } from '../../services/shared.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';
import { MyOrganizationService } from 'src/app/services/my-organization-service';

@Component({
  selector: 'app-howtojoinus',
  templateUrl: './howtojoinus.component.html',
  styleUrls: ['./howtojoinus.component.scss']
})
export class HowtojoinusComponent implements OnInit {

  showMenu = '';
  hide ='';
  hire = '';
  valueName = '';
  valueUrl = '';
  showpage: boolean = false;
  constructor( private router: Router, private sharedService: SharedService,
    private providerService : ProviderService,
    private userService:UserService,
    private myOrganizationService :MyOrganizationService,
    public toastr: ToastrManager) { }

  toggleDisplayDiv(){
    this.showMenu = 'show';
    this.hide ='hide'


  };
  toggleDisplayDiv1(){
    this.hire = 'show';
    this.hide ='hide'

  };
  getValueAndUrl(value){
    switch(value){
      case 1 :
          // const now = new Date()
  
          // // `item` is an object which contains the original value
          // // as well as the time when it's supposed to expire
          // const item = {
          //   value: "Gig Worker",
          //   // expiry: now.getTime() + 5000,
          //   expiry: now.setTime(now.getTime() + (7 * 24 * 60 * 60 * 1000))
          // }
          // localStorage.setItem("category", JSON.stringify(item));
        localStorage.setItem("category", "Gig Worker");
        // this.valueName = 'Gig Worker';
        this.toggleDisplayDiv();
        break;

      case 2 :
        localStorage.setItem("category", "Hirer");
        // this.valueName = 'Hirer';
        this.toggleDisplayDiv();
        break;

      case 3 :
        localStorage.setItem("subcategory", "Individual");
        localStorage.setItem('isCompanySelected',"false")
        if(localStorage.getItem('category') === 'Gig Worker'){
          return this.router.navigate(['/userprofile/basicinfo']);
        }else{
          return this.router.navigate(['/hiring/basicinfo']);
        }
        break;

      case 4 :
        localStorage.setItem("subcategory", "Company");
        // localStorage.setItem("isCompanySelected", "true");
        let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
        let companyId = "";
        if(isCompanySelected == true)
          companyId = localStorage.getItem('companyId');
        if(localStorage.getItem('category') === 'Gig Worker'){
          
          if(localStorage.getItem('newUser') === null || localStorage.getItem('newUser') === 'false' || localStorage.getItem('isEmailVerified') === 'false'){
            return this.router.navigate(['/userprofile/basicinfo']);
          } else {
            if(companyId && isCompanySelected)
              return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
            else
              this.getSeekersProfilesList();
          }
        }else{
          if(localStorage.getItem('newUser') === null || localStorage.getItem('newUser') === 'false' || localStorage.getItem('isEmailVerified') === 'false'){
            return this.router.navigate(['/hiring/basicinfo']);
          } else {
            if(companyId && isCompanySelected)
              return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
            else
              this.getSeekersProfilesList();
          }
        }
      }
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getSeekersProfilesList(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.listSeekerProfiles(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        // this.seekerProfiles = resJSON.body.response.data;
        let searchArray: any[] = [];
        resJSON.body.response.data.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              
              searchArray.push(element);
            });
          }
        });
        
        if(searchArray.length>0) {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
        } else {
          this.myOrganizationService.isRequestInitiated().subscribe(() => {
            let resSTR = JSON.stringify(res);
            let resJSON = JSON.parse(resSTR);
            if(resJSON.body.response.status) {
              return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
            } else {
              return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_NEW_SKILLOOKIG]);
            }
          }, (err) => {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
          });
        }
      }
    }, (err) => {
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
    });
  }

  getUserDetailsForCheckPayment() {

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      if(localStorage.getItem('companyId') != null && localStorage.getItem('companyId') != undefined)
      companyId = localStorage.getItem('companyId');
    }

    this.providerService.listProvider(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        let gigsList = resJSON.body.response.data;
        let searchArray: any[] = [];
        gigsList.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              searchArray.push(element);
            });
          }
        });
        if(searchArray.length>0) {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
        } else{
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_SKILL]);
        }
       
      }
    }, (err) => {
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
      // this.toastr.errorToastr(err.errors);
    });
}

  ngOnInit() {
    let redirect: string = this.sharedService.checkUserCredential('inboarding');

    if(redirect)
      return this.router.navigate([redirect]);

    this.showpage = false;
    if(localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if(localStorage.getItem('category') === 'Gig Worker'){
        return this.router.navigate(['/userprofile/basicinfo']);
      }else{
        return this.router.navigate(['/hiring/basicinfo']);
      }
    } else if(localStorage.getItem('category')) {
      this.showpage = true;
      this.toggleDisplayDiv();
    }
    this.showpage = true;
  }

}
