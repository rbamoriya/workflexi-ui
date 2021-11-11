import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyOrganizationService } from '../../services/my-organization-service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, NavigationExtras } from '@angular/router';
import * as CONSTANTS_CLASS from '../../constants/constants';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  showMenu = '';
  hide ='';
  assignRoleForm: FormGroup;
  companyList = [];
  updateCompanyForm: FormGroup;
  base64textString = [];
  base64Image;
  flag = true;
  serializedOldForm;
  isCompanyExist;
  companyDetails;
  companyId;
  isPrimaryRoleExist;
  assignedUsers;
  approvalRequests;
  imageSrcData:SafeHtml;
  userRoles;

  constructor(private fb: FormBuilder,
    public router:Router,
    private myOrganizationService : MyOrganizationService,
    private userService:UserService,
    private sanitizer: DomSanitizer,
    public toastr: ToastrManager) {
      this.userRoles = localStorage.getItem('userRoles');
      this.isPrimaryRoleExist = this.isRoleExist(JSON.parse(this.userRoles), "ROLE_PRIMARY_USER");
    }
  
    isRoleExist(json, value) {
      let contains = false;
      Object.keys(json).some(key => {
          contains = typeof json[key] === 'object' ? this.isRoleExist(json[key], value) : json[key] === value;
           return contains;
      });
      return contains;
    }

  ngOnInit() {
    if(!this.isPrimaryRoleExist){
      return this.router.navigate([CONSTANTS_CLASS.ROUTS.HOME]);
    }
    this.createRoleAssignForm();
    this.createCompanyFormValidate();
  }

  createRoleAssignForm() {
    this.assignRoleForm = this.fb.group({
      companyId: ['Select Company'],
      companyName: '',
      address: '',
      isPrimaryOwner: ''
    });
  }

  createCompanyFormValidate() {
    this.updateCompanyForm = this.fb.group({
      name: ['', Validators.required ],
      address: ['', Validators.required ],
      city: ['', Validators.required ],
      state: ['', Validators.required ],
      pincode: ['', Validators.required ],
      website: '',
      gstNumber: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/gi) ],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/gi)] ],
      description: [''],
      logo: '',
      bankName: ['', Validators.required ],
      nameInBank: ['', Validators.required ],
      accountNumber: ['', Validators.required ],
      ifsc: ['', Validators.required ]
    });
    this.getUserDetails();
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.base64Image = 'data:image/png;base64,' + btoa(e.target.result);
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
         this.toastr.errorToastr(resJSON.body.response.message);
        location.reload();
      } else {
          if(resJSON.body.response.data.company != null){
            this.isCompanyExist = true;
            this.companyDetails = resJSON.body.response.data.company;
            // if(localStorage.getItem("createdCompanyId") == resJSON.body.response.data.company.id){
            //   this.isPrimaryRoleExist = true;
            //   localStorage.setItem("isPrimaryRoleExist", "true");
            //   localStorage.setItem("createdCompanyId", null);
            // }
            this.companyId = resJSON.body.response.data.company.id;
            this.updateCompanyForm.get("name").setValue(resJSON.body.response.data.company.companyName);
            this.updateCompanyForm.get("name").disable();

            this.updateCompanyForm.get("city").setValue(resJSON.body.response.data.company.companyCity);
            this.updateCompanyForm.get("state").setValue(resJSON.body.response.data.company.companyState);
            this.updateCompanyForm.get("website").setValue(resJSON.body.response.data.company.companyWebsite);
            this.updateCompanyForm.get("pincode").setValue(resJSON.body.response.data.company.companyPincode);
            this.updateCompanyForm.get("address").setValue(resJSON.body.response.data.company.companyAddress);
            this.updateCompanyForm.get("description").setValue(resJSON.body.response.data.company.companyDescription);
            this.updateCompanyForm.get("gstNumber").setValue(resJSON.body.response.data.company.companyGstnumber);
            this.updateCompanyForm.get("panNumber").setValue(resJSON.body.response.data.company.companyPannumber);

            this.updateCompanyForm.get("bankName").setValue(resJSON.body.response.data.company.bank.bankName);
            this.updateCompanyForm.get("nameInBank").setValue(resJSON.body.response.data.company.bank.nameInBank);
            this.updateCompanyForm.get("accountNumber").setValue(resJSON.body.response.data.company.bank.accountNumber);
            this.updateCompanyForm.get("ifsc").setValue(resJSON.body.response.data.company.bank.ifscCode);
            
            //this.base64textString.push(this.getImage(`D://workflexi-java/uploads/company/`+resJSON.body.response.data.company.companyLogo));
            this.getUserImage(resJSON.body.response.data.company.companyLogo);
            localStorage.setItem("companyId", this.companyId);
            if(this.isPrimaryRoleExist){
              this.getInitiatedCompanyUsers();
              this.processRejectedCompanyAccess();
            }
          } else {
            this.isCompanyExist = false;
          }
          //console.log(this.isCompanyExist);
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getInitiatedCompanyUsers() {
    this.myOrganizationService.getInitiatedCompanyUsers(this.companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(resJSON.body.response.status) {
        this.approvalRequests = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  processRejectedCompanyAccess() {
    this.myOrganizationService.processRejectedCompanyAccess(this.companyId).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(resJSON.body.response.status) {
        this.assignedUsers = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  updateCompany() {
    if(this.updateCompanyForm.valid){
      let formObj = this.updateCompanyForm.getRawValue();
      if(this.base64Image != '' && this.base64Image != undefined && this.base64Image != null)
        formObj.logo = this.base64Image;
      let serializedForm = JSON.stringify(formObj);

      this.myOrganizationService.updateCompany(serializedForm, this.companyId).subscribe((res) => {
        let resSTR = JSON.stringify(res);
        let resJSON = JSON.parse(resSTR);
        if(!resJSON.body.response.status) {
          this.toastr.errorToastr(resJSON.body.response.message);
        } else {
          this.toastr.successToastr(resJSON.body.response.message);
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
        }
      }, (err) => {
        this.toastr.errorToastr(err.errors);
      });
    }
  }

  getUserImage(name: string) {
    if(name != undefined && name != null && name != ''){
      this.userService.getUserImage(name).subscribe(data => {
        var dd = URL.createObjectURL(data);
        this.imageSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
        this.base64textString = [];
        this.base64textString.push(this.imageSrcData);
      });
    } else {
      this.base64textString = [];
    }
  }

  onAutocompleteSelected(event) {
    const address = this.myOrganizationService.parseGoogleAddress(event);
    this.updateCompanyForm.get('city').setValue(address.city);
    this.updateCompanyForm.get('state').setValue(address.state);
    this.updateCompanyForm.get('pincode').setValue(address.postalCode);
  }
}
