import { ShareModule } from './../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyinfoComponent } from './companyinfo/companyinfo.component';
import { MatListModule, MatStepperModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatTabsModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatMenuModule, MatCheckboxModule } from '@angular/material';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyBankDetailsComponent } from './company-bank-details/company-bank-details.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';



@NgModule({
  declarations: [CompanyinfoComponent, 
    CompanySetupComponent, 
    CompanyProfileComponent, 
    CompanyBankDetailsComponent, 
    CompanyEditComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    ShareModule,
    MatListModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatChipsModule,
    MatListModule,
    MatCheckboxModule,
    MatGoogleMapsAutocompleteModule
  ]
})
export class CompanyModule { }
