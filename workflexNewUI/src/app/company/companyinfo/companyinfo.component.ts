import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyOrganizationService } from '../../services/my-organization-service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, NavigationExtras } from '@angular/router';
import * as CONSTANTS_CLASS from '../../constants/constants';

export interface company {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-companyinfo',
  templateUrl: './companyinfo.component.html',
  styleUrls: ['./companyinfo.component.scss']
})
export class CompanyinfoComponent implements OnInit {
  showMenu = '';
  hide ='';
  assignRoleForm: FormGroup;
  companyList = [];
  createCompanyForm: FormGroup;
  base64textString = [];
  base64Image;
  flag = true;
  serializedOldForm

  constructor(private fb: FormBuilder,
    public router:Router,
    private myOrganizationService : MyOrganizationService,
    public toastr: ToastrManager) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {serializedForm: any};
      if(state) {
        let resSTR = state.serializedForm;
        this.serializedOldForm = JSON.parse(resSTR);
        console.log(this.serializedOldForm);
      }

  }

  toggleDisplayDiv(){
    this.showMenu = 'show';
    this.hide ='hide'
  };

  ngOnInit() {
    this.createRoleAssignForm();
    this.createCompanyFormValidate();
    this.getCompanyList();
    if(this.serializedOldForm != undefined){
      this.toggleDisplayDiv();
    }
  }

  getCompanyList() {
    this.myOrganizationService.companyList().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.warningToastr(resJSON.body.response.message);
      } else {
          this.companyList = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  createRoleAssignForm() {
    this.assignRoleForm = this.fb.group({
      companyId: ['Select Company'],
      companyName: '',
      address: '',
      isPrimaryOwner: ''
    });
  }

  assignRoleForCompany() {
    let formObj = this.assignRoleForm.getRawValue();
    if(formObj.companyId == null || formObj.companyId == "" || formObj.companyId == "Select Company"){
      return false;
    }
    let serializedForm = JSON.stringify(formObj);

    this.myOrganizationService.assignRoleRequest(serializedForm).subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      //console.log(resJSON);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.toastr.successToastr(resJSON.body.response.message);
        this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
      }
      this.ngOnInit();
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  createCompanyFormValidate() {
    if(this.serializedOldForm != undefined){
      this.createCompanyForm = this.fb.group({
        name: [this.serializedOldForm.name, Validators.required ],
        address: [this.serializedOldForm.address, Validators.required ],
        city: [this.serializedOldForm.city, Validators.required ],
        state: [this.serializedOldForm.state, Validators.required ],
        pincode: [this.serializedOldForm.pincode, Validators.required ],
        website: [this.serializedOldForm.website],
        gstNumber: [''],
        panNumber: '',
        description: '',
        logo: '',
        bankName: '',
        nameInBank: '',
        accountNumber: '',
        ifsc: ''
      });
      this.base64Image = this.serializedOldForm.logo;
      this.base64textString.push(this.base64Image);
    } else {
      this.createCompanyForm = this.fb.group({
        name: ['', Validators.required ],
        address: ['', Validators.required ],
        city: ['', Validators.required ],
        state: ['', Validators.required ],
        pincode: ['', Validators.required ],
        website: '',
        gstNumber: [''],
        panNumber: '',
        description: '',
        logo: '',
        bankName: '',
        nameInBank: '',
        accountNumber: '',
        ifsc: ''
      });
    }
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

  createCompany() {
    if(this.createCompanyForm.valid){
      let formObj = this.createCompanyForm.getRawValue();
      formObj.logo = this.base64Image;
      let serializedForm = JSON.stringify(formObj);
      const navigationExtras: NavigationExtras = {state: {serializedForm: serializedForm}};
      this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_UP_COMPANY], navigationExtras);

    }
  }

  onAutocompleteSelected(event) {
    const address = this.myOrganizationService.parseGoogleAddress(event);
    this.createCompanyForm.get('city').setValue(address.city);
    this.createCompanyForm.get('state').setValue(address.state);
    this.createCompanyForm.get('pincode').setValue(address.postalCode);
  }

  redirectInboarding() {
    localStorage.removeItem("subcategory");
    return this.router.navigate([CONSTANTS_CLASS.ROUTS.AUTH_INBOARDING]);
  }

}
