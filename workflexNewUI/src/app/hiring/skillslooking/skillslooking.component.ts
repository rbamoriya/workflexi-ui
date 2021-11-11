import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { SeekerService } from '../../services/seeker.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { FileTypeEnum, ImageFiles } from '../../models/image-files.model';
import { ProviderService } from 'src/app/services/provider.service';
import { GoogleAddressParserService } from 'src/app/services/google-address-parser.service';

//To run jquery
declare var $:any;

export function maximumExperienceValidation(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const minExperience = control.parent && control.parent.get('totalExperienceInYears') ? control.parent.get('totalExperienceInYears').value : null;
    const maxExperience = control.value;
    if(minExperience && maxExperience && Number(minExperience) >= Number(maxExperience)) {
      return {error: "Maximum experience should be greater than minimum experience"}
    }
    return null;
  };
}

@Component({
  selector: 'app-skillslooking',
  templateUrl: './skillslooking.component.html',
  styleUrls: ['./skillslooking.component.scss']
})
export class SkillslookingComponent implements OnInit {

  constructor( private formBuilder: FormBuilder,
    private googleAddressParser: GoogleAddressParserService,
    public toastr: ToastrManager,
    private router: Router, 
    private sharedService: SharedService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private providerService : ProviderService,
    private seekerService : SeekerService) { }

  basicInfoForm: FormGroup;
  imageFiles: ImageFiles[] = [];
  imgUrl:string = '';
  formSubmitted = false;
  //Dropdown variables
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  skillList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: any = {};

  ngOnInit() {
    if(localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);
      
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
    let redirect: string = this.sharedService.checkUserCredential('hiringinfo');

    if(redirect)
      return this.router.navigate([redirect]);

    if(localStorage.getItem('category') === 'Gig Worker')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);

    this.initilizeForm();
  }

  /**
   * Form initilization
   */
  initilizeForm() {
    this.basicInfoForm = this.formBuilder.group({
      locationPreferences: ['', Validators.required ],
      skill: ['', Validators.required ],
      totalExperienceInYears: ['', [Validators.required, Validators.min(0)]],
      maximumExperienceInYears: ['', [maximumExperienceValidation()]],
      engagementPeriod: ['', [Validators.required, Validators.min(0), Validators.max(12)]],
      remarks: ['', Validators.required ]
    });
    this.getUserDetails();
    this.getSkillList();
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if(!resJSON.body.response.data.gender || resJSON.body.response.data.gender === '')
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
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
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  createSeeker() {

    this.formSubmitted = true;
    if(this.basicInfoForm.valid) {
      let data = this.basicInfoForm.getRawValue();
      var location = [];
      location.push(data.locationPreferences);
      data.locationPreferences = location;
      data.requestType = "gig";
      let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
      if(isCompanySelected == true)
        data.companyId = localStorage.getItem('companyId');

      this.spinner.show();
      this.seekerService.createSeeker(data).subscribe((res) => {
        this.spinner.hide();
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          if(localStorage.getItem('subcategory') === "Company") {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
          } else {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
          }
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    }

  }

  onAutocompleteSelected(event) {
    const address = event.formatted_address ? event.formatted_address : this.googleAddressParser.getAddressAsString(event.address_components);
    this.basicInfoForm.get('locationPreferences').setValue(address);
  }
}
