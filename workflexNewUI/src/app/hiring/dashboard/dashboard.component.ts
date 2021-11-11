import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { HiringDashboardService } from '../../../app/services/hiring-dashboard.service';
import { ProviderService } from '../../../app/services/provider.service';
import { SearchProviderService } from '../../../app/services/search-provider.service';
import { SharedService } from '../../../app/services/shared.service';
import { UserService } from '../../../app/services/user.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { ROUTS } from '../../../app/constants/constants';
import swal from 'sweetalert2';
import { Subscription, interval } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;

  classA = "";
  messageList = null;
  isCompanySelected = false;
  showMenu = '';
  hide = '';
  ROUTS: any = ROUTS;
  errors;
  dataList = null;
  type = null;
  whoShortlistedMeList = null;
  subscription: Subscription;
  source = interval(2000);
  closeResult: string;
  companyId = null;
  userId = null;
  skillList: any[] = [];
  appliedGigsList = null;
  appliedGigsListLength = null;
  selectedItems;
  startedMilestones = null;
  showNotification:boolean;

  tabs = ['all', 'shortlisted'];
  selectedIndex = 0;

  constructor(private router: Router,
    public toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private userService: UserService,
    private providerService: ProviderService,
    private spinner: NgxSpinnerService,
    private searchProviderService: SearchProviderService,
    public hiringDashboardService: HiringDashboardService,
    private modalService: NgbModal,
    public activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.view) {
        if (params.view == 'all') { this.selectedIndex = 0; } else if (params.view == 'shortlisted_me') { this.selectedIndex = 1; } else { this.selectedIndex = 2; }

      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.tabGroup.selectedIndex = this.selectedIndex;
    if( this.selectedIndex == 0){
      this.showNotification = true;
    }
  }

  applyFilter() {
    this.tabGroup.selectedIndex = 0;
  }

  toggleDisplayDiv() {
    this.showMenu = 'menushow';
    this.hide = 'hide'
  };
  toggleHideDiv() {
    this.showMenu = '';
    this.hide = ''
  }

  tabChangeEvent(ev) {

    this.hiringDashboardService.searchText ="";
    this.hiringDashboardService.searchByName ="";
    this.hiringDashboardService.searchByLocation ="";
    this.hiringDashboardService.searchByminExp ="";
    this.hiringDashboardService.searchBymaxExp ="";

    if(ev == 0){
      this.showNotification=true;
      this.hiringDashboardService.getSeekersProfilesList();
    }else if(ev == 1){
    this.showNotification = false;
    this.getAppliedGigsList();
    }
    this.router.navigate([window.location.pathname], { queryParams: { view: [this.tabs[ev]] } })
  }

  clickEvent() {
    this.classA = 'success'
  }
  clickClose() {
    this.classA = ''
  }
  ngOnInit() {
    let redirect: string = this.sharedService.checkUserCredential('hiring-dashboard');

    if (redirect)
      return this.router.navigate([redirect]);

    if (localStorage.getItem('category') === 'Gig Worker')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);

    if (localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    if (localStorage.getItem('subcategory') === "Company" && !companyId && !isCompanySelected)
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);

    this.getUserDetails();
    this.hiringDashboardService.currentPage = 1;
    this.hiringDashboardService.isShowMoreCollcetion = false;
    this.hiringDashboardService.gigsList = null;
    this.hiringDashboardService.seekerProfiles = null;
    this.hiringDashboardService.searchText = "";
    this.hiringDashboardService.gigsList = [];

    let searchText = this.activatedRoute.snapshot.queryParams['search'];
    if (searchText) {
      this.hiringDashboardService.searchText = searchText;
      this.hiringDashboardService.searchForGigs(false, this.hiringDashboardService.currentPage);
    } else {
      this.hiringDashboardService.getSeekersProfilesList();
    }

    this.userId = localStorage.getItem('userId');
    this.companyId = localStorage.getItem('companyId');

    this.getAppliedGigsList();
    this.getStartedMilestones();
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if (localStorage.getItem('subcategory') === 'Company') {
          if (localStorage.getItem("isRequestInitiated") == 'true') {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
          } else if ((resJSON.body.response.data.company === null || resJSON.body.response.data.company === undefined)) {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
          }
        }
      }

    }, (err) => {
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getAppliedGigsList() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.getAppliedGigsList(companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        let gigList = resJSON.body.response.data;
        this.appliedGigsListLength = resJSON.body.response.data.length;
        if (gigList) {
          this.appliedGigsList = gigList;
          this.appliedGigsList.forEach(element => {
            this.getUserImage(element);
          });
          this.dataList = gigList;
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getSeekerDetails() {
    let companyId = "";
    this.providerService.seekerDetails(localStorage.getItem("userId"), companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.selectedItems = resJSON.body.response.data[0].data.skill;
        // let seekerDetails = resJSON.body.response.data[0].data;
        // //Update forms
        // this.updateSeekerForm.get("locationPreferences").setValue(seekerDetails.locationPreferences[0]);
        // this.updateSeekerForm.get("totalExperienceInYears").setValue(seekerDetails.totalExperienceInYears);
        // this.updateSeekerForm.get("totalExperienceInMonths").setValue(seekerDetails.totalExperienceInMonths);
        // this.updateSeekerForm.get("engagementPeriod").setValue(seekerDetails.engagementPeriod);
        // this.updateSeekerForm.get("remarks").setValue(seekerDetails.remarks);

        // if(this.isSeekerProfileAlreadyExist){
        //   this.seekerDetails = resJSON.body.response.data[0].data;
        //   this.seekerDetails.skill = this.seekerDetails.skill[0];
        // //  this.seekerDetails.expiresOn = this.gigDetails.expiresOn.replace(/Z/g,'').toString();
        // } else {
        //   this.seekerDetails = resJSON.body.response.data;
        // }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  applyGig(id) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true) {
      companyId = localStorage.getItem('companyId');
    }
    this.providerService.applyForGig(id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.hiringDashboardService.gigsList.forEach(element => {
          if (element.id === id)
            element.isApproved = true;
        });
        this.toastr.successToastr(resJSON.body.response.message);
        this.getAppliedGigsList();
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  shortlistDelete(id, type) {

    swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {

        let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
        let companyId = "";
        if (isCompanySelected == true)
          companyId = localStorage.getItem('companyId');
        this.providerService.shortlistDelete(type, id, companyId).subscribe((res) => {
          let resSTR = JSON.stringify(res);
          let resJSON = JSON.parse(resSTR);
          if (!resJSON.body.response.status) {
            this.toastr.errorToastr(resJSON.body.response.message);
          } else {
            this.toastr.successToastr(resJSON.body.response.message);
            this.getAppliedGigsList();
            this.hiringDashboardService.currentPage = 1;
            this.hiringDashboardService.searchForGigs(false, this.hiringDashboardService.currentPage);
          }
        }, (err) => {
          this.errors = err.errors;
        });
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === swal.DismissReason.cancel) {

      }
    });
  }


  getMessagesChain(id) {
    this.providerService.getMessagesChain(id).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if (resJSON.body.response.data)
          this.messageList = resJSON.body.response.data.messages;
        else
          this.messageList = null;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  sendMessage(messageText) {
    if (messageText != "") {
      var isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      let data = {
        "isCompany": isCompanySelected,
        "appliedProviderId": this.dataList.id,
        "message": messageText
      };

      this.providerService.createMessageChain(data).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          let inputValue = (document.getElementById("messageText") as HTMLInputElement);
          if (inputValue.value != undefined && inputValue.value != '') {
            (document.getElementById("messageText") as HTMLInputElement).value = '';
          }
          this.getMessagesChain(this.dataList.id);
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    }
  }

  open(content, data, type) {
    this.dataList = data;
    this.type = type;
    if (type == "who") {
      if (this.dataList.user != undefined && this.dataList.user != null && this.dataList.user.name != undefined) {
        this.dataList.provider.user = {};
        this.dataList.provider.user.name = this.dataList.user.name;
      }
      if (this.dataList.company != undefined && this.dataList.company != null && this.dataList.company.companyName != undefined) {
        this.dataList.provider.company = {};
        this.dataList.provider.company.companyName = this.dataList.company.companyName;
      }
    }
    this.getMessagesChain(data.id);
    this.checkIfMilestoneExist(data.id);
    // this.subscription = this.source.subscribe(val => this.getMessagesChain(data.id));
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-message' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkIfMilestoneExist(appliedProviderId) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {
      "appliedProviderId": appliedProviderId
    };
  }

  private getDismissReason(reason: any): string {
    this.getWhoShortlistedMeList();
    this.getAppliedGigsList();
    this.subscription.unsubscribe();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getWhoShortlistedMeList() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.getWhoShortlistedMeList(companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.whoShortlistedMeList = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getStartedMilestones() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.startedMilestones(companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.parseGigProcess(resJSON.body.response.data);
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  parseGigProcess(data) {
    var arr = [];
    if (data) {
      for (let index = 0; index < data.length; index++) {
        arr.push(data[index]["appliedProviderId"]);
      }
      this.startedMilestones = arr;
    }
  }

  gigProcess(isGigStart, isNotInterested, isOnHold, appliedProviderId = 0, providerId) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {};
    if (appliedProviderId == 0)
      data = {
        "appliedProviderId": this.dataList.id,
        "isGigStart": isGigStart,
        "isNotInterested": isNotInterested,
        "isOnHold": isOnHold
      };
    else
      data = {
        "appliedProviderId": appliedProviderId,
        "isGigStart": isGigStart,
        "isNotInterested": isNotInterested,
        "isOnHold": isOnHold
      };

    this.providerService.createGigProcess(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if (isNotInterested == true) {
          location.reload();
        } else {
          if (appliedProviderId == 0)
            return this.router.navigate([ROUTS.CREATE_MILESTONE + this.dataList.id], { queryParams: { provider: providerId } });
          else
            // window.location.href = '/milestone/create-milestone/'+appliedProviderId;
            return this.router.navigate([ROUTS.CREATE_MILESTONE + appliedProviderId], { queryParams: { provider: providerId } });
        }
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getUserImage(element: any) {
    if (element.provider.user.photo != undefined && element.provider.user.photo != null && element.provider.user.photo != '') {
      this.userService.getUserImage(element.provider.user.photo).subscribe(data => {
        var dd = URL.createObjectURL(data);
        element.provider.user.photo = this.sanitizer.bypassSecurityTrustUrl(dd);
      });
    } else {
      if (element.provider.user.gender == 'FeMale') {
        element.provider.user.photo = 'assets/images/defaultWomanImg.png';
      } else {
        element.provider.user.photo = 'assets/images/defaultManImg.png';
      }
    }
  }

  checkIfMilestoneExistForRoute(id, providerId) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {
      "appliedProviderId": id
    };

    this.providerService.checkIfMilestoneExist(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if (resJSON.body.response.data == null) {
          return this.router.navigate([ROUTS.CREATE_MILESTONE + id], { queryParams: { provider: providerId } });
        } else {
          if (resJSON.body.response.userType == 'seeker' && resJSON.body.response.isProcessed != null && resJSON.body.response.isProcessed == false && !this.comparyJsonArray(resJSON.body.response.data.approvedMilestones, resJSON.body.response.data.milestones) && resJSON.body.response.data.reason != undefined) {
            const navigationExtras: NavigationExtras = { state: { reason: resJSON.body.response.data.reason } };
            return this.router.navigate([ROUTS.APPROVED_MILESTONE + id], navigationExtras);
          } else {
            return this.router.navigate([ROUTS.APPROVED_MILESTONE + id]);
          }
        }
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  comparyJsonArray(x1, y1) {

    var x = this.cloneObj(x1);
    var y = this.cloneObj(y1);
    for (var i = 0; i < x.length; i++) {
      delete x[i]['isPaid'];
      delete x[i]['status'];
      delete x[i]['isDisbursed'];
    }

    for (var i = 0; i < y.length; i++) {
      delete y[i]['isPaid'];
      delete y[i]['status'];
      delete y[i]['isDisbursed'];
    }
    // If both x and y are null or undefined and exactly the same
    if (x === y) {
      return true;
    }

    // If they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }

    // They must have the exact same prototype chain, the closest we can do is
    // test the constructor.
    if (x.constructor !== y.constructor) {
      return false;
    }

    for (var p in x) {
      // Inherited properties were tested using x.constructor === y.constructor
      if (x.hasOwnProperty(p)) {
        // Allows comparing x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
          return false;
        }

        // If they have the same strict value or identity then they are equal
        if (x[p] === y[p]) {
          continue;
        }

        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof (x[p]) !== "object") {
          return false;
        }

        // Objects and Arrays must be tested recursively
        if (!this.comparyJsonArray(x[p], y[p])) {
          return false;
        }
      }
    }

    for (p in y) {
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
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

  applyAdditionalFilter(value) {

    if (value == 'apply') {
      setTimeout(() => {

        if (this.activatedRoute.snapshot.queryParams['search']) {
          this.hiringDashboardService.searchText = this.activatedRoute.snapshot.queryParams['search'];
        }
        if (this.activatedRoute.snapshot.queryParams['name']) {
          this.hiringDashboardService.searchByName = this.activatedRoute.snapshot.queryParams['name'];
        }

        if (this.activatedRoute.snapshot.queryParams['location']) {
          this.hiringDashboardService.searchByLocation = this.activatedRoute.snapshot.queryParams['location'];
        }

        if (this.activatedRoute.snapshot.queryParams['minExp']) {
          this.hiringDashboardService.searchByminExp = this.activatedRoute.snapshot.queryParams['minExp'];
        }

        if (this.activatedRoute.snapshot.queryParams['maxExp']) {
          this.hiringDashboardService.searchBymaxExp = this.activatedRoute.snapshot.queryParams['maxExp'];
        }

        if (this.activatedRoute.snapshot.queryParams['view'] == 'shortlisted') {
          this.searchByFilter_AppliedGigsList('shortlisted', this.hiringDashboardService.searchText, this.hiringDashboardService.searchByName,
            this.hiringDashboardService.searchByLocation, this.hiringDashboardService.searchByminExp, this.hiringDashboardService.searchBymaxExp);
        } else {
          this.hiringDashboardService.searchForGigs(false, this.hiringDashboardService.currentPage);
        }


      }, 500);

    } else if (value == 'clear') {
      setTimeout(() => {
          this.hiringDashboardService.searchByName = "";
          this.hiringDashboardService.searchByLocation = ""
          this.hiringDashboardService.searchByminExp = "";
          this.hiringDashboardService.searchBymaxExp = "";

        if (this.activatedRoute.snapshot.queryParams['search']) {
          this.hiringDashboardService.searchText = this.activatedRoute.snapshot.queryParams['search'];
          this.hiringDashboardService.searchForGigs(false, this.hiringDashboardService.currentPage);

        }else if(this.activatedRoute.snapshot.queryParams['view'] == 'shortlisted'){
            this.hiringDashboardService.searchText ="";
            this.getAppliedGigsList();
        }
      }, 500);
    }

  }


  searchByFilter_AppliedGigsList(view, searchText, name, location, minExp, maxExp) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.searchByFilter_ShortlistGigsList(companyId, view, searchText, name, location, minExp, maxExp).subscribe((res) => {
      let resJSON = JSON.parse(JSON.stringify(res));
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        let gigList = resJSON.body.response.data;
        this.appliedGigsListLength = resJSON.body.response.data.length;
        if (gigList) {
          this.appliedGigsList = gigList;
          this.appliedGigsList.forEach(element => {
            this.getUserImage(element);
          });
          this.dataList = gigList;
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

}
