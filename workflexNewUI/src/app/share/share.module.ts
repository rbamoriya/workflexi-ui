import { RouterModule } from '@angular/router';

import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';

import { MatButtonModule, MatFormFieldModule, MatIconModule, MatListModule, MatInputModule, MatMenuModule, MatExpansionModule, MatDatepickerModule, MatCheckboxModule } from '@angular/material';
import { IndSidenavComponent } from './ind-sidenav/ind-sidenav.component';

import { IndividualheaderComponent } from './individualheader/individualheader.component';
import { FilterComponent } from './filter/filter.component';
import { HiringIndComponent } from './hiring-ind/hiring-ind.component';
import { FooterComponent } from './footer/footer.component';
import { CompanySidenavComponent } from './company-sidenav/company-sidenav.component';
import { IndEditSkillSidenavComponent } from './ind-edit-skill-sidenav/ind-edit-skill-sidenav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndEditSkillookingComponent } from './ind-edit-skillooking/ind-edit-skillooking.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { IndEditBasicinfoComponent } from './ind-edit-basicinfo/ind-edit-basicinfo.component';
import { IndEditPaymentComponent } from './ind-edit-payment/ind-edit-payment.component';
import { MilestoneRejectReasonComponent } from '../popup/milestone-reject-reason/milestone-reject-reason.component';
import { MilestoneEditComponent } from '../popup/milestone-edit/milestone-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EndDateChangeComponent } from '../popup/end-date-change/end-date-change.component';
import { AgmCoreModule } from '@agm/core';







@NgModule({
  declarations: [HeaderComponent, 
    IndSidenavComponent, 
    IndividualheaderComponent, 
    FilterComponent, 
    HiringIndComponent, 
    FooterComponent, 
    CompanySidenavComponent, 
    IndEditSkillSidenavComponent, 
    IndEditSkillookingComponent,
    IndEditSkillookingComponent, 
    IndEditBasicinfoComponent, 
    IndEditBasicinfoComponent, 
    IndEditPaymentComponent,
    IndEditPaymentComponent,
    MilestoneRejectReasonComponent,
    EndDateChangeComponent,
    MilestoneEditComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    UiSwitchModule,
    EditorModule
  ],
  exports: [
    HeaderComponent,
    IndSidenavComponent,
    IndividualheaderComponent,
    FilterComponent,
    HiringIndComponent,
    FooterComponent,
    CompanySidenavComponent,
    IndEditSkillSidenavComponent,
    IndEditSkillookingComponent,
    IndEditBasicinfoComponent,
    IndEditPaymentComponent,
    MilestoneRejectReasonComponent,
    MilestoneEditComponent,
    EndDateChangeComponent
  ]
})
export class ShareModule { }
