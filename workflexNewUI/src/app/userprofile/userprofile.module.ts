import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { ShareModule } from './../share/share.module';
import { MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatCardModule, MatChipsModule, MatListModule, MatTabsModule } from '@angular/material';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserprofileRoutingModule } from './userprofile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserBasicInfoEditComponent } from './user-basic-info-edit/user-basic-info-edit.component';
import { UserPaymentEditComponent } from './user-payment-edit/user-payment-edit.component';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { StandaloneRegistrationComponent } from './standalone-registration/standalone-registration.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [BasicinfoComponent,PaymentComponent,ProfileComponent, UserBasicInfoEditComponent, UserPaymentEditComponent, StandaloneRegistrationComponent, ThankYouComponent],
  imports: [
    CommonModule,
    UserprofileRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    ShareModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatGoogleMapsAutocompleteModule,
    CarouselModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserprofileModule { }
