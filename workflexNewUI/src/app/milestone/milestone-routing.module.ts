import { AprrovedMilestonesComponent } from './aprroved-milestones/aprroved-milestones.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateMilestoneComponent } from './create-milestone/create-milestone.component';
import { MilestoneApprovalViewComponent } from './milestone-approval-view/milestone-approval-view.component';


const routes: Routes = [
  {
    path: 'create-milestone/:id',
    component: CreateMilestoneComponent
  },
  {
    path: 'approval-milestone/:id',
    component: MilestoneApprovalViewComponent
  },
  {
    path: 'approved-milestone/:id',
    component: AprrovedMilestonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MilestoneRoutingModule { }
