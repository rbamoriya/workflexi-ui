import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../app/services/shared.service';
import { UserService } from '../../../app/services/user.service';
import { GigworkerDashboardService } from '../../../app/services/gigworker-dashboard.service';
import { SearchProviderService } from '../../../app/services/search-provider.service';
import { ImageFiles } from '../../models/image-files.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProviderService } from '../../../app/services/provider.service';
import { ROUTS } from '../../../app/constants/constants';
import * as CONSTANTS_CLASS from '../../constants/constants';
import swal from 'sweetalert2';
import { Subscription, interval } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  isShowDiv = false;
  status: boolean = false;
  clickEvent() {
    this.classA = 'success'
  }
  clickClose() {
    this.classA = ''
  }
  userDetails: any;
  ROUTS: any = ROUTS;
  pDetails: any;
  skillItems: any[];
  errors;
  shortlistedSeekersList = null;
  whoShortlistedMeList = null;
  whoShortlistedMeListLength = null;
  shortlistedSeekersListLength = null;
  appliedGigsList = null;
  isUnread = false;
  isSeekerShortlisted: boolean = false;

  dataList = null;
  type = null;
  subscription: Subscription;
  source = interval(2000);
  closeResult: string;
  companyId = null;
  userId = null;
  messageList = null;
  isCompanySelected = false;
  gigworkerSrcData: any;
  selectedIndex = 0;
  showNotification: boolean;

  tabs = ['all', 'shortlisted_me', 'hired'];
  constructor(public toastr: ToastrManager,
    private router: Router,
    private providerService: ProviderService,
    private sharedService: SharedService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public gigworkerDashboardService: GigworkerDashboardService,
    public activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.view) {
        if (params.view == 'all') { this.selectedIndex = 0; } else if (params.view == 'shortlisted_me') { this.selectedIndex = 1; } else { this.selectedIndex = 2; }

      }
    });
  }

  ngOnInit() {

    let redirect: string = this.sharedService.checkUserCredential('gigworker-dashboard');

    if (redirect)
      return this.router.navigate([redirect]);

    if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if (localStorage.getItem('category') === 'Gig Worker') {
      } else {
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
      }
    }

    if (localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    if (localStorage.getItem('subcategory') === "Company" && !companyId && !isCompanySelected)
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);

    this.gigworkerDashboardService.seekersList = null;
    this.gigworkerDashboardService.allJobsListLength = null;
    this.gigworkerDashboardService.searchText = "";
    this.gigworkerDashboardService.providerDetails = null;
    this.gigworkerDashboardService.gigsList = null;

    let searchText = this.activatedRoute.snapshot.queryParams['search'];
    if (searchText) {
      this.gigworkerDashboardService.searchText = searchText;
      this.gigworkerDashboardService.getSeekersList(this.gigworkerDashboardService.searchText);
    } else {
      this.getUserDetails();
    }

    this.userId = localStorage.getItem('userId');
    this.companyId = localStorage.getItem('companyId');

    this.getAppliedGigsList();
    this.getWhoShortlistedMeList();
    this.getShortlistedSeekersList();
  }

  ngAfterViewInit(): void {
    this.tabGroup.selectedIndex = this.selectedIndex;
    if (this.selectedIndex == 0) {
      this.showNotification = true;
    }
  }

  applyFilter() {
    this.tabGroup.selectedIndex = 0;
  }

  tabChangeEvent(ev) {
    console.log(ev , this.gigworkerDashboardService.searchText, this.gigworkerDashboardService.searchByName,this.gigworkerDashboardService.searchByLocation);

    this.gigworkerDashboardService.searchText = "";
     this.gigworkerDashboardService.searchByName = "";
    this.gigworkerDashboardService.searchByLocation ="";
    if (ev == 0) {
      this.showNotification = true;
      this.gigworkerDashboardService.getProvidersList();
    } else if (ev == 1) {
      this.showNotification = false;
      this.getWhoShortlistedMeList();
    } else if (ev == 2) {
      this.showNotification = false;
      this.getShortlistedSeekersList();
    }
    this.router.navigate([window.location.pathname], { queryParams: { view: [this.tabs[ev]] } })
  }

  getUserDetails() {
    this.spinner.show();
    this.userService.getUserDetails().subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      this.gigworkerDashboardService.getProvidersList();
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.userDetails = resJSON.body.response.data;

        if (resJSON.body.response.data.photo != undefined && resJSON.body.response.data.photo != null && resJSON.body.response.data.photo != '') {
          this.getUserImage(resJSON.body.response.data.photo);

        } else {
          if (this.userDetails.gender == 'FeMale') {
            this.gigworkerSrcData = 'assets/images/defaultWomanImg.png';
          } else {
            this.gigworkerSrcData = 'assets/images/defaultManImg.png';
          }
        }
      }

    }, (err) => {
      this.spinner.hide();
      this.toastr.errorToastr(err.errors);
      this.gigworkerDashboardService.getProvidersList();
    });
  }

  getUserImage(name: string) {
    this.userService.getUserImage(name).subscribe(data => {
      var dd = URL.createObjectURL(data);
      this.gigworkerSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
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
        this.errors = resJSON.body.response.message;
      } else {
        let gigList = resJSON.body.response.data;
        if (gigList) {
          for (var index = 0; index < gigList.length; index++) {
            this.getIsUnreadMessageThere(gigList[index]['id']);
            gigList[index]['isUnread'] = this.isUnread;
          }
          this.appliedGigsList = gigList;
        }
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getIsUnreadMessageThere(id) {
    this.isUnread = false;
    this.providerService.getIsUnreadMessageThere(id).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.isUnread = false;
      } else {
        this.isUnread = resJSON.body.response.data;
      }
    }, (err) => {
      this.errors = err.errors;
    });
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
        this.whoShortlistedMeList.forEach(element => {
          this.gigworkerDashboardService.getUserImage(element);
        });
        this.whoShortlistedMeListLength = resJSON.body.response.data.length;
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  getShortlistedSeekersList() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.getShortlistedSeekersList(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.shortlistedSeekersList = resJSON.body.response.data;
        this.shortlistedSeekersList.forEach(element => {
          this.gigworkerDashboardService.getUserImage(element.seeker);
        });
        this.shortlistedSeekersListLength = resJSON.body.response.data.length;
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  shortlistSeeker(type, id) {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true) {
      companyId = localStorage.getItem('companyId');
    }
    // if(isCompanySelected == true){
    this.providerService.shortlistSeeker(id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.gigworkerDashboardService.seekersList.forEach(element => {
          if (element.id === id)
            element.isApproved = true;
        });
        this.toastr.successToastr(resJSON.body.response.message);
        this.getShortlistedSeekersList();
      }
    }, (err) => {
      this.errors = err.errors;
    });
    // }
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
            this.errors = resJSON.body.response.message;
          } else {
            this.toastr.successToastr(resJSON.body.response.message);
            this.getShortlistedSeekersList();
            this.gigworkerDashboardService.getSeekersList(this.gigworkerDashboardService.searchText);
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
      var isCompanySelected = this.isCompanySelected;
      if (isCompanySelected) {
        isCompanySelected = true;
      } else {
        isCompanySelected = false;
      }
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

  checkIfMilestoneExistForRoute(id) {
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
          this.toastr.errorToastr("Gig process does not exist. Please start the gig first");
        } else {
          return this.router.navigate([ROUTS.APPROVAL_MILESTONE + id]);
        }
      }
    }, (err) => {
      this.errors = err.errors;
    });
  }

  filterGigWorker(value: string) {
    if (value == 'apply') {
      setTimeout(() => {

        if (this.activatedRoute.snapshot.queryParams['search']) {
          this.gigworkerDashboardService.searchText = this.activatedRoute.snapshot.queryParams['search'];
        }
        if (this.activatedRoute.snapshot.queryParams['name']) {
          this.gigworkerDashboardService.searchByName = this.activatedRoute.snapshot.queryParams['name'];
        }

        if (this.activatedRoute.snapshot.queryParams['location']) {
          this.gigworkerDashboardService.searchByLocation = this.activatedRoute.snapshot.queryParams['location'];
        }

        if (this.activatedRoute.snapshot.queryParams['minExp']) {
          this.gigworkerDashboardService.searchByminExp = this.activatedRoute.snapshot.queryParams['minExp'];
        }

        if (this.activatedRoute.snapshot.queryParams['maxExp']) {
          this.gigworkerDashboardService.searchBymaxExp = this.activatedRoute.snapshot.queryParams['maxExp'];
        }

        var viewParam = this.activatedRoute.snapshot.queryParams['view'];

        if (viewParam) {
          if (viewParam == 'shortlisted_me') {
            this.searchByFilter_ShortlistedMe(viewParam, this.gigworkerDashboardService.searchText, this.gigworkerDashboardService.searchByName,
              this.gigworkerDashboardService.searchByLocation, this.gigworkerDashboardService.searchByminExp, this.gigworkerDashboardService.searchBymaxExp);

          } else if (viewParam == 'hired') {
           
            this.searchByFilter_ShortlistedHirer(this.gigworkerDashboardService.searchText, this.gigworkerDashboardService.searchByName,
              this.gigworkerDashboardService.searchByLocation, this.gigworkerDashboardService.searchByminExp, this.gigworkerDashboardService.searchBymaxExp);
          } else {
            this.gigworkerDashboardService.getSeekersList(this.gigworkerDashboardService.searchText);
          }
        } else {
          this.gigworkerDashboardService.getSeekersList(this.gigworkerDashboardService.searchText);
        }

      }, 500);

    } else if (value == 'clear') {
      setTimeout(() => {
        this.gigworkerDashboardService.searchByName = "";
        this.gigworkerDashboardService.searchByLocation = ""
        this.gigworkerDashboardService.searchByminExp = "";
        this.gigworkerDashboardService.searchBymaxExp = "";

        if (this.activatedRoute.snapshot.queryParams['search']) {
          this.gigworkerDashboardService.searchText = this.activatedRoute.snapshot.queryParams['search'];
          this.gigworkerDashboardService.getSeekersList(this.gigworkerDashboardService.searchText);

        } else if (this.activatedRoute.snapshot.queryParams['view'] == 'shortlisted_me') {
          this.gigworkerDashboardService.searchText = "";
          this.getWhoShortlistedMeList();
        } else if (this.activatedRoute.snapshot.queryParams['view'] == 'hired') {
          this.gigworkerDashboardService.searchText = "";
          this.getShortlistedSeekersList();
        }
      }, 500);
    }

  }

  searchByFilter_ShortlistedMe(viewParam, searchText, searchByName,
    searchByLocation, searchByminExp, searchBymaxExp) {

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.searchWhoShortlistedMeList(companyId, searchText, searchByName,
      searchByLocation, searchByminExp, searchBymaxExp).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.whoShortlistedMeList = resJSON.body.response.data;
          //console.log("me :: ", this.whoShortlistedMeList);
          this.whoShortlistedMeList.forEach(element => {
            this.gigworkerDashboardService.getUserImage(element);
          });
          this.whoShortlistedMeListLength = resJSON.body.response.data.length;
        }
      }, (err) => {
        this.errors = err.errors;
      });

  }


  searchByFilter_ShortlistedHirer(searchText, searchByName,
    searchByLocation, searchByminExp, searchBymaxExp) {

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.searchByFilter_ShortlistedHirer(companyId, searchText, searchByName,
      searchByLocation, searchByminExp, searchBymaxExp).subscribe((res) => {
        let resJSON = JSON.parse(JSON.stringify(res));
        if (!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.shortlistedSeekersList = resJSON.body.response.data;
          this.shortlistedSeekersList.forEach(element => {
            this.gigworkerDashboardService.getUserImage(element.seeker);
          });
          this.shortlistedSeekersListLength = resJSON.body.response.data.length;
        }
      }, (err) => {
        this.errors = err.errors;
      });

  }


}
