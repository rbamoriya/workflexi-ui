import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { ProviderService } from '../../services/provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTS } from '../../constants/constants';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gig-candidate-profile',
  templateUrl: './gig-candidate-profile.component.html',
  styleUrls: ['./gig-candidate-profile.component.scss']
})
export class GigCandidateProfileComponent implements OnInit {

  constructor(private router: Router,
    public toastr: ToastrManager,
    public activatedRoute:ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
    private providerService : ProviderService,
    private sanitizer : DomSanitizer,
    private spinner: NgxSpinnerService) { 
  }

  id:any;
  seekerDetails:any;
  isSeekerShortlisted = false;
  errors;
  userImgSrc;

  ngOnInit() {
    let id : string = this.activatedRoute.snapshot.paramMap.get('id');
    if(id === undefined || id === null){
      this.router.navigate([ROUTS.GIGWORKER_PROFILE]);
    } 
    this.id = id;
    this.getSeekerDetails(this.id);
    this.getIsSeekerShortlisted();
  }


  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getSeekerDetails(seekerId){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    // if(isCompanySelected == true){
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    
    this.providerService.seekerDetails(seekerId, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        let seekerDetails = resJSON.body.response.data[0];
        this.seekerDetails = seekerDetails;
        console.log(seekerDetails);
        this.getUserImage(this.seekerDetails);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  shortlistSeeker(id){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    // if(isCompanySelected == true){
      this.providerService.shortlistSeeker(id, companyId).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          this.isSeekerShortlisted = true;
        }
      }, (err) => {
        this.errors = err.errors;
      });
    // }
  }

  getIsSeekerShortlisted() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    this.providerService.isSeekerShortlisted(this.id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.isSeekerShortlisted = resJSON.body.response.data;
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getUserImage(seekerDetails:any) {

    if(seekerDetails.user != null && seekerDetails.user != undefined){

      if(seekerDetails.user.photo != undefined && seekerDetails.user.photo != null && seekerDetails.user.photo != ''){
        this.userService.getUserImage(seekerDetails.user.photo).subscribe(data => {
          var dd = URL.createObjectURL(data);
          this.userImgSrc = this.sanitizer.bypassSecurityTrustUrl(dd);
        });
        
      } else {
        if(seekerDetails.user.gender == 'FeMale'){
          this.userImgSrc = 'assets/images/defaultWomanImg.png';
        } else {
          this.userImgSrc = 'assets/images/defaultManImg.png';
        }
      }

    } else {

      if(seekerDetails.company != undefined && seekerDetails.company != null && seekerDetails.company != ''){
          this.userImgSrc = 'assets/images/defaultCompanyImg.png';
      }

    }
  }

}
