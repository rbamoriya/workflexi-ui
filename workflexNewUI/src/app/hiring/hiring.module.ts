import { MatToolbarModule } from '@angular/material/toolbar';
import { ShareModule } from './../share/share.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HiringRoutingModule } from './hiring-routing.module';

import { SkillslookingComponent } from './skillslooking/skillslooking.component';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, MatSelectModule, MatMenuModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatTabsModule, MatListModule, MatDivider, MatTooltipModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HiringProfileComponent } from './hiring-profile/hiring-profile.component';
import { EditSkillslookingComponent } from './edit-skillslooking/edit-skillslooking.component';
import { ModalDismissReasons, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { StandaloneRegistrationComponent } from './standalone-registration/standalone-registration.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [ SkillslookingComponent, DashboardComponent, CandidateProfileComponent, BasicinfoComponent, HiringProfileComponent, EditSkillslookingComponent, StandaloneRegistrationComponent, ThankYouComponent],
  imports: [
    CommonModule,
    HiringRoutingModule,
    ShareModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    InfiniteScrollModule,
    NgxPaginationModule,
    NgbModule,
    MatTooltipModule,
    MatGoogleMapsAutocompleteModule,
    CarouselModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HiringModule { }
