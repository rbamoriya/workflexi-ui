import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { FileTypeEnum, ImageFiles } from '../../models/image-files.model';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAddressParserService } from 'src/app/services/google-address-parser.service';

//To run jquery
declare var $: any;

@Component({
  selector: 'app-basicinfo',
  templateUrl: './basicinfo.component.html',
  styleUrls: ['./basicinfo.component.scss']
})
export class BasicinfoComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private googleAddressParser: GoogleAddressParserService,
    public toastr: ToastrManager,
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer) { }

  basicInfoForm: FormGroup;
  imageFiles: ImageFiles[] = [];
  imgUrl: string = '';
  formSubmitted = false;
  isEmailVarify = false;
  isNewUser = true;
  gigworkerBasicInfoSrcData: any;

  ngOnInit() {
    let redirect: string = this.sharedService.checkUserCredential('hiringinfo');

    if (redirect)
      return this.router.navigate([redirect]);

    if (localStorage.getItem('category') === 'Gig Worker')
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_GIGWORKER_BASIC_INFO]);

    if (localStorage.getItem('isEmailVerified') === 'true') {
      localStorage.setItem("newUser", "false");
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD]);
    }

    this.initilizeForm();
  }

  /**
   * Form initilization
   */
  initilizeForm() {

    this.basicInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      gender1: [''],
      gender2: [''],
      gender3: [''],
      location: ['', Validators.required],
      mobile: [''],
      dob: [''],
      bankName: [''],
      nameInBank: [''],
      accountNumber: [''],
      ifsc: [''],
    });
    this.getUserDetails();
  }

  /**
   * Check file already selected or not
   */
  checkFileAlreadySelected(file: File) {

    for (let index = 0; index < this.imageFiles.length; index++) {

      let imageFile: ImageFiles = this.imageFiles[index];

      if (!imageFile.file || !imageFile.file.name)
        continue;

      if (imageFile.file.name === file.name) {
        return true;
      }
    }

    return false;
  }

  /**
  * On file change event
  */
  onFileChange(event: any) {

    let fileList: FileList = event.target.files;
    this.imgUrl = '';

    if (fileList.length < 1) {
      return;
    }

    for (let index = 0; index < fileList.length; index++) {

      let file: File = fileList[index];

      // Check is file already selected
      if (this.checkFileAlreadySelected(file)) {
        continue;
      }

      // Add file to list
      if (file.size > CONSTANTS_CLASS.CONSTANTS.MAX_FILE_UPLOAD_SIZE_LIMIT) {
        return this.toastr.errorToastr("Image size should be less than 500 kb");
      }

      let imageFile: ImageFiles = new ImageFiles();
      imageFile.id = CONSTANTS_CLASS.getRandomNumber().toString();
      imageFile.file = file;

      if (file.type.indexOf("image") != -1) {
        imageFile.fileTypeEnum = FileTypeEnum[FileTypeEnum.IMAGE];
      } else if (file.type.indexOf("word") != -1) { // 'application/msword'
        imageFile.fileTypeEnum = FileTypeEnum[FileTypeEnum.DOC];
      } else if (file.type.indexOf("pdf") != -1) { // 'application/pdf'
        imageFile.fileTypeEnum = FileTypeEnum[FileTypeEnum.PDF];
      } else if (file.type.indexOf("spreadsheet") != -1) { // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        imageFile.fileTypeEnum = FileTypeEnum[FileTypeEnum.EXCEL];
      } else {
        imageFile.fileTypeEnum = FileTypeEnum[FileTypeEnum.OTHER];
      }
      var reader = new FileReader();
      reader.onload = (event: any) => {
        imageFile.fileUrl = event.target.result;
      }
      reader.readAsDataURL(file);

      this.gigworkerBasicInfoSrcData = "";
      this.imageFiles = [];
      this.imageFiles.push(imageFile);
      $('#image-icon').css("display", "none");

    }

  }

  checked(id: string, checked: boolean) {
    if (checked) {
      if (id !== 'male') {
        // $('#male-checkbox').prop('checked', false);
        this.basicInfoForm.get("gender1").setValue(false);
      }
      if (id !== 'female') {
        // $('#female-checkbox').prop('checked', false);
        this.basicInfoForm.get("gender2").setValue(false);
      }
      if (id !== 'other') {
        // $('#other-checkbox').prop('checked', false);
        this.basicInfoForm.get("gender3").setValue(false);
      }
    }
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        //this.message = resJSON.body.response.message;
        this.basicInfoForm.get("name").setValue(resJSON.body.response.data.name);
        this.basicInfoForm.get("email").setValue(resJSON.body.response.data.email);
        this.isEmailVarify = resJSON.body.response.data.isEmailVerified;
        localStorage.setItem("isEmailVerified", resJSON.body.response.isEmailVerified);
        if (resJSON.body.response.isEmailVerified == true) {
          localStorage.setItem("newUser", "false");
        }
        if (resJSON.body.response.data.email != undefined)
          this.isNewUser = false;
        if (resJSON.body.response.data.gender === 'Male')
          this.basicInfoForm.get("gender1").setValue(true);
        if (resJSON.body.response.data.gender === 'FeMale')
          this.basicInfoForm.get("gender2").setValue(true);
        if (resJSON.body.response.data.gender === 'Other')
          this.basicInfoForm.get("gender3").setValue(true);
        this.basicInfoForm.get("location").setValue(resJSON.body.response.data.location);
        this.basicInfoForm.get("mobile").setValue(resJSON.body.response.data.alternatePhone);
        this.getUserImage(resJSON.body.response.data.photo);

        this.basicInfoForm.get("dob").setValue(resJSON.body.response.data.dob);

        this.basicInfoForm.get("bankName").setValue(resJSON.body.response.data.bank.bankName);
        this.basicInfoForm.get("nameInBank").setValue(resJSON.body.response.data.bank.nameInBank);
        this.basicInfoForm.get("accountNumber").setValue(resJSON.body.response.data.bank.accountNumber);
        this.basicInfoForm.get("ifsc").setValue(resJSON.body.response.data.bank.ifscCode);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getUserImage(name: string) {
    if (name != undefined && name != null && name != '') {
      this.userService.getUserImage(name).subscribe(data => {
        var dd = URL.createObjectURL(data);
        this.gigworkerBasicInfoSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        $('#image-icon').css("display", "none");
      });
    }
  }

  submitForm() {
    this.formSubmitted = true;
    if (!this.basicInfoForm.value.gender1 && !this.basicInfoForm.value.gender2 && !this.basicInfoForm.value.gender3)
      return this.toastr.errorToastr('Please select gender');

    if (this.basicInfoForm.valid) {
      let formObj = this.basicInfoForm.getRawValue();
      if (this.basicInfoForm.value.gender1)
        formObj.gender = 'Male';
      if (this.basicInfoForm.value.gender2)
        formObj.gender = 'FeMale';
      if (this.basicInfoForm.value.gender3)
        formObj.gender = 'Other';
      formObj.alternateMobile = this.basicInfoForm.value.mobile;
      delete formObj['gender1'];
      delete formObj['gender2'];
      delete formObj['gender3'];
      delete formObj['mobile'];
      if (this.imageFiles.length > 0) {
        formObj.photo = this.imageFiles[0].fileUrl;
      }
      let serializedForm = JSON.stringify(formObj);

      this.spinner.show();
      this.userService.updateUserDetails(serializedForm).subscribe((res) => {
        this.spinner.hide();
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if (!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.isEmailVarify = resJSON.body.response.isEmailVerified;
          this.isNewUser = false;
          localStorage.setItem("isEmailVerified", resJSON.body.response.isEmailVerified);
          localStorage.setItem("newUser", "false");
          if (!this.isEmailVarify) {
            this.toastr.successToastr("Please go to your mailbox, verify your email id and re-login(if required)");
          } else {
            this.toastr.successToastr(resJSON.body.response.message);
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_SKILL_LOOKING]);
          }

        }
      }, (err) => {
        this.spinner.hide();
        this.toastr.errorToastr(err.errors);
      });
    }
  }

  onAutocompleteSelected(event) {
    const address = event.formatted_address ? event.formatted_address : this.googleAddressParser.getAddressAsString(event.address_components);
    this.basicInfoForm.get('location').setValue(address);
  }

  validateEmail() {
    const emailControl = this.basicInfoForm.get('email');
    if (emailControl.valid && emailControl.dirty) {
      this.userService.duplicateEmailValidation(emailControl.value)
        .subscribe(resp => {
          let resSTR = JSON.stringify(resp);
          let resJSON = JSON.parse(resSTR);
          if (resJSON.body.response.status) {
            emailControl.setErrors(null);
          } else {
            emailControl.setErrors({ duplicate: true });
          }
        });
    }
  }
}
