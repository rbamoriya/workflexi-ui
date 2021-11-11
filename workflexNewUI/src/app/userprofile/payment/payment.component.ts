import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor( private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private router: Router, 
    private sharedService: SharedService,
    private userService: UserService,
    private spinner: NgxSpinnerService) { }

  basicInfoForm: FormGroup;
  formSubmitted = false;

  ngOnInit() {
    let redirect: string = this.sharedService.checkUserCredential('payments');

    if(redirect)
      return this.router.navigate([redirect]);

    if(localStorage.getItem('category') === 'Hirer')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);

    if(localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

    this.initilizeForm();
  }

  /**
   * Form initilization
   */
  initilizeForm() {

    this.basicInfoForm = this.formBuilder.group({
      name: [''],
      email: [''],
      gender: [''],
      location: [''],
      mobile: [''],
      photo: [''],
      dob: [''],
      bankName: ['', Validators.required ],
      nameInBank: ['', Validators.required ],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)] ],
      confirmAccountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)] ],
      ifsc: ['', Validators.required ],
    });
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if(!resJSON.body.response.data.gender || resJSON.body.response.data.gender === '')
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);
        //this.message = resJSON.body.response.message;
        this.basicInfoForm.get("name").setValue(resJSON.body.response.data.name);
        this.basicInfoForm.get("email").setValue(resJSON.body.response.data.email);
        this.basicInfoForm.get("gender").setValue(resJSON.body.response.data.gender);
        this.basicInfoForm.get("location").setValue(resJSON.body.response.data.location);
        this.basicInfoForm.get("mobile").setValue(resJSON.body.response.data.alternatePhone);

        this.basicInfoForm.get("photo").setValue(resJSON.body.response.data.photo);

        this.basicInfoForm.get("dob").setValue(resJSON.body.response.data.dob);

        this.basicInfoForm.get("bankName").setValue(resJSON.body.response.data.bank.bankName);
        this.basicInfoForm.get("nameInBank").setValue(resJSON.body.response.data.bank.nameInBank);
        this.basicInfoForm.get("accountNumber").setValue(resJSON.body.response.data.bank.accountNumber);
        this.basicInfoForm.get("confirmAccountNumber").setValue(resJSON.body.response.data.bank.accountNumber);
        this.basicInfoForm.get("ifsc").setValue(resJSON.body.response.data.bank.ifscCode);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  submitForm() {

    let accountNumber = this.basicInfoForm.get('accountNumber').value;
    let confirmAccountNumber = this.basicInfoForm.get('confirmAccountNumber').value;

    if(accountNumber !== confirmAccountNumber)
      return this.toastr.errorToastr('Account number & confirm account number are not same.');

    this.formSubmitted = true;
    if(this.basicInfoForm.valid) {
      let formObj = this.basicInfoForm.getRawValue();
      formObj.alternateMobile = this.basicInfoForm.value.mobile;
      delete formObj['mobile'];
      delete formObj['confirmAccountNumber'];
      delete formObj['photo'];
      formObj['accountNumber'] = accountNumber ? accountNumber.toString() : '';
      let serializedForm = JSON.stringify(formObj);

      this.spinner.show();
      this.userService.updateUserDetails(serializedForm).subscribe((res) => {
        this.spinner.hide();
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr("Payment details updated successfully");
          localStorage.setItem("isEmailVerified", resJSON.body.response.isEmailVerified);
          localStorage.setItem("newUser", "false");
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
        }
      }, (err) => {
        this.spinner.hide();
        this.toastr.errorToastr(err.errors);
      });
    }
  }
}
