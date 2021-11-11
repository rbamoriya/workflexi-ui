import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProviderService } from 'src/app/services/provider.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import * as jQuery from 'jquery'

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  userDetails;
  headerSrcData: any;
  balance;

  constructor(
    private userService : UserService,
    public toastr: ToastrManager,
    private providerService : ProviderService,
    public sharedService : SharedService,
    private sanitizer : DomSanitizer
    ) { }

  ngOnInit() {
    this.getUserDetails();
    jQuery(document).ready(function() {
      jQuery("#nav-icon").click(function() {
          jQuery(this).toggleClass("open");
          jQuery(".main-wrapper").toggleClass("menu-open");
      });
  });
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.userDetails = resJSON.body.response.data;
        if(resJSON.body.response.data.photo != undefined && resJSON.body.response.data.photo != null && resJSON.body.response.data.photo != ''){
          this.getUserImage(resJSON.body.response.data.photo);
          
        } else {
          if(this.userDetails.gender == 'FeMale'){
            this.headerSrcData = '../assets/images/defaultWomanImg.png';
          } else {
            this.headerSrcData = '../assets/images/defaultManImg.png';
          }
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getUserImage(name: string) {
    this.userService.getUserImage(name).subscribe(data => {
      var dd = URL.createObjectURL(data);
      this.headerSrcData = this.sanitizer.bypassSecurityTrustUrl(dd);
    });
  }
}
