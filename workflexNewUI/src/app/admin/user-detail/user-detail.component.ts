import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId;
  userData: any;
  user_regstration_date: any;

  constructor( 
    private act_route: ActivatedRoute,
    private adminService: AdminService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    console.log('patam:', this.act_route.snapshot.queryParamMap.get('userId'));
    this.userId = this.act_route.snapshot.queryParamMap.get('userId');
    this.getUserDetail();
  }

  getUserDetail() {
    this.adminService.getUserDetail(this.userId).subscribe(response => {
      this.userData = response;
      this.user_regstration_date = this.userData.body.response.user_regstration_date;
      this.userData = this.userData.body.response.data;
    }, err => {
      console.log(err);
      this.toastr.errorToastr('Something went Wrong');
    })

  }

}
