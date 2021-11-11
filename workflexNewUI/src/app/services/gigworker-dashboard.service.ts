import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProviderService } from '../../app/services/provider.service';
import * as CONSTANTS_CLASS from '../constants/constants';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GigworkerDashboardService {

  constructor(private providerService : ProviderService,
    private spinner: NgxSpinnerService,
    public userService:UserService,
    public toastr: ToastrManager,
    private sanitizer : DomSanitizer,
    private router: Router) { }

  errors;
  seekersList = null;
  allJobsListLength = null;
  searchText: string;
  searchByName:string="";
  searchByLocation:string="";
  searchByminExp:string="";
  searchBymaxExp:string="";
  providerDetails:any;
  gigsList:any;
  messageNotification:string;

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getSeekersList(keyword){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    // if(isCompanySelected == true){
      this.providerService.listSeeker(keyword,this.searchByName,this.searchByLocation,this.searchByminExp,this.searchBymaxExp).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.errors = resJSON.body.response.message;
        } else {
          this.seekersList = resJSON.body.response.data;
          this.allJobsListLength = resJSON.body.response.data.length;

          var skills = [];
          var counts = {};
          var skillswithCount:string="";
   
          this.seekersList.forEach(seeker => skills.push(seeker.data.skill[0]));
           skills.forEach(skill => counts[skill] = (counts[skill]||0)+1);
   
           for(let key in counts){
             skillswithCount += key +'('+ counts[key] + ')' + " "
           }
   
           if(this.seekersList.length>0){
             this.messageNotification='Gig matching " ' + skillswithCount + '" skill/s';
           }else{
             this.messageNotification="No gig found!!!"
           }

          
          this.seekersList.forEach(element => {
            this.getIsSeekerShortlisted(element);
            this.getUserImage(element);
          });
          // if(resJSON.body.response.data.length <= 0)
          //   this.noResultExist = true;
          // else
          //   this.noResultExist = false;
        }
      }, (err) => {
        this.errors = err.errors;
      });
    // }
  }

  getProvidersList(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    this.spinner.show();
    this.providerService.listProvider(companyId, "").subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.gigsList = resJSON.body.response.data;
        let searchArray: any[] = [];
        this.gigsList.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              searchArray.push(element);
            });
          }
        });

        if(searchArray.length>0) {
          this.searchText = searchArray.join();
          this.getSeekersList(this.searchText);
        } else {
          if(localStorage.getItem('isCompanySelected') === "false" && (localStorage.getItem('companyId') === "" || localStorage.getItem('companyId') === undefined || localStorage.getItem('companyId') === null))
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_NEW_SKILL]);
        }
        // this.providerDetails = resJSON.body.response.data[0].data;
       
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.errorToastr(err.errors);
    });
  }

  getUserImage(element: any) {
    if(element.user != null && element.user != undefined){
      if(element.user.photo != undefined && element.user.photo != null && element.user.photo != ''){
        this.userService.getUserImage(element.user.photo).subscribe(data => {
          var dd = URL.createObjectURL(data);
          element.user.photo = this.sanitizer.bypassSecurityTrustUrl(dd);
          return element;
        });
      }else {
        if(element.user.gender && (element.user.gender.toUpperCase() == 'FEMALE')){
          element.user.photo = 'assets/images/defaultWomanImg.png';
        } else {
          element.user.photo = 'assets/images/defaultManImg.png';
        }
        return element;
      }
    } else {
      return element;
    }
    
  }

  getIsSeekerShortlisted(element: any) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    this.providerService.isSeekerShortlisted(element.id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.errors = resJSON.body.response.message;
      } else {
        element.isApproved = resJSON.body.response.data;
      }
    }, (err) => {
      this.errors = err.errors;
      element.isApproved = false;
    });
  }
}
