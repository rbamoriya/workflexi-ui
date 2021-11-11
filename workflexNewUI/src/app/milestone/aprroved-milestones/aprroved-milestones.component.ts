import { MilestoneModule } from './../milestone.module';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
import { UserService } from 'src/app/services/user.service';
import { DynamicGrid } from 'src/app/models/dynamic-grid.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-aprroved-milestones',
  templateUrl: './aprroved-milestones.component.html',
  styleUrls: ['./aprroved-milestones.component.scss']
})
export class AprrovedMilestonesComponent implements OnInit {

  userRoles;
  userId;
  companyId;
  isCompanySelected;
  isMilestoneExist;
  gigProcessId;
  milestoneData;
  milestoneAudit;
  isDisabledDates = "false";
  userType = null;
  userOrCompanyType = "Individual";
  providerName;
  todaysDate;
  model: NgbDateStruct;
  url: string = "";
  imageSrcData: any;
  dynamicArray: Array<DynamicGrid> = [];
  previewDynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  milestoneForm: FormGroup;
  todayDate: Date;
  enddate: Date;
  approvalMilestoneEqualSavedMilestone = false;
  disableSubmitApprovalButton = true;
  disableApprovalButton = false;
  pDetails;
  rejectReason:string;
  isPrimaryRoleExist;
  showApproveed:boolean = false;

  constructor(private commonService : CommonService, 
    private providerService : ProviderService, 
    private router: Router, 
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public popupService : PopupService,
    private userService:UserService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public toastr: ToastrManager) {
    this.commonService.isAuthenticated();
    this.userRoles = localStorage.getItem('userRoles');
    this.userId = localStorage.getItem('userId');
    this.companyId = localStorage.getItem('companyId');
    this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    this.isPrimaryRoleExist = this.isRoleExist(JSON.parse(this.userRoles), "ROLE_PRIMARY_USER");

    const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {reason: any};
      if(state) {
        this.showRejectReason(state.reason);
      } 

  }

  openDialog(uniqueId:string) {
    this.popupService.openMilestoneEditModal(uniqueId,this.milestoneData);
  }

  editDoneInPopUp(){
    this.ngOnInit();
  }

  addCancelInPopUp(){
    this.milestoneData.milestones.splice(this.milestoneData.milestones.length-2, 1);
  }

  isRoleExist(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? this.isRoleExist(json[key], value) : json[key] === value;
        console.log();
         return contains;
    });
    return contains;
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
        if(resJSON.body.response.data == null){
          this.isMilestoneExist = "false";
          this.milestoneData = null;
        } else {
          this.isMilestoneExist = "true";
          this.showApproveed = true;
          this.milestoneData = resJSON.body.response.data;
          console.log(resJSON.body.response);
          this.milestoneAudit = resJSON.body.response.milestoneAudit;
          this.inIt();
          this.getUserImage(this.milestoneData.gigProcess);
          if(this.milestoneData.gigProcess.company != null){
            this.userOrCompanyType = this.milestoneData.gigProcess.company.companyName;
          } else {
            this.userOrCompanyType = this.milestoneData.gigProcess.user.name;
          }

          if(this.userType == 'seeker' && resJSON.body.response.isProcessed != null && resJSON.body.response.isProcessed == false && !this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones) && this.milestoneData.reason != undefined){
            this.showRejectReason(this.milestoneData.reason);
          }

          if(this.milestoneData.isNew == true && (this.milestoneData.approvedMilestones == null || this.milestoneData.approvedMilestones == "")){
            this.disableSubmitApprovalButton = true;
          } else {
            if(this.userType == 'provider' && (this.milestoneData.approvedMilestones == null || this.milestoneData.approvedMilestones == "")){
              this.isMilestoneExist = "false";
            }

            this.disableSubmitApprovalButton = false;

            if(this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones)){
              this.disableApprovalButton = true;
              this.approvalMilestoneEqualSavedMilestone = true;
            } else {
              this.disableApprovalButton = false;
              this.approvalMilestoneEqualSavedMilestone = false;
            }
          }

          if(this.milestoneData.isApproved == false && this.milestoneData.approvedMilestones != null && !this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones) && resJSON.body.response.milestoneAudit != null && resJSON.body.response.milestoneAudit.toStatus == "SendForApproval"){
            this.disableSubmitApprovalButton = true;
          }

          if(this.userType == "provider" && this.milestoneData.isApproved == false && this.milestoneData.approvedMilestones != null && !this.comparyJsonArray(this.milestoneData.approvedMilestones, this.milestoneData.milestones) && resJSON.body.response.milestoneAudit != null && resJSON.body.response.milestoneAudit.toStatus == "Reject"){
            this.disableApprovalButton = true;
          }

          this.isDisabledDates = "true";
          this.todaysDate = new Date();

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

