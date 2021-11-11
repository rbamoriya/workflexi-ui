import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { ProviderService } from '../../services/provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTS } from '../../constants/constants';
import { ImageFiles } from '../../models/image-files.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  constructor(private router: Router,
    public toastr: ToastrManager,
    public activatedRoute:ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService,
    private providerService : ProviderService,
    private spinner: NgxSpinnerService,
    private sanitizer : DomSanitizer) { 
  }

  ROUTS: any = ROUTS;
  showPage: boolean = false;
  providerDetails: any;
  pDetails:any;
  videoSrc;
  id:any;
  userDetails:any;
  new:boolean = false;
  isGigApplied = false;
  errors;
  profileImgSrcData: any;

  ngOnInit() {
    let id : string = this.activatedRoute.snapshot.paramMap.get('id');
    if(id === undefined || id === null){
      this.router.navigate([ROUTS.GIGWORKER_PROFILE]);
    } 
    this.id = id;
    this.getProviderDetails('gig',this.id);
    this.getIsProviderApplied();
  }

  getProviderDetails(type, id){
    this.providerService.providerDetails(id, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.pDetails = resJSON.body.response.data[0];
        this.getUserImage(this.pDetails);
        if(this.pDetails.isApproved && this.pDetails.data.document != undefined && this.pDetails.data.document != null)
          this.getVideoResource(this.pDetails.data.document);
        
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getVideoResource(fileName){
    this.providerService.showVideoResource('certificates', fileName, "provider").subscribe((res) => {
      var dd = URL.createObjectURL(res);
      this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(dd);
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getIsProviderApplied(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }

    this.providerService.isProviderApplied(this.id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.isGigApplied = resJSON.body.response.data;
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  applyGig(id) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    this.providerService.applyForGig(id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this.isGigApplied = true;
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
          this.profileImgSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        });
        
      } else {
        if(seekerDetails.user.gender == 'FeMale'){
          this.profileImgSrcData = 'assets/images/defaultWomanImg.png';
        } else {
          this.profileImgSrcData = 'assets/images/defaultManImg.png';
        }
      }

    } else {

      if(seekerDetails.company != undefined && seekerDetails.company != null && seekerDetails.company != ''){
          this.profileImgSrcData = 'assets/images/defaultCompanyImg.png';
      }

    }
  }
}
