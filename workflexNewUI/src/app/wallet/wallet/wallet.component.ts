import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CommonService } from '../../../app/services/common.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ProviderService } from 'src/app/services/provider.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var Razorpay: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  subscription: Subscription;

  // errors;
  // message;
  userRoles;
  userId;
  isPrimaryRoleExist;
  companyId;
  isCompanySelected;
  userSubscriptionId = null;
  balance;
  amount = null;
  walletHistory = null;
  razorpayAPIKey = environment.razorpayAPIKey;
  angForm: FormGroup;
  loadHistory:boolean = false;

  fromDateModel: any = new Date();
  toDateModel: any = new Date();

  name;
  
  // Decentro
  qrCodePath: any;
  decentro: any;

  constructor(private fb: FormBuilder, 
    private commonService : CommonService, 
    private providerService : ProviderService, 
    private userService: UserService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    public toastr: ToastrManager,
    public datePipe: DatePipe) {
    this.commonService.isAuthenticated();
    this.userRoles = localStorage.getItem('userRoles');
    this.userId = localStorage.getItem('userId');
    this.isPrimaryRoleExist = this.isRoleExist(JSON.parse(this.userRoles), "ROLE_PRIMARY_USER");
    this.companyId = localStorage.getItem('companyId');
    this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    
  }

  ngOnInit() {
    this.createRechargeForm();
    this.walletBalance();
    this.getUserDetails();

    this.fromDateModel.setMonth(new Date().getMonth() - 1);
  }

  createRechargeForm() {
    this.angForm = this.fb.group({
      amount: ['', Validators.required]
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  isRoleExist(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? this.isRoleExist(json[key], value) : json[key] === value;
         return contains;
    });
    return contains;
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.decentro = resJSON.body.response.data.decentro;
        this.name = resJSON.body.response.data.name;
        if(this.decentro && this.decentro.qrCode ) {
          this.qrCodePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.decentro.qrCode);
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }
  
  walletBalance(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    this.providerService.walletBalance(companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        //this.message = resJSON.body.response.message;
        this.balance = JSON.parse(resJSON.body.response.data).balance;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });

  }

  walletStatement(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    const toDate = this.datePipe.transform(this.toDateModel, 'yyyy-MM-dd');
    const fromDate = this.datePipe.transform(this.fromDateModel, 'yyyy-MM-dd');
    this.providerService.walletStatement(companyId, toDate, fromDate).subscribe((res) => {
      this.loadHistory = true;
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
        this.walletHistory = undefined;
      } else {
        // document.getElementById("display_none_walletHistory").style.display = "block";
        this.walletHistory = this.reverseObject(JSON.parse(resJSON.body.response.data).statement);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  reverseObject(obj){
    return obj.reverse();
  }
  convertToDate(unixtimestamp){
   // Months array
   var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   // Convert timestamp to milliseconds
   var date = new Date(unixtimestamp);
   // Year
   var year = date.getFullYear();
   // Month
   var month = months_arr[date.getMonth()];
   // Day
   var day = date.getDate();
   // Hours
   var hours = date.getHours();
   // Minutes
   var minutes = "0" + date.getMinutes();
   // Seconds
   var seconds = "0" + date.getSeconds();
   // Display date time in MM-dd-yyyy h:m:s format
   var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
   return convdataTime;
  }

}