removeMilestone(index){

  swal.fire({
    title: 'Are you sure?',
    text: "You will not be able to recover data after delete!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      if(this.milestoneData.milestones.length>1){
        this.milestoneData.milestones.splice(index, 1);
        this.updateMilestone(0);
      } else {
        swal.fire({
          title: 'Can not delete',
          text: "minimum one milestone is requied!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            
          } else {
            
          }
        });
      }
    } else if (result.dismiss === swal.DismissReason.cancel) {
      
    }
  });

}


inIt(){

  this.milestoneForm = this.formBuilder.group({
    startDate: [this.milestoneData.startDate, Validators.required ],
    endDate: [this.milestoneData.endDate, Validators.required ]
  });
 }

 isArraySorted(arr){
  for(let i=0;i<arr.length;i++){
      if(arr[i+1] && (arr[i+1] > arr[i])){
          continue;
      } else if(arr[i+1] && (arr[i+1] < arr[i])){
          return false;
      }
  }
  return true;
}

updateMilestone(sendForApproval = 0){
  var data = this.milestoneForm.getRawValue();
  var milestonesTemp = this.milestoneData.milestones;
  let resSTR1 = JSON.stringify(milestonesTemp);
  let resJSON1 = JSON.parse(resSTR1);
  data.milestone = resJSON1;
  data.startDat = this.milestoneData.startDate
  data.endDate = this.milestoneData.endDate;
  data.gigProcessId = this.milestoneData.gigProcess.id;
  data = JSON.stringify(data);

  let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
  let companyId = "";
  if(isCompanySelected == true)
    companyId = localStorage.getItem('companyId');

  this.providerService.updateMilestone(data, this.milestoneData.id, companyId).subscribe((res) => {
    let resSTR = JSON.stringify(res);
    let resJSON = JSON.parse(resSTR);
    if(!resJSON.body.response.status) {
      this.toastr.errorToastr(resJSON.body.response.message);
      this.ngOnInit();
    } else {
      this.toastr.successToastr(resJSON.body.response.message);
      this.ngOnInit();
    }
  }, (err) => {
    this.toastr.errorToastr(err.errors);
    this.ngOnInit();
  });

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

sendForApproval(){
  swal.fire({
    title: 'Click OK to send the milestone for approval.',
    text: " You won't be able to change the milestone until the gig worker approves/rejects the milestone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      let companyId = "";
      if(isCompanySelected == true)
        companyId = localStorage.getItem('companyId');
    
      let data = {
        "milestoneId": this.milestoneData.id
      };
    
      this.providerService.sendForApproval(data, companyId).subscribe((res) => {
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
    } else if (result.dismiss === swal.DismissReason.cancel) {
      
    }
  });
}

addMilestoneRow(){
  const endDate = this.commonService.getMmDdYyyy(this.milestoneData.endDate);
  if(new Date(endDate) < this.todaysDate){
    return false;
  }
  var date1 = this.milestoneData.endDate;
  var date2 = this.milestoneData.startDate;
  if(date1 != "" && date2 != ""){
    var length = this.milestoneData.milestones.length;
    this.milestoneData.milestones.splice(length - 1, 0, {
      endDate: '',
      amount: '',
      description: '',
      isPaid: false
    });
    this.openDialog((length - 1).toString())
  }
}

payForMilestone(uniqueId){

  let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
  let companyId = "";
  if(isCompanySelected == true)
    companyId = localStorage.getItem('companyId');

  let data = {
    "milestoneId": this.milestoneData.id,
    "uniqueId": uniqueId
  };

  this.providerService.payForMilestone(data, companyId).subscribe((res) => {
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

disburseForMilestone(uniqueId){

  swal.fire({
    title: 'Click OK to approve disbursal of milestone amount to gig worker',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.value) {
      let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      let companyId = "";
      if(isCompanySelected == true)
        companyId = localStorage.getItem('companyId');

      let data = {
        "milestoneId": this.milestoneData.id,
        "uniqueId": uniqueId
      };

      this.providerService.disburseForMilestone(data, companyId).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message, 'Failed', {dismiss: 'click', showCloseButton: true});
        } else {
          this.toastr.successToastr(resJSON.body.response.message, 'Success', {dismiss: 'click', showCloseButton: true});
          this.ngOnInit();
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    } else if (result.dismiss === swal.DismissReason.cancel) {
      
    }
  });
}

showRejectReason(reason){
    swal.fire({
      title: 'Reject reason',
      text: reason,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.value) {
        
      } else if (result.dismiss === swal.DismissReason.cancel) {
        
      }
    });
}

isPaidOrPastDated(milestone) {
  const endData = this.commonService.getMmDdYyyy(milestone.endDate);
  return milestone && (milestone.isPaid == 'true' || new Date() > new Date(endData));
}

}
