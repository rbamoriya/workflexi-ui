import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import {NgbModal, NgbDatepickerConfig, ModalDismissReasons, NgbDateStruct, NgbDateParserFormatter, NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ProviderService } from '../../services/provider.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from '../../services/popup.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-milestone-approval-view',
  templateUrl: './milestone-approval-view.component.html',
  styleUrls: ['./milestone-approval-view.component.scss']
})
export class MilestoneApprovalViewComponent implements OnInit {
  
  userRoles;
  userId;
  companyId;
  isCompanySelected;
  isMilestoneExist;
  gigProcessId;
  milestoneData;
  isDisabledDates = "false";
  userType = null;
  userOrCompanyType = "Individual";
  providerName;
  todaysDate;
  disableApprovalButton:boolean = false;
  model: NgbDateStruct;
  url: string = "";
  imageSrcData: any;

  constructor(private commonService : CommonService, 
    private providerService : ProviderService, 
    private router: Router, 
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public popupService : PopupService,
    private userService:UserService,
    public toastr: ToastrManager) {
    this.commonService.isAuthenticated();
    this.userRoles = localStorage.getItem('userRoles');
    this.userId = localStorage.getItem('userId');
    this.companyId = localStorage.getItem('companyId');
    this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));

  }

  ngOnInit() {
    let userId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.userId = userId;
    if(!userId || userId === '') {
      if(localStorage.getItem('category') === 'Gig Worker')
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
      else
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
    }
    this.milestoneData=undefined;
    this.checkIfMilestoneExist();
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  isCompanySelectedFlag() {
    return this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
  }

  formatDate(date) {
    var d = date.split("/");
    return [d[0],d[1],d[2]].join('-');
  }


  public createTrustedHtml(blogContent: string) {
    return this.sanitizer.bypassSecurityTrustHtml(blogContent);
  }

  checkIfMilestoneExist(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {
      "appliedProviderId": this.userId
    };

    this.providerService.checkIfMilestoneExist(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.gigProcessId = resJSON.body.response.gigProcessId;
        this.userType = resJSON.body.response.userType;
        this.providerName = resJSON.body.response.providerName;
        console.log(resJSON.body.response);
        if(resJSON.body.response.data == null || resJSON.body.response.data == undefined){
          this.isMilestoneExist = "false";
          this.milestoneData = null;
        } else {
          this.isMilestoneExist = "true";
          this.milestoneData = resJSON.body.response.data;
          this.getUserImage(this.milestoneData.gigProcess);

          if(this.milestoneData.isNew == true && (this.milestoneData.approvedMilestones == null || this.milestoneData.approvedMilestones == "")){
          } else {
            if(this.userType == 'provider' && (this.milestoneData.approvedMilestones == null || this.milestoneData.approvedMilestones == "")){
              this.isMilestoneExist = "false";
            }

            if(this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones)){
              this.disableApprovalButton = true;
            } else {
              this.disableApprovalButton = false;
            }
          }
          
          if(this.milestoneData.gigProcess.company != null){
            this.userOrCompanyType = this.milestoneData.gigProcess.company.companyName;
          } else {
            this.userOrCompanyType = this.milestoneData.gigProcess.user.name;
          }

          this.isDisabledDates = "true";
          this.todaysDate = new Date();

          if(this.userType == 'seeker' && resJSON.body.response.isProcessed != null && resJSON.body.response.isProcessed == false && !this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones) && this.milestoneData.reason != undefined){
            this.toastr.errorToastr("Reject reason: "+this.milestoneData.reason);
          } 
          
          if(this.userType == "provider" && this.milestoneData.isApproved == false && this.milestoneData.approvedMilestones != null && !this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones) && resJSON.body.response.milestoneAudit != null && resJSON.body.response.milestoneAudit.toStatus == "Reject"){
            this.disableApprovalButton = true;
          }

        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  cloneObj(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copyD = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copyD[i] = this.cloneObj(obj[i]);
        }
        return copyD;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copyO = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copyO[attr] = this.cloneObj(obj[attr]);
        }
        return copyO;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

  comparyJsonArray(x1, y1) {

  var x = this.cloneObj(x1);
  var y = this.cloneObj(y1);
    for(var i = 0; i < x.length; i++) {
        delete x[i]['isPaid'];
        delete x[i]['status'];
        delete x[i]['isDisbursed'];
    }

    for(var i = 0; i < y.length; i++) {
        delete y[i]['isPaid'];
        delete y[i]['status'];
        delete y[i]['isDisbursed'];
    }
    // If both x and y are null or undefined and exactly the same
    if ( x === y ) {
        return true;
    }

    // If they are not strictly equal, they both need to be Objects
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
    }

    // They must have the exact same prototype chain, the closest we can do is
    // test the constructor.
    if ( x.constructor !== y.constructor ) {
        return false;
    }

    for ( var p in x ) {
        // Inherited properties were tested using x.constructor === y.constructor
        if ( x.hasOwnProperty( p ) ) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if ( ! y.hasOwnProperty( p ) ) {
                return false;
            }

            // If they have the same strict value or identity then they are equal
            if ( x[ p ] === y[ p ] ) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if ( typeof( x[ p ] ) !== "object" ) {
                return false;
            }

            // Objects and Arrays must be tested recursively
            if ( !this.comparyJsonArray( x[ p ],  y[ p ] ) ) {
                return false;
            }
        }
    }

    for ( p in y ) {
        // allows x[ p ] to be set to undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
            return false;
        }
    }
    return true;
}

  getUserImage(seekerDetails:any) {

    if(seekerDetails.user != null && seekerDetails.user != undefined){
  
      if(seekerDetails.user.photo != undefined && seekerDetails.user.photo != null && seekerDetails.user.photo != ''){
        this.userService.getUserImage(seekerDetails.user.photo).subscribe(data => {
          var dd = URL.createObjectURL(data);
          this.imageSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        });
        
      } else {
        if(seekerDetails.user.gender == 'FeMale'){
          this.imageSrcData = 'assets/images/defaultWomanImg.png';
        } else {
          this.imageSrcData = 'assets/images/defaultManImg.png';
        }
      }
  
    } else {
  
      if(seekerDetails.company != undefined && seekerDetails.company != null && seekerDetails.company != ''){
          this.imageSrcData = 'assets/images/defaultCompanyImg.png';
      }
  
    }
   
  }

  startStopGig(uniqueId, status){

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {
      "milestoneId": this.milestoneData.id,
      "uniqueId": uniqueId,
      "status": status
    };

    this.providerService.startStopGig(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this.ngOnInit();
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

}
