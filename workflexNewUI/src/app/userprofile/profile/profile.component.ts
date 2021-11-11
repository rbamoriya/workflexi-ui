import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public demo1TabIndex = 0;

  userDetails:any;
  gigsList:any;
  ROUTS: any = ROUTS;
  providerDetails:any;
  pDetails:any;
  skillItems:any[];
  imageSrcData: any;
  videoSrc;

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

    let redirect: string = this.sharedService.checkUserCredential('gigworker-profile');

    if(redirect) 
      return this.router.navigate([redirect]);

    this.demo1TabIndex = 0;
    this.getUserDetails();

    if(localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

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
      if(tab === "skill-experience")
        this.demo1TabIndex = 1;
      if(tab === "payment")
        this.demo1TabIndex = 2;
    }
  }

  getUserDetails() {
    this.spinner.show();
    this.userService.getUserDetails().subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      this.getProvidersList();
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.userDetails = resJSON.body.response.data;
        if(resJSON.body.response.data.photo != undefined && resJSON.body.response.data.photo != null && resJSON.body.response.data.photo != ''){
          this.getUserImage(resJSON.body.response.data.photo);
          
        } else {
          if(this.userDetails.gender == 'FeMale'){
            this.imageSrcData = 'assets/images/defaultWomanImg.png';
          } else {
            this.imageSrcData = 'assets/images/defaultManImg.png';
          }
        }
      }
      
    }, (err) => {
      this.spinner.hide();
      this.toastr.errorToastr(err.errors);
      this.getProvidersList();
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
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
        if(resJSON.body.response.data.length > 0){
          this.providerDetails = resJSON.body.response.data[0].data;
        }
        this.gigsList.forEach(element => {
          if(element.data.document)
            this.getVideoResource(element);
        });
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.errorToastr(err.errors);
    });
  }

  getVideoResource(element: any){
    this.providerService.showVideoResource('certificates', element.data.document, "provider").subscribe((res) => {
      var dd = URL.createObjectURL(res);
      element.data.document = this.sanitizer.bypassSecurityTrustUrl(dd);
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
            this.getProvidersList();//.reload();
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
    this.userService.getUserImage(name).subscribe(data => {
      var dd = URL.createObjectURL(data);
      this.imageSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
    });
  }
}
