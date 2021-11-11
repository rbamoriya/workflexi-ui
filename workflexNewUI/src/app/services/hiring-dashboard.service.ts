import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProviderService } from './provider.service';
import { SearchProviderService } from './search-provider.service';
import * as CONSTANTS_CLASS from '../constants/constants';
import { UserService } from './user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HiringDashboardService {

  constructor(private providerService : ProviderService,
    private spinner: NgxSpinnerService,
    private searchProviderService: SearchProviderService,
    public toastr: ToastrManager,
    public userService:UserService,
    private sanitizer : DomSanitizer,
    private router: Router) { }

  errors;
  public isShowMoreCollcetion: boolean = false;
  gigsList: any[] = [];
  gigsListLength = null;
  searchText: string="";
  currentPage: number;
  seekerProfiles = null;
  searchByName:string="";
  searchByLocation:string="";
  searchByminExp:string="";
  searchBymaxExp:string="";
  messageNotification:string="";

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  searchForGigs(isLoadMore: boolean, page: number) {
    this.searchProviderService.searchGigs(this.searchText,this.searchByName,this.searchByLocation, this.searchByminExp,this.searchBymaxExp,page).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if(page == 1){
          this.gigsList= [];
        }
        
        resJSON.body.response.data.forEach(element => {
          this.getUserImage(element);
          this.gigsList.push(element);
        });

       var skills = [];
       var counts = {};
       var skillswithCount:string="";

       this.gigsList.forEach(gig => skills.push(gig.data.skill[0]));
        skills.forEach(skill => counts[skill] = (counts[skill]||0)+1);

        for(let key in counts){
          skillswithCount += key +'('+ counts[key] + ')' + " "
        }

        if(this.gigsList.length>0){
          this.messageNotification='Gig workers matching " ' + skillswithCount + '" skill/s';
        }else{
          this.messageNotification="No gig workers found!!!"
        }

        if(resJSON.body.response.page)
          this.currentPage = resJSON.body.response.page;

        if(resJSON.body.response.page === null) {
          this.isShowMoreCollcetion = false;
        }

        if(resJSON.body.response.totalPages > page)
          this.isShowMoreCollcetion = true;
        else 
          this.isShowMoreCollcetion = false;

        if(resJSON.body.response.totalPages) {
          this.gigsListLength = resJSON.body.response.totalPages*10;
          if(this.gigsListLength<10)
            this.gigsListLength = this.gigsList.length;
        }

        this.gigsList.forEach(element => {
          this.getIsProviderApplied(element);
        });
        // this.pageCount = resJSON.body.response.totalPages;
        // this.totalPages = Array.from({length: resJSON.body.response.totalPages}, (v, k) => k + 1);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getIsProviderApplied(element: any){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }

    this.providerService.isProviderApplied(element.id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.errors = resJSON.body.response.message;
      } else {
        element.isApproved = resJSON.body.response.data;
      }
    }, (err) => {
      element.isApproved = false;
    });
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
        this.seekerProfiles = resJSON.body.response.data;
        let searchArray: any[] = [];
        resJSON.body.response.data.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              
              searchArray.push(element);
            });
          }
        });
        if(searchArray.length>0) {
          this.searchText = searchArray.join();
          this.searchForGigs(false, this.currentPage);
        } else {
          //console.log(localStorage.getItem('isCompanySelected'));
          //console.log(localStorage.getItem('companyId'));
          if(localStorage.getItem('isCompanySelected') === "false" && (localStorage.getItem('companyId') === "" || localStorage.getItem('companyId') === undefined || localStorage.getItem('companyId') === null) ){
            this.messageNotification = "You have not posted any gig.It is showing all the available Gig Worker/s. Use the search bar to look for skills"
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_NEW_SKILLOOKIG]);
          }
            
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  /**
   * Load more
   */
  onScroll() {
    if(this.isShowMoreCollcetion)
      this.searchForGigs(true, Number(this.currentPage) + 1);
    
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
        if(element.user.gender == 'FeMale'){
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
}
