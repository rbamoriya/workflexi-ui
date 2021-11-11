
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { CompanyinfoComponent } from './companyinfo/companyinfo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyBankDetailsComponent } from './company-bank-details/company-bank-details.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';


const routes: Routes = [
  {
    path: 'basicinfo',
    component: CompanyinfoComponent
  },
  {
    path: 'setup',
    component: CompanySetupComponent
  },
  {
    path: 'profile',
    component: CompanyProfileComponent
  },
  {
    path: 'bank-details',
    component: CompanyBankDetailsComponent
  },
  {
    path: 'edit',
    component: CompanyEditComponent
  },
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
