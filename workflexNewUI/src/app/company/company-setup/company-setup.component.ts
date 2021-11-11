import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MyOrganizationService } from '../../services/my-organization-service';
import { Router, NavigationExtras } from '@angular/router';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.scss']
})
export class CompanySetupComponent implements OnInit {

  
  constructor(private fb: FormBuilder,public toastr: ToastrManager, 
    private userService:UserService,public router:Router,
    private myOrganizationService:MyOrganizationService) {

      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {serializedForm: any};
      if(state) {
        let resSTR = state.serializedForm;
        this.goPriviousForm = resSTR; 
        this.serializedForm = JSON.parse(resSTR);
        console.log(this.serializedForm);
        this.createForm();
      } 
      else {
        this.router.navigateByUrl(CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO);
      }
      
   }

  ngOnInit() {
  }

  goPriviousFormRout(){
    const navigationExtras: NavigationExtras = {state: {serializedForm: this.goPriviousForm}};
     return  this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO], navigationExtras);
  }

  createCompanyForm: FormGroup;
  isCompanyExist = false;
  companyDetails = [];
  companyId
  isPrimaryRoleExist = false;
  approvalRequests = null;
  assignedUsers = null;
  base64Image;
  base64textString = [];
  serializedForm
  goPriviousForm

  createForm() {
    this.createCompanyForm = this.fb.group({
      name: [this.serializedForm.name, Validators.required ],
      address: [this.serializedForm.address, Validators.required ],
      city: [this.serializedForm.city, Validators.required ],
      state: [this.serializedForm.state, Validators.required ],
      pincode: [this.serializedForm.pincode, Validators.required ],
      website: [this.serializedForm.website],
      gstNumber: [this.serializedForm.gstNumber, Validators.pattern(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/) ],
      panNumber: [this.serializedForm.panNumber, [Validators.required, Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)] ],
      description: [this.serializedForm.description],
      logo: [this.serializedForm.logo],
      bankName: '',
      nameInBank: '',
      accountNumber: '',
      ifsc: ''
    });
    this.base64Image = this.serializedForm.logo;
    this.base64textString.push(this.base64Image);
  }

  createCompany() {
    if(this.createCompanyForm.valid){
      let formObj = this.createCompanyForm.getRawValue();
      formObj.logo = this.base64Image;
      let serializedForm = JSON.stringify(formObj);
      const navigationExtras: NavigationExtras = {state: {serializedForm: serializedForm}};
      this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BANK_DETAILS], navigationExtras);

    }
  }
}
