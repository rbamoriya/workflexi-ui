import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { MyOrganizationService } from '../../services/my-organization-service';
import { ROUTS } from '../../../app/constants/constants';
import { SharedService } from 'src/app/services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {


  ROUTS: any = ROUTS;
  companyId;
  isCompanyExist: boolean = false;
  companyDetails;
  bankDetails: any;
  imageSrcData;
  isPrimaryRoleExist;
  userRoles;
  isInitiated;
  message;
  errors;
  isRejectExceeded;
  assignedUsers = null;
  approvalRequests = null;
  unassignForm: FormGroup;
  unassignUserIds = [];
  approveRejectUserIds = [];
  approvalRejectForm: FormGroup;

  constructor(public toastr: ToastrManager,
    private sanitizer: DomSanitizer,
    private router: Router,
    private myOrganizationService: MyOrganizationService,
    private userService: UserService,
    private fb: FormBuilder,
    private sharedService: SharedService) {

    this.userRoles = localStorage.getItem('userRoles');
    this.isPrimaryRoleExist = this.isRoleExist(JSON.parse(this.userRoles), "ROLE_PRIMARY_USER");

  }

  ngOnInit() {
    this.getUserDetails();
    this.createUnassignForm();
    this.createApprovalRejectForm();
  }


  isRoleExist(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
      contains = typeof json[key] === 'object' ? this.isRoleExist(json[key], value) : json[key] === value;
      return contains;
    });
    return contains;
  }

  redirectInboarding() {
    localStorage.removeItem("subcategory");
    return this.router.navigate([CONSTANTS_CLASS.ROUTS.AUTH_INBOARDING]);
  }

  isRequestInitiated() {
    this.myOrganizationService.isRequestInitiated().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      if (resJSON.body.response.status) {
        this.message = resJSON.body.response.message;
        localStorage.setItem('isRequestInitiated', 'true');
        this.isInitiated = true;
      } else {
        localStorage.setItem('isRequestInitiated', 'false');
        this.isInitiated = false;
      }
      this.isRequestRejectExceeded();
    }, (err) => {
      // this.toastr.errorToastr(err.errors);
      this.isRequestRejectExceeded();
    });
  }

  isRequestRejectExceeded() {
    this.myOrganizationService.isRejectExceeded().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (resJSON.body.response.status) {
        this.errors = resJSON.body.response.message;
        this.isRejectExceeded = true;
      } else {
        this.isRejectExceeded = false;
      }

      if (!this.isRejectExceeded && !this.isInitiated && !this.isCompanyExist) {
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
      } else {
        // localStorage.setItem("isCompanySelected", "true");
        // this.sharedService.isCompanySelected = true;
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
        location.reload();
      } else {
        if (resJSON.body.response.data.company != null) {
          this.isCompanyExist = true;
          this.companyDetails = resJSON.body.response.data.company;
          this.bankDetails = resJSON.body.response.data.bank;

          this.getUserImage(this.companyDetails.companyLogo);
          this.companyId = resJSON.body.response.data.company.id;
          localStorage.setItem("companyId", this.companyId);

          if (this.isPrimaryRoleExist) {
            this.getInitiatedCompanyUsers();
            this.processRejectedCompanyAccess();
          }

          localStorage.setItem("isCompanySelected", "true");
          this.sharedService.isCompanySelected = true;
          localStorage.setItem("subcategory", "Company");

        } else {
          this.isCompanyExist = false;
        }
      }
      this.isRequestInitiated();
    }, (err) => {
      // this.toastr.errorToastr(err.errors);
      this.isRequestInitiated();
    });
  }

  getUserImage(name: string) {
    if (name != null && name != undefined && name != '') {
      this.userService.getUserImage(name).subscribe(data => {
        var dd = URL.createObjectURL(data);
        // this.imageSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        this.imageSrcData = 'assets/images/defaultCompanyImg.png';
      });
    } else {
      this.imageSrcData = 'assets/images/defaultCompanyImg.png';
    }
  }

  getInitiatedCompanyUsers() {
    this.myOrganizationService.getInitiatedCompanyUsers(this.companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (resJSON.body.response.status) {
        this.approvalRequests = resJSON.body.response.data;
        this.approvalRequests.forEach(element => {
          this.getImageUserProfile(element);
        });
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  processRejectedCompanyAccess() {
    this.myOrganizationService.processRejectedCompanyAccess(this.companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (resJSON.body.response.status) {
        this.assignedUsers = resJSON.body.response.data;
        this.assignedUsers.forEach(element => {
          this.getImageUserProfile(element);
        });
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getImageUserProfile(element: any) {
    if (element.photo != undefined && element.photo != null && element.photo != '') {
      this.userService.getUserImage(element.photo).subscribe(data => {
        var dd = URL.createObjectURL(data);
        element.photo = this.sanitizer.bypassSecurityTrustUrl(dd);
      });
    } else {
      if (element.gender == 'FeMale') {
        element.photo = 'assets/images/defaultWomanImg.png';
      } else {
        element.photo = 'assets/images/defaultManImg.png';
      }
    }
  }


  unAssignUserRequests() {
    let formObj = this.unassignForm.getRawValue();
    this.unassignUserIds = [];
    this.approveRejectUserIdsChecked("assignedUsers");

    var index = this.unassignUserIds.indexOf(localStorage.getItem('userId'));
    if (index !== -1) this.unassignUserIds.splice(index, 1);

    formObj.userIds = this.unassignUserIds;
    let serializedForm = JSON.stringify(formObj);

    if (index !== -1 && formObj.userIds.length <= 0) {
      this.toastr.warningToastr("You can not unassign yourself");
      return false;
    }

    if (formObj.userIds.length <= 0) {
      this.toastr.warningToastr("Please check at least one checkbox");
    } else {
      this.myOrganizationService.unAssignUserRequests(serializedForm, this.companyId).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.warningToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          location.reload();
        }
      }, (err) => {
        this.errors = err.errors;
      });
    }
  }


  approveRejectUserIdsChecked(className) {
    var clist = document.getElementsByClassName(className);
    if (className == "approvalRequests") {
      for (var i = 0; i < clist.length; ++i) {
        var id = document.getElementById(clist[i].id) as HTMLInputElement;
        if (id.checked == true) {
          this.approveRejectUserIds.push(id.id);
        } else {
          var index = this.approveRejectUserIds.indexOf(id.id);
          if (index !== -1) this.approveRejectUserIds.splice(index, 1)
        }
      }
    } else if (className == "assignedUsers") {
      for (var i = 0; i < clist.length; ++i) {
        var id = document.getElementById(clist[i].id) as HTMLInputElement;
        if (id.checked == true) {
          this.unassignUserIds.push(id.id);
        } else {
          var index = this.unassignUserIds.indexOf(id.id);
          if (index !== -1) this.unassignUserIds.splice(index, 1)
        }
      }
    }
  }

  createUnassignForm() {
    this.unassignForm = this.fb.group({

    });
  }

  selectAll(className) {
    var clist = document.getElementsByClassName(className);
    let flagOne = false;
    for (var i = 0; i < clist.length; ++i) {
      var id = document.getElementById(clist[i].id) as HTMLInputElement;
      if (id.checked == true) {
        flagOne = true;
        break;
      }
    }
    if (flagOne) {
      for (var i = 0; i < clist.length; ++i) {
        var id = document.getElementById(clist[i].id) as HTMLInputElement;
        id.checked = false;
      }
    } else {
      for (var i = 0; i < clist.length; ++i) {
        var id = document.getElementById(clist[i].id) as HTMLInputElement;
        id.checked = true;
      }
    }
  }

  createApprovalRejectForm() {
    this.approvalRejectForm = this.fb.group({
      approvalRequestsSelect: ['', Validators.required]
    });
  }

  approvalRejectRequests() {
    let formObj = this.approvalRejectForm.getRawValue();
    this.approveRejectUserIds = [];
    this.approveRejectUserIdsChecked("approvalRequests");
    formObj.userIds = this.approveRejectUserIds;
    let serializedForm = JSON.stringify(formObj);

    if (formObj.userIds.length <= 0 || formObj.approvalRequestsSelect == "") {
      this.toastr.warningToastr("Please select approve/reject and check at least one checkbox");
    } else {
      this.myOrganizationService.approvalRejectRequests(serializedForm, this.companyId, formObj.approvalRequestsSelect).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.warningToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          this.ngOnInit();
        }
      }, (err) => {
        this.errors = err.errors;
      });
    }
  }


  linkBlankOpen(link: string) {
    let https: string = "https://";
    let http: string = "http://";
    if (link.startsWith(https) || link.startsWith(http)) {
      window.open(link, '_blank');
    } else {
      window.open(https + link, '_blank');
    }

  }


}
