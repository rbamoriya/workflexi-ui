import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTS } from 'src/app/constants/constants';
import { ProviderService } from 'src/app/services/provider.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import * as CONSTANTS_CLASS from '../../constants/constants';

declare var $: any;
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  constructor(private router: Router,
    public toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private userService: UserService,
    private providerService: ProviderService,
    private spinner: NgxSpinnerService) {
  }

  ROUTS: any = ROUTS;
  showPage: boolean = false;
  public form: FormGroup;
  pdfSrc: string;
  formSubmitted = false;
  basicInfoForm: FormGroup;
  providerDetails: any;
  isCompanySelected = false;
  url;
  format;
  gigsList = null;
  pDetails: any;
  isSameOrganization = false;
  videoSrc;
  //Dropdown variables
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  skillList: any[] = [];
  selectedItems: any[] = [];
  selectedRenumarationItems: any[] = [];
  dropdownSettings: any = {};
  rnumarationType: any = ['Per Hour', 'Per Day', 'Per Week', 'Per Month'];
  videoFileName = null;
  nextTrue = true;

  ngOnInit() {

    if (localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

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
    let redirect: string = this.sharedService.checkUserCredential('skills');

    if (redirect)
      return this.router.navigate([redirect]);

    if (localStorage.getItem('category') === 'Hirer')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);

    if (localStorage.getItem('isEmailVerified') === 'false')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

    this.initilizeForm();
  }

  /**
   * Form initilization
   */
  initilizeForm() {

    this.basicInfoForm = this.formBuilder.group({
      document: '',
      title: ['', Validators.required],
      skill: ['', Validators.required],
      totalExperienceInYears: ['', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]],
      totalExperienceInMonths: ['', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$"), Validators.max(11)]],
      remunerationType: ['', Validators.required],
      remuneration: ['', [Validators.required, Validators.min(0)]],
      descriptions: '',
      location: '',
      dob: [''],
      bankName: [''],
      nameInBank: [''],
      accountNumber: [''],
      ifsc: [''],
    });
    this.getUserDetails();
    this.getProvidersList();
    this.getSkillList();
  }

  getSkillList() {
    this.providerService.skillList().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.skillList = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        if (!resJSON.body.response.data.gender || resJSON.body.response.data.gender === '')
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);
        this.basicInfoForm.get("location").setValue(resJSON.body.response.data.location);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getProvidersList() {
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if (isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.listProvider(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.gigsList = resJSON.body.response.data;
        if (this.gigsList.length > 0) {
          this.getProviderDetails('gig', this.gigsList[0].id);
        } else {
          this.nextTrue = false;
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getProviderDetails(type, id) {
    this.providerService.providerDetails(id, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {

        this.providerDetails = resJSON.body.response.data[0].data;
        this.selectedItems = resJSON.body.response.data[0].data.skill;
        this.pDetails = resJSON.body.response.data[0];

        if (type == "gig") {
          this.providerDetails.skill = this.selectedItems;
          this.selectedRenumarationItems = [];
          this.selectedRenumarationItems.push(this.providerDetails.remunerationType);
          this.providerDetails.remunerationType = this.selectedRenumarationItems;
          setTimeout(function () {
            $("#selectSkill").click();
          }, 300);
          //Update forms
          this.basicInfoForm.get("skill").setValue(this.providerDetails.skill);
          this.basicInfoForm.get("title").setValue(this.providerDetails.title);
          this.basicInfoForm.get("totalExperienceInYears").setValue(this.providerDetails.totalExperienceInYears);
          this.basicInfoForm.get("totalExperienceInMonths").setValue(this.providerDetails.totalExperienceInMonths);
          this.basicInfoForm.get("remunerationType").setValue(this.providerDetails.remunerationType);
          this.basicInfoForm.get("remuneration").setValue(this.providerDetails.remuneration);
          this.basicInfoForm.get("descriptions").setValue(this.providerDetails.descriptions);

          if (this.providerDetails.document != undefined || this.providerDetails.document != null)
            this.getVideoResource('certificates', this.providerDetails.document);
          //this.providerDetails.expiresOn = this.providerDetails.expiresOn.replace(/Z/g,'').toString();
        }
        if ((resJSON.body.response.data[0].company != null && resJSON.body.response.data[0].company.companyCity == localStorage.getItem('companyId')) ||
          (resJSON.body.response.data[0].user != null && resJSON.body.response.data[0].user.username == localStorage.getItem('userId'))) {
          this.isSameOrganization = true;
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getVideoResource(folder, file) {
    this.providerService.showVideoResource(folder, file, "provider").subscribe((res) => {
      const url = URL.createObjectURL(res);
      var video = document.querySelector('video');
      video.src = url;
      this.videoSrc = url;
      this.url = url;
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  createProvider(type) {

    this.formSubmitted = true;


    if (this.basicInfoForm.valid) {

      let data: any = {};

      if (type == "gig") {
        data = this.basicInfoForm.getRawValue();
        var location = [];
        location.push(data.location);
        data.location = location;
        data.remunerationType = this.basicInfoForm.controls.remunerationType.value[0];
        // var skill = [];
        // skill.push(data.skill);
        // data.skill = skill;
        data.requestType = type;

        //Add video url
        // data.url = this.url;
        if (this.videoFileName != null && this.videoFileName != "") {
          data.document = this.videoFileName;
        }

        this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
        if (this.isCompanySelected == true)
          data.companyId = localStorage.getItem('companyId');

        data = JSON.stringify(data);
      }

      // if(type == "event"){
      //   data.requestType = type;
      //   data.eventPhoto = document.getElementById("myeventPhoto").innerHTML;;
      // }

      // if(type == "passion"){
      //   data.requestType = type;
      //   data.passionCertificate = document.getElementById("myCertificate").innerHTML;
      // }

      this.spinner.show();
      this.providerService.createProvider(data).subscribe((res) => {
        this.spinner.hide();
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr("Skills & Experience added successfully");
          if (localStorage.getItem('subcategory') === "Company") {

            this.userService.getUserDetails().subscribe((res) => {
              let resSTR = JSON.stringify(res);
              let resJSON = JSON.parse(resSTR);
              if (!resJSON.body.response.status) {
                return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
              } else {
                if (resJSON.body.response.data.company != null) {
                  return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);

                } else {
                  return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
                }
              }
            }, (err) => {
              return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
            });

          } else {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_PAYMENT_INFO]);
          }
        }
      }, (err) => {
        this.spinner.hide();
        this.toastr.errorToastr(err.errors);
      });
    }
  }

  onSelectFile(event) {
    const file = event.target.files && event.target.files[0];

    if (file) {

      if (file.size > CONSTANTS_CLASS.CONSTANTS.MAX_VIDEO_FILE_UPLOAD_SIZE_LIMIT) {
        return this.toastr.errorToastr("Upload video less than 50 MB");
      }

      if (file.type.indexOf("mp4") < -1 || file.type.indexOf("mov") < -1) {
        return this.toastr.errorToastr("Only files are allowed mp4 and mov");
      }

      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf("image") > -1) {
        this.format = "image";
      } else if (file.type.indexOf("video") > -1) {
        this.format = "video";
      }
      reader.onload = event => {
        this.url = (<FileReader>event.target).result;
      };
      this.onVideoFileUpload();
    }
  }

  onVideoFileUpload() {
    let file = (<HTMLInputElement>document.getElementById('video-file')).files[0];

    var companyId = "";
    this.isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    if (this.isCompanySelected == true)
      companyId = localStorage.getItem('companyId');

    const formData = new FormData();
    formData.append('document', file);

    this.spinner.show();
    this.toastr.infoToastr("Please wait, Video uploading is in progress...");
    this.providerService.uploadVideo(formData, companyId).subscribe((res) => {
      this.spinner.hide();
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (resJSON.body.response.status) {
        this.videoFileName = resJSON.body.response.data;
      } else {
        return this.toastr.errorToastr(resJSON.body.response.message);
      }
    }, (err) => {
      this.spinner.hide();
      return this.toastr.errorToastr("Video size should be less than 50 MB");
    });
  }
}
