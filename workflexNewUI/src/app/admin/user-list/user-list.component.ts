import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userList: any;
  tableColumns  :  string[] = ['name', 'gender', 'mobile', 'email', 'isEmailVerified', 'location', 'action'];
  pageList: any[] = [5, 10];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.getAllUserData();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllUserData() {
    this.adminService.getAllUser().subscribe(response => {
      this.userList = response;
      this.userList = this.userList.body.response.data;

      this.dataSource = new MatTableDataSource<UserData>(this.userList);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.errorToastr('Something went Wrong');
    })
  }

  navigateDetail(id) {
    this.router.navigate(['admin/user-detail'], { queryParams: {userId: id} })
  }
}

export interface UserData {
  name: string;
  gender: string;
  mobile: string;
  email: string;
  isEmailVerified: any;
  location: string;
}