import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from '../auth-guard.guard';
import { AdminComponent } from './admin.component';
import { CompanyApprovedComponent } from './company-approved/company-approved.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { GigWorkerDetailComponent } from './gig-worker-detail/gig-worker-detail.component';
import { GigWorkerComponent } from './gig-worker/gig-worker.component';
import { HirerDetailComponent } from './hirer-detail/hirer-detail.component';
import { HirerComponent } from './hirer/hirer.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEndDateComponent } from './task-end-date/task-end-date.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    {
      path: '',
      redirectTo: 'user-list',
      // data:['ROLE_ADMIN'],
      // canActivate: [AuthGuardGuard]
      
    },
    {
      path: 'user-list',
      component: UserListComponent
    },
    {
      path: 'user-detail',
      component: UserDetailComponent
    },
    {
      path: 'gig-worker',
      component: GigWorkerComponent
    },
    {
      path: 'gig-worker-detail',
      component: GigWorkerDetailComponent
    },
    {
      path: 'hirer',
      component: HirerComponent
    },
    {
      path: 'hirer-detail',
      component: HirerDetailComponent
    },
    {
      path: 'company',
      component: CompanyApprovedComponent
    },
    {
      path: 'company-detail',
      component: CompanyDetailComponent
    },
    {
      path: 'task-end-date',
      component: TaskEndDateComponent
    },
    {
      path: 'task-detail',
      component: TaskDetailComponent
    }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
