import { MatToolbarModule } from '@angular/material/toolbar';
import { ShareModule } from './../share/share.module';
import { MatFormFieldModule, MatListModule, MatStepperModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatTabsModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualRoutingModule } from './individual-routing.module';

import { SkillsComponent } from './skills/skills.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditSkillsComponent } from './edit-skills/edit-skills.component';
import { GigCandidateProfileComponent } from './gig-candidate-profile/gig-candidate-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SkillsComponent,DashboardComponent, EditSkillsComponent, GigCandidateProfileComponent,],
  imports: [
    CommonModule,
    IndividualRoutingModule,
    MatListModule,
    MatStepperModule,
    ShareModule,
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
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndividualModule { }
