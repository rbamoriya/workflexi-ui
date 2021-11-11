import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProviderService } from 'src/app/services/provider.service';
import { Router } from '@angular/router';
import * as CONSTANTS_CLASS from '../../constants/constants';

declare var $:any;
@Component({
  selector: 'app-milestone-reject-reason',
  templateUrl: './milestone-reject-reason.component.html',
  styleUrls: ['./milestone-reject-reason.component.scss']
})
export class MilestoneRejectReasonComponent implements OnInit {

  constructor(private _rootNode: ElementRef,
    private formBuilder:FormBuilder,
    public toastr: ToastrManager,
    private router: Router,
    private providerService:ProviderService) { }

  ngOnInit() {
    this.init();
  }

  addReason:FormGroup;
  milestoneId:string;
  userId:string;
  formSubmit:boolean =false;
  isApproved:boolean;

  init() {
    this.addReason = this.formBuilder.group({ 
      reason: ['', [Validators.required,Validators.maxLength(500)]],
    });
  }

   //-------------------------------popup things------------------------------//
   @Input() title: string;
   @Input() showClose: boolean = true;
   @Output() onClose: EventEmitter<any> = new EventEmitter();
 
   modalEl = null;
   id: string = uniqueId('modal_');
 
   open(milestoneId: string,isApproved:boolean,userId) {
    this.addReason.reset();
    this.isApproved = isApproved;
    this.milestoneId = milestoneId;
    this.userId = userId;
    this.formSubmit = false;
    this.modalEl.modal('show');
   }
 
   /**
    * Hide popup
    */
   close() {
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

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  submit(){
    this.formSubmit = true;
    if(this.addReason.valid || this.isApproved == true) {
      let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      let companyId = "";
      if(isCompanySelected == true)
        companyId = localStorage.getItem('companyId');
      var data = {
        "milestoneId": this.milestoneId,
        "isApproved": this.isApproved,
        "reason": this.addReason.get("reason").value
      }
      this.providerService.approveReject(data, companyId).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          this.close();

          return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    } 

  }
}

let modal_id: number = 0;
export function uniqueId(prefix: string): string {
  return prefix + ++modal_id;
}