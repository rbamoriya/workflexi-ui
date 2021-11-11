import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleAddressParserService } from 'src/app/services/google-address-parser.service';
import { UserService } from 'src/app/services/user.service';


export const passwordMatchValidator: ValidatorFn = (control: FormControl): ValidationErrors | null => {
  if (control && control.parent && (control.parent.get('password').value === control.value))
    return null;
  else
    return {passwordMismatch: true};
};

@Component({
  selector: 'app-standalone-registration',
  templateUrl: './standalone-registration.component.html',
  styleUrls: ['./standalone-registration.component.scss']
})
export class StandaloneRegistrationComponent implements OnInit {
  isValidated = false;
  registrationForm: FormGroup;
  Factor: any = new Object();

  passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

  customOptions: OwlOptions = {
    loop: true,
    dots: true,
    items: 1,
    dotsData: true,
    // autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
    responsive:{
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
  }

  constructor(private formBuilder: FormBuilder,
    private googleAddressParser: GoogleAddressParserService,
    public userService: UserService,
    private router: Router, 
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    if(localStorage.getItem('userId')) {
      this.router.navigate(['/auth/inboarding']);
      return;
    }
      
    this.initilizeForm();
  }

  submit_form(form: NgForm) {
    console.log(form);
    this.isValidated = true;
  }

  initilizeForm() {

    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required ],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
      confirmPassword: ['', [passwordMatchValidator]],
      gender: ['', Validators.required],
      location: ['', Validators.required ],
      mobile: ['', Validators.required],
    });
  }

  selectGender(gender) {
    this.registrationForm.get('gender').setValue(gender);
  }

  onAutocompleteSelected(event) { 
    const address = event.formatted_address ? event.formatted_address : this.googleAddressParser.getAddressAsString(event.address_components);
    this.registrationForm.get('location').setValue(address);
  }

  validateEmail() {
    const emailControl = this.registrationForm.get('email');
    console.log(emailControl);
    if(emailControl.valid && emailControl.dirty) {
      this.userService.duplicateEmailValidation(emailControl.value)
      .subscribe(resp => {
        let resSTR = JSON.stringify(resp);
        let resJSON = JSON.parse(resSTR);
        if(resJSON.body.response.status) {
          emailControl.setErrors(null);
        } else {
          emailControl.setErrors({duplicate: true});
        }
      });
    }
  }

  submit() {
    let serializedForm = JSON.stringify(this.registrationForm.value);
    this.userService.createUser(serializedForm).subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        //this.isValidated = true;
        this.router.navigate(['/userprofile/thankyou']);
      }
    }, (err) => { 
      this.spinner.hide();
      console.log(err)
      this.toastr.errorToastr(err.errors);
    }, () => {
    });
  }
}
