import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleAddressParserService } from 'src/app/services/google-address-parser.service';
import { ProviderService } from 'src/app/services/provider.service';
import { SeekerService } from 'src/app/services/seeker.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-standalone-registration',
  templateUrl: './standalone-registration.component.html',
  styleUrls: ['./standalone-registration.component.scss']
})
export class StandaloneRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  Factor: any = new Object();

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

  skillList: any[] = [];
  dropdownSettings: any = {};

  constructor(private formBuilder: FormBuilder,
    private googleAddressParser: GoogleAddressParserService,
    public userService: UserService,
    private providerService : ProviderService,
    private seekerService : SeekerService,
    private router: Router, 
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    if(localStorage.getItem('userId')) {
      this.router.navigate(['/auth/inboarding']);
      return;
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: 1
    };
      
    this.initilizeForm();
  }

  initilizeForm() {
    this.getSkillList();
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required ],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      gender: ['', Validators.required],
      locationPreferences: ['', Validators.required ],
      mobile: ['', Validators.required],
      skill: ['', Validators.required],
      totalExperienceInYears: ['', Validators.required],
      maximumExperienceInYears: ['', Validators.required],
      engagementPeriod: ['', Validators.required],
      remarks: ['', Validators.required]

    });
  }

  getSkillList(){
    this.providerService.skillList().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.skillList = resJSON.body.response.data;
      }
    }, (err) => { console.log(err);
      this.toastr.errorToastr(err.errors);
    });
  }

  onAutocompleteSelected(event) { 
    const address = event.formatted_address ? event.formatted_address : this.googleAddressParser.getAddressAsString(event.address_components);
    this.registrationForm.get('locationPreferences').setValue(address);
  }

  submit() {
    let userProfileData = Object.assign({}, {location: this.registrationForm.value.locationPreferences}, this.registrationForm.value);
    let skillData = Object.assign({}, {}, this.registrationForm.value);
    delete userProfileData['locationPreferences'];
    delete userProfileData['skill'];
    delete userProfileData['maximumExperienceInYears'];
    delete userProfileData['totalExperienceInYears'];
    delete userProfileData['engagementPeriod'];
    delete userProfileData['remarks'];
    let serializedForm = JSON.stringify(userProfileData);
    this.userService.createUser(serializedForm).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      console.log(resJSON);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        delete skillData['name'];
        delete skillData['mobile'];
        delete skillData['email'];
        delete skillData['gender'];
        skillData['requestType'] = 'gig';
        skillData['locationPreferences'] = [skillData['locationPreferences']];
        skillData['username'] = this.registrationForm.get('mobile').value;
        skillData['email'] = this.registrationForm.get('email').value;
        let skillDataSerialized = JSON.stringify(skillData);
        this.seekerService.createSeeker(skillDataSerialized, true).subscribe((res) => {
          let resSTR = JSON.stringify(res);
          let resJSON = JSON.parse(resSTR);
          if(!resJSON.body.response.status) {
            this.toastr.errorToastr(resJSON.body.response.message);
          } else {
            this.router.navigate(['/hiring/thankyou']);
          }
        }, (err) => {
          this.toastr.errorToastr(err.errors);
        });
       
      }
    }, (err) => { 
      this.toastr.errorToastr(err.errors);
    }, () => {
    });
  }

  selectGender(gender) {
    this.registrationForm.get('gender').setValue(gender);
  }
}
