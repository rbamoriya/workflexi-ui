import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { SeekerService } from '../../services/seeker.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { FileTypeEnum, ImageFiles } from '../../models/image-files.model';
import { ProviderService } from 'src/app/services/provider.service';
import { maximumExperienceValidation } from '../skillslooking/skillslooking.component';
import { GoogleAddressParserService } from 'src/app/services/google-address-parser.service';

//To run jquery
declare var $:any;

@Component({
  selector: 'app-edit-skillslooking',
  templateUrl: './edit-skillslooking.component.html',
  styleUrls: ['./edit-skillslooking.component.scss']
})
export class EditSkillslookingComponent implements OnInit {

  constructor( private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private router: Router, 
    private googleAddressParser: GoogleAddressParserService,
    private sharedService: SharedService,
    private userService: UserService,
    public activatedRoute:ActivatedRoute,
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
  isCompanySelected = null;
  isSeekerProfileAlreadyExist = false;
  seekerDetails = null;
  id:any;
  new:boolean = false;

  ngOnInit() {
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

    if(localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_HIRER_BASIC_INFO]);

    let id : string = this.activatedRoute.snapshot.paramMap.get('id');
    if(id === undefined || id === null){
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIGWORKER_PROFILE]);
    } else {
      
      if(id == 'new'){
        this.id = undefined;
        this.new = true;
      } else {
        this.new = false;
        this.id = id;
      }
    }
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
    if(!this.new){
      this.getSeekerDetails();
    }
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

  submit(data){
    if(this.id !== undefined){
      this.updateSeeker(data,'gig')
    }else {
      this.createSeeker();
    }
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
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_PROFILE], { queryParams: {tab: 'skill-looking'}});
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    }
  }

  updateSeeker(data, type) {

    if(type == "gig"){
      data = this.basicInfoForm.getRawValue();
      var location = [];
      location.push(data.locationPreferences);
      data.locationPreferences = location;
      data.requestType = type;
    }

    this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    if(this.isCompanySelected == true)
      data.companyId = localStorage.getItem('companyId');

    this.seekerService.updateSeeker(data, this.id).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_PROFILE], { queryParams: {tab: 'skill-looking'}});
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getSeekerDetails(seekerId = "0"){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    // if(isCompanySelected == true){
    let companyId = "";
    if(isCompanySelected == true){
      companyId = localStorage.getItem('companyId');
    }
    if(seekerId == "0"){
      seekerId = this.id;
    }
    this.providerService.seekerDetails(seekerId, companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.selectedItems = resJSON.body.response.data[0].data.skill;
        let seekerDetails = resJSON.body.response.data[0].data;
        //Update forms
        seekerDetails.skill = this.selectedItems;

        //Update forms
        this.basicInfoForm.get("skill").setValue(seekerDetails.skill);
        this.basicInfoForm.get("locationPreferences").setValue(seekerDetails.locationPreferences[0]);
        this.basicInfoForm.get("totalExperienceInYears").setValue(seekerDetails.totalExperienceInYears);
        this.basicInfoForm.get("maximumExperienceInYears").setValue(seekerDetails.maximumExperienceInYears);
        this.basicInfoForm.get("engagementPeriod").setValue(seekerDetails.engagementPeriod);
        this.basicInfoForm.get("remarks").setValue(seekerDetails.remarks);

        setTimeout(function () {
          $("#selectSkill").click();
        }, 300);

        if(this.isSeekerProfileAlreadyExist){
          this.seekerDetails = resJSON.body.response.data[0].data;
          this.seekerDetails.skill = this.seekerDetails.skill[0];
        //  this.seekerDetails.expiresOn = this.gigDetails.expiresOn.replace(/Z/g,'').toString();
        } else {
          this.seekerDetails = resJSON.body.response.data;
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  onAutocompleteSelected(event) {
    const address = event.formatted_address ? event.formatted_address : this.googleAddressParser.getAddressAsString(event.address_components);
    this.basicInfoForm.get('locationPreferences').setValue(address);
  }

  skipAddSkills() {
    return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD], { queryParams: {search: 'gig'}});
  }
}
