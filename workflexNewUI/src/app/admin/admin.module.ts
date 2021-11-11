import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { UserListComponent } from './user-list/user-list.component';
import { AdminComponent } from './admin.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatMenuModule, MatInputModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GigWorkerComponent } from './gig-worker/gig-worker.component';
import { HirerComponent } from './hirer/hirer.component';
import { CompanyApprovedComponent } from './company-approved/company-approved.component';
import { TaskEndDateComponent } from './task-end-date/task-end-date.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { HirerDetailComponent } from './hirer-detail/hirer-detail.component';
import { GigWorkerDetailComponent } from './gig-worker-detail/gig-worker-detail.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';


@NgModule({
  declarations: [
    AdminComponent,
    UserListComponent,
    UserDetailComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    GigWorkerComponent,
    HirerComponent,
    CompanyApprovedComponent,
    TaskEndDateComponent,
    CompanyDetailComponent,
    HirerDetailComponent,
    GigWorkerDetailComponent,
    TaskDetailComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class AdminModule { }
