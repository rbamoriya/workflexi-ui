
import { DashboardComponent } from './dashboard/dashboard.component';
import { SkillsComponent } from './skills/skills.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditSkillsComponent } from './edit-skills/edit-skills.component';
import { GigCandidateProfileComponent } from './gig-candidate-profile/gig-candidate-profile.component';


const routes: Routes = [

  {
    path: 'skills',
    component: SkillsComponent
  },
  {
    path: 'edit/skills/:id',
    component: EditSkillsComponent
  },
  {
    path: 'add/skills/:id',
    component: EditSkillsComponent
  },
  {
    path: 'candidate/:id',
    component: GigCandidateProfileComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualRoutingModule { }
