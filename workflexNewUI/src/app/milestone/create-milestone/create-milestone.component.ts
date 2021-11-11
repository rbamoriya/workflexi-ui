import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as CONSTANTS_CLASS from '../../constants/constants';
import * as moment from 'moment';
import { MatDialog, MatStepper } from '@angular/material';
import { ProviderService } from 'src/app/services/provider.service';
import swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from 'src/app/services/popup.service';
import { AddEditMilestoneComponent } from 'src/app/popup/add-edit-milestone/add-edit-milestone.component';
import {INDIAN_DATE_FORMAT} from 'src/app/constants/constants';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-create-milestone',
  templateUrl: './create-milestone.component.html',
  styleUrls: ['./create-milestone.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: INDIAN_DATE_FORMAT }
  ]
})
export class CreateMilestoneComponent implements OnInit {

  DATE_FORMAT = 'DD/MM/YYYY';

  milestones = [];
  popOverContent;
  
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public popupService : PopupService,
    public toastr: ToastrManager,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private providerService: ProviderService,
    public dialog: MatDialog) { }

  milestoneForm: FormGroup;
  todayDate = new Date();
  gigProcessId;
  userType = null;
  isMilestoneExist;
  providerId: string;
  pDetails: any;
  profileImgSrcData: any;
  disableSubmitApprovalButton = false;
  milestoneData;
  

  ngOnInit() {
    this.providerId = '';
    let userId: string = this.activatedRoute.snapshot.paramMap.get('id');
    let provider = this.activatedRoute.snapshot.queryParams['provider'];
    if (!userId || userId === '' || !provider) {
      if (localStorage.getItem('category') === 'Gig Worker')
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
      else
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
    }
    this.providerId = provider;
    this.getProviderDetails('gig', this.providerId);
    this.createForm();
    this.checkIfMilestoneExist();
  }



  createForm() {
    this.milestoneForm = this.formBuilder.group({
      startDate: [moment(), Validators.required],
      endDate: ['']
    });

    this.milestoneForm.get('endDate').disable();
  }

  getProviderDetails(type, id) {
    this.providerService.providerDetails(id, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.pDetails = resJSON.body.response.data[0];
        this.getUserImage(this.pDetails);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  checkIfMilestoneExist() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    let data = {
      "appliedProviderId": window.location.pathname.split("/").pop()
    };

    this.providerService.checkIfMilestoneExist(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
          this.gigProcessId = resJSON.body.response.gigProcessId;
          this.userType = resJSON.body.response.userType;
          this.isMilestoneExist = resJSON.body.response.data? true : false;
          if(this.isMilestoneExist) {
            const milestoneData = resJSON.body.response.data;
            this.milestoneData = milestoneData;
            this.populateExistingMilestones(milestoneData);
            const milestoneAudit = resJSON.body.response.milestoneAudit;
            if((milestoneData.isNew && (!milestoneData.approvedMilestones || milestoneData.approvedMilestones.length == 0)) || (!milestoneData.isApproved && milestoneData.approvedMilestones.length > 0 && (milestoneAudit && milestoneAudit.toStatus === 'SendForApproval'))) {
              this.disableSubmitApprovalButton = true;              
            }
          }
        }
    });
  }

  populateExistingMilestones(milestoneData) {
    if(milestoneData) {
      this.milestoneForm.get('startDate').setValue(moment(milestoneData.startDate,"DD/MM/YYYY"));
      this.milestoneForm.get('endDate').setValue(moment(milestoneData.endDate,"DD/MM/YYYY"));
      this.milestoneForm.get('startDate').disable();
      this.milestoneForm.get('endDate').disable();
      let milestones = milestoneData.milestones;
      if(milestones && milestones.length > 0) {
        this.milestones = milestones.map(m => {
          return {
            endDate: moment(m.endDate,"DD/MM/YYYY"),
            amount: m.amount,
            description: m.description
          }
        });
      }
    }
    
  }

  getUserImage(seekerDetails: any) {

    if (seekerDetails.user != null && seekerDetails.user != undefined) {

      if (seekerDetails.user.photo != undefined && seekerDetails.user.photo != null && seekerDetails.user.photo != '') {
        this.userService.getUserImage(seekerDetails.user.photo).subscribe(data => {
          var dd = URL.createObjectURL(data);
          this.profileImgSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        });

      } else {
        if (seekerDetails.user.gender == 'FeMale') {
          this.profileImgSrcData = 'assets/images/defaultWomanImg.png';
        } else {
          this.profileImgSrcData = 'assets/images/defaultManImg.png';
        }
      }

    } else {

      if (seekerDetails.company != undefined && seekerDetails.company != null && seekerDetails.company != '') {
        this.profileImgSrcData = 'assets/images/defaultCompanyImg.png';
      }

    }

  }

  /******* New table structure *********/

  createMilestone() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      let companyId = '';
      if (isCompanySelected == true) {
        companyId = localStorage.getItem('companyId');
      }
        

    if(!this.milestones || this.milestones.length == 0) {
      this.toastr.errorToastr('Atleast one task is required');
      return;
    }
    const finalMilestones = this.milestones.map(m => {
      return {
        endDate: m.endDate.format(this.DATE_FORMAT),
        amount: m.amount,
        description: m.description
      }
    });
    const data = {
      startDate: this.milestoneForm.get('startDate').value.format(this.DATE_FORMAT),
      endDate: this.milestoneForm.get('endDate').value.format(this.DATE_FORMAT),
      gigProcessId: this.gigProcessId,
      milestone: finalMilestones
    }

    this.providerService.createMilestone(data, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this.checkIfMilestoneExist();
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  openDialog(index = -1) {
    const data = {
      isFirstTask: this.milestones.length == 0,
      startDate: this.milestoneForm.get('startDate').value,
      task: index > -1 ? this.milestones[index] : null
    }
    const dialogRef = this.dialog.open(AddEditMilestoneComponent, {
      width: '800px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.tasks) {
        if(index > -1) {
          this.milestones[index] = result.tasks[0];
        } else {
          this.milestones = this.milestones.concat(result.tasks);
        }
        this.milestones.sort((a: any,b: any) => {
          if(a.endDate > b.endDate) {
            return 1;
          } else if (a.endDate < b.endDate) {
            return -1;
          } else {
            return 0;
          }
        });
        this.refreshMilestoneEndDate();
      }
    });
  }

  sendForApproval() {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to change the milestone until the gig worker approves/rejects the milestone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {

        let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
        let companyId = "";
        if (isCompanySelected == true)
          companyId = localStorage.getItem('companyId');

        let data = {
          "milestoneId": this.milestoneData.id
        };

        this.providerService.sendForApproval(data, companyId).subscribe((res) => {
          let resSTR = JSON.stringify(res);
          let resJSON = JSON.parse(resSTR);
          if (!resJSON.body.response.status) {
            this.toastr.errorToastr(resJSON.body.response.message);
          } else {
            this.toastr.successToastr(resJSON.body.response.message);
            this.disableSubmitApprovalButton = true;
            this.checkIfMilestoneExist();
          }
        }, (err) => {
          this.toastr.errorToastr(err.errors);
        });
      } else if (result.dismiss === swal.DismissReason.cancel) {

      }
    });

  }

  deleteTask(index) {
    this.milestones.splice(index, 1);
    this.refreshMilestoneEndDate();
  }

  editTask(index) {
    this.openDialog(index);
  }

  refreshMilestoneEndDate() {
    const noOfTasks = this.milestones.length;
    this.milestoneForm.get('endDate').setValue(this.milestones[noOfTasks-1].endDate);
  }

  public createTrustedHtml(blogContent: string) {
    return this.sanitizer.bypassSecurityTrustHtml(blogContent);
  }

  mouseEnter(content) {
    this.popOverContent = content;
  }
  mouseLeave() {
    this.popOverContent = '';
  }
}
