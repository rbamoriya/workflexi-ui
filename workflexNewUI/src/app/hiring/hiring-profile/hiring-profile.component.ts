import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../app/services/shared.service';
import { UserService } from '../../../app/services/user.service';
import { ImageFiles } from '../../models/image-files.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProviderService } from '../../../app/services/provider.service';
import { ROUTS } from '../../../app/constants/constants';
import swal from 'sweetalert2';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from './../../services/utils.service';

@Component({
  selector: 'app-hiring-profile',
  templateUrl: './hiring-profile.component.html',
  styleUrls: ['./hiring-profile.component.scss']
})
export class HiringProfileComponent implements OnInit {

  public demo1TabIndex = 0;
  userDetails:any;
  gigsList:any;
  ROUTS: any = ROUTS;
  providerDetails:any;
  pDetails:any;
  skillItems:any[];
  seekerProfiles = null;
  isGigSeekerProfileExist = false;
  isPassionSeekerProfileExist = false;
  hirerImgSrcData: any;

  constructor(public toastr: ToastrManager,
    private router: Router, 
    private providerService : ProviderService,
    private sharedService: SharedService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute,
    public utilService: UtilsService,
    private sanitizer : DomSanitizer) { }

  ngOnInit() {

    let redirect: string = this.sharedService.checkUserCredential('hiring-profile');

    if(redirect) 
      return this.router.navigate([redirect]);

    this.demo1TabIndex = 0;
    if(localStorage.getItem('category') === 'Gig Worker')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);

    if(localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    if(localStorage.getItem('subcategory') === "Company" && !companyId && !isCompanySelected)
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
    
    let tab = this.activatedRoute.snapshot.queryParams['tab'];
    if(tab) {
      // Remove query params
      this.router.navigate([], {
        queryParams: {
          'tab': null,
        },
        queryParamsHandling: 'merge'
      });
      if(tab === "skill-looking")
        this.demo1TabIndex = 1;
    }

    this.getUserDetails();
    this.getSeekersProfilesList();
  }

  getUserDetails() {
    this.spinner.show();
    this.userService.getUserDetails().subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.userDetails = resJSON.body.response.data;
        this.getUserImage(resJSON.body.response.data.photo);
      }
      
    }, (err) => {
      this.spinner.hide();
      this.toastr.errorToastr(err.errors);
    });
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
        this.seekerProfiles = resJSON.body.response.data;
        for (let item of this.seekerProfiles) {
          if (item.type === "gig") {
              this.isGigSeekerProfileExist = true;
          }
          if (item.type === "passion") {
             this.isPassionSeekerProfileExist = true;
          }
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  delete(id, type){
    swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover skill!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        
        let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
        let companyId = "";
        if(isCompanySelected == true)
          companyId = localStorage.getItem('companyId');
        this.providerService.delete(type, id, companyId).subscribe((res) => {
          let resSTR = JSON.stringify(res);
          let resJSON = JSON.parse(resSTR);
          if(!resJSON.body.response.status) {
            this.toastr.errorToastr(resJSON.body.response.message);
          } else {
            this.toastr.successToastr(resJSON.body.response.message);
            this.getSeekersProfilesList();//.reload();
          }
        }, (err) => {
          this.toastr.errorToastr(err.errors);
        });
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === swal.DismissReason.cancel) {
        
      }
    })
    
  }

  getUserImage(name: string) {
    if(name != null && name != undefined && name != ''){
      this.userService.getUserImage(name).subscribe(data => {
        var dd = URL.createObjectURL(data);
        this.hirerImgSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
      });
    } else {
      if(this.userDetails.gender == 'FeMale'){
        this.hirerImgSrcData = 'assets/images/defaultWomanImg.png';
      } else {
        this.hirerImgSrcData = 'assets/images/defaultManImg.png';
      }
    }
  }

}
