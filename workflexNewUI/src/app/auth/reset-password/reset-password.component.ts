import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OtpService } from '../login/OtpService';

export const passwordMatchValidator: ValidatorFn = (control: FormControl): ValidationErrors | null => {
  if (control && control.parent && (control.parent.get('password').value === control.value))
    return null;
  else
    return {passwordMismatch: true};
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  resetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, 
              private otpService: OtpService,
              public toastr: ToastrManager,
              private router: Router) { }


  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)] ],
      confirmPassword: ['', [Validators.required, passwordMatchValidator]]
    });
  }

  reset() {
    const token = window.location.pathname.split("/").pop().replace("%2B", " ");
    const password = this.resetForm.get('password').value;
    this.otpService.updatePassword(token, password).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
          this.toastr.successToastr(resJSON.body.response.message);
          this.router.navigate(['auth/login']);
      }
    }, (err) => {
    });
  }
}
