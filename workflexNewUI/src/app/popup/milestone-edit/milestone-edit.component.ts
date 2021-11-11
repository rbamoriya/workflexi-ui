import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProviderService } from 'src/app/services/provider.service';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import {INDIAN_DATE_FORMAT} from 'src/app/constants/constants';

declare var $: any;
@Component({
  selector: 'app-milestone-edit',
  templateUrl: './milestone-edit.component.html',
  styleUrls: ['./milestone-edit.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: INDIAN_DATE_FORMAT }
  ]
})
export class MilestoneEditComponent implements OnInit {

  uniqueId: string;
  milestoneData: any;
  editForm: FormGroup;
  milestoneForm: FormGroup;
  addNew: boolean = false;
  minDate: any;
  maxDate: any;

  constructor(private _rootNode: ElementRef,
    private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private providerService: ProviderService) { }

  ngOnInit() {
  }

  //-------------------------------popup things------------------------------//
  @Input() title: string;
  @Input() showClose: boolean = true;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output("editDone") editDone: EventEmitter<any> = new EventEmitter();
  @Output("addCancel") addCancel: EventEmitter<any> = new EventEmitter();

  modalEl = null;
  id: string = uniqueId('modal_');

  open(uniqueId, data: string) {
    this.uniqueId = uniqueId;

    let resSTR = JSON.stringify(data);
    this.milestoneData = JSON.parse(resSTR);

    if (this.milestoneData.milestones[this.uniqueId].endDate == '' || this.milestoneData.milestones[this.uniqueId].endDate == null || this.milestoneData.milestones[this.uniqueId].endDate == undefined) {
      this.addNew = true;
    } else {
      this.addNew = false;
    }
    this.inIt();
    this.modalEl.modal('show');
  }

  /**
   * Hide popup
   */
  close() {
    if (this.addNew == true) {
      this.addCancel.emit();
    }
    this.milestoneForm.reset();
    this.modalEl.modal('hide');
  }

  /**
   * Close popup
   */
  closeInternal() { // close modal when click on times button in up-right corner
    this.onClose.next(null); // emit event
    this.close();
  }

  /**
   * Event after view init
   */
  ngAfterViewInit() {
    this.modalEl = $(this._rootNode.nativeElement).find('div.modal');
  }

  /**
   * Has selector
   */
  has(selector) {
    return $(this._rootNode.nativeElement).find(selector).length;
  }
  //END-------------------------------popup things------------------------------//

  formatDate(date) {
    var d = date.split("/");
    return [d[2], d[1], d[0]].join('-');
  }

  inIt() {

    this.milestoneForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    var startDateDB = new Date(this.formatDate(this.milestoneData.startDate));
    this.milestoneForm.get("startDate").setValue(startDateDB);
    var endDateDB = new Date(this.formatDate(this.milestoneData.endDate));
    const milestoneStartDate = new Date(this.formatDate(this.milestoneData.startDate));
    const todaysDate = new Date();
    this.minDate = todaysDate > milestoneStartDate ? todaysDate : milestoneStartDate;
    this.maxDate = endDateDB;
    this.milestoneForm.get("endDate").setValue(endDateDB);

    // let data: any = this.milestoneData.milestones.filter(item => item.uniqueId === this.uniqueId);

    var endDate = new Date(this.formatDate(this.milestoneData.milestones[this.uniqueId].endDate));
    this.editForm = this.formBuilder.group({
      endDate: [endDate, [Validators.required]],
      amount: [this.milestoneData.milestones[this.uniqueId].amount, [Validators.required]],
      description: [this.milestoneData.milestones[this.uniqueId].description, [Validators.required]],
    });
  }

  submit() {
    if (this.editForm.valid) {
      for (var index = 0; index < this.milestoneData.milestones.length; index++) {
        if (index.toString() == this.uniqueId) {
          this.milestoneData.milestones[index].amount = this.editForm.get("amount").value;
          this.milestoneData.milestones[index].description = this.editForm.get("description").value;

          var d = new Date(this.editForm.get("endDate").value);
          var monDt = parseInt(d.getMonth().toString()) + 1;
          var date = d.getDate().toString().padStart(2, "0") + '/' + monDt.toString().padStart(2, "0") + '/' + d.getFullYear();

          this.milestoneData.milestones[index].endDate = date;
        }
      }
      this.updateMilestone(0);
    } else {
      if (this.editForm.get("description").value == null || this.editForm.get("description").value == '' || this.editForm.get("description").value == undefined) {
        this.toastr.errorToastr("Please add description");
      }
    }
  }

  isArraySorted(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i + 1] && (arr[i + 1] > arr[i])) {
        continue;
      } else if (arr[i + 1] && (arr[i + 1] < arr[i])) {
        return false;
      }
    }
    return true;
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  updateMilestone(sendForApproval = 0) {
    var data = this.milestoneForm.getRawValue();
    var arr = [];
    var milestonesTemp = this.milestoneData.milestones;
    for (var index = 0; index < this.milestoneData.milestones.length; index++) {
      arr[index] = new Date(this.formatDate(milestonesTemp[index]["endDate"]));

      if (data.startDate > milestonesTemp[index]["endDate"]) {
        this.toastr.errorToastr("Start date can not be greater than End date");
        return false;
      }

      // var d = new Date(milestonesTemp[index]["endDate"]);
      // var monDt = parseInt(d.getMonth().toString()) + 1;
      // milestonesTemp[index]["endDate"] = d.getDate().toString().padStart(2, "0")+'/'+ monDt.toString().padStart(2, "0")+'/'+d.getFullYear();
      // milestonesTemp[index]["endDate"] = d.getDate().toString().padStart(2, "0")+'/'+ monDt.toString().padStart(2, "0")+'/'+d.getFullYear();
    }
    data.milestone = milestonesTemp;
    // delete data.milestones;
    if (!this.isArraySorted(arr)) {
      this.toastr.errorToastr("End dates are not in order");
      return false;
    }
    var stDate = new Date(data.startDate);
    var monSt = parseInt(stDate.getMonth().toString()) + 1;
    data.startDate = stDate.getDate().toString().padStart(2, "0") + '/' + monSt.toString().padStart(2, "0") + '/' + stDate.getFullYear();

    var enDate = new Date(data.endDate);
    var monEn = parseInt(enDate.getMonth().toString()) + 1;
    data.endDate = enDate.getDate().toString().padStart(2, "0") + '/' + monEn.toString().padStart(2, "0") + '/' + enDate.getFullYear();

    data.gigProcessId = this.milestoneData.gigProcess.id;
    data = JSON.stringify(data);

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    this.providerService.updateMilestone(data, this.milestoneData.id, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this.close();
        this.editDone.emit();
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });

  }

}

let modal_id: number = 0;
export function uniqueId(prefix: string): string {
  return prefix + ++modal_id;
}