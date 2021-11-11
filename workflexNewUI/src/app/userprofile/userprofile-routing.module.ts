import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserBasicInfoEditComponent } from './user-basic-info-edit/user-basic-info-edit.component';
import { UserPaymentEditComponent } from './user-payment-edit/user-payment-edit.component';
import { StandaloneRegistrationComponent } from './standalone-registration/standalone-registration.component';
import { ThankYouComponent } from './thank-you/thank-you.component';


const routes: Routes = [
  {
    path: 'basicinfo',
    component: BasicinfoComponent
  },
  {
    path: 'payments',
    component: PaymentComponent
  },
  {
    path: 'payments/edit',
    component: UserPaymentEditComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'basicinfo/edit',
    component: UserBasicInfoEditComponent
  },
  {
    path: 'registration',
    component: StandaloneRegistrationComponent
  },
  {
    path: 'thankyou',
    component: ThankYouComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserprofileRoutingModule { }
