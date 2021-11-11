import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { EmailValidateComponent } from './email-validate/email-validate.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TncComponent } from './tnc/tnc.component';
import { PressRoomComponent } from './press-room/press-room.component';
import { AboutComponent } from './about/about.component';
import { WhyUsComponent } from './why-us/why-us.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './main-layout/main-layout.module#MainLayoutModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'gigworker',
    loadChildren: './gigworker/individual.module#IndividualModule'
  },
  {
    path: 'hiring',
    loadChildren: './hiring/hiring.module#HiringModule'
  },
  {
    path: 'company',
    loadChildren: './company/company.module#CompanyModule'
  },
  {
    path: 'userprofile',
    loadChildren: './userprofile/userprofile.module#UserprofileModule'
  },
  {
    path: 'milestone',
    loadChildren: './milestone/milestone.module#MilestoneModule'
  },
  {
    path: 'wallet',
    loadChildren: './wallet/wallet.module#WalletModule'
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'validate/email/:id',
    component: EmailValidateComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TncComponent
  },
  {
    path: 'press-room',
    component: PressRoomComponent
  },
  {
    path: 'about-us',
    component: AboutComponent
  },
  {
    path: 'why-us',
    component: WhyUsComponent
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
