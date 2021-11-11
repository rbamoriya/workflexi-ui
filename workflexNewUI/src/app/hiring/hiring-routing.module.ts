import { DashboardComponent } from './dashboard/dashboard.component';
import { SkillslookingComponent } from './skillslooking/skillslooking.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { HiringProfileComponent } from './hiring-profile/hiring-profile.component';
import { EditSkillslookingComponent } from './edit-skillslooking/edit-skillslooking.component';
import { StandaloneRegistrationComponent } from './standalone-registration/standalone-registration.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  {
    path: 'registration',
    component: StandaloneRegistrationComponent
  },
  {
    path: 'thankyou',
    component: ThankYouComponent
  },
  {
    path: 'basicinfo',
    component: BasicinfoComponent
  },
  {
    path: 'skillslooking',
    component: SkillslookingComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'candidate/:id',
    component: CandidateProfileComponent
  },
  {
    path: 'profile',
    component: HiringProfileComponent
  },
  {
    path: 'edit/skillslooking/:id',
    component: EditSkillslookingComponent
  },
  {
    path: 'add/skillslooking/:id',
    component: EditSkillslookingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HiringRoutingModule { }
