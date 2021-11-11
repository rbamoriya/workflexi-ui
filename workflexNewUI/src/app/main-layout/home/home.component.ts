import { VideoDailogComponent } from './../video-dailog/video-dailog.component';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';
import { ProviderService } from 'src/app/services/provider.service';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showpage: boolean = false;
  customOptions1: OwlOptions = {
    loop: true,
    dots: true,
    items: 6,
    dotsData: false,
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
    responsive:{
      0: {
        items: 2
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    
  }
  customOptions: OwlOptions = {
    loop: true,
    dots: true,
    items: 1,
    dotsData: true,
    // autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
    responsive:{
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    
  }
    
  constructor(public dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private providerService : ProviderService,
    private userService:UserService,
    public toastr: ToastrManager) { }

  ngOnInit() {
    this.showpage = false;
    // let redirect: string = this.sharedService.checkUserCredential('home');

    // if(redirect)
    //   return this.router.navigate([redirect]);
    if(!localStorage.getItem('_token') || !localStorage.getItem('userId') || !localStorage.getItem('userRoles')) {
      
    } else {
      if(localStorage.getItem('category') && localStorage.getItem('subcategory') && localStorage.getItem('subcategory') !== "Company") {
        if(localStorage.getItem('category') === 'Gig Worker'){
          return this.router.navigate(['/userprofile/basicinfo']);
        } else if(localStorage.getItem('category') === 'Hirer'){
          return this.router.navigate(['/hiring/basicinfo']);
        }
      }
      if(localStorage.getItem('category') === 'Gig Worker'){
          
        if(localStorage.getItem('newUser') === null || localStorage.getItem('newUser') === 'false' || localStorage.getItem('isEmailVerified') === 'false'){
          return this.router.navigate(['/userprofile/basicinfo']);
        } else {
          this.getUserDetailsForCheckPayment();
        }
      }else{
        if(localStorage.getItem('newUser') === null || localStorage.getItem('newUser') === 'false' || localStorage.getItem('isEmailVerified') === 'false'){
          return this.router.navigate(['/hiring/basicinfo']);
        } else {
          this.getSeekersProfilesList();
        }
      }

    }
    
    this.showpage = true;
  }

  openDialog() {
    const dialogRef = this.dialog.open(VideoDailogComponent, {
      panelClass: ['video-modal']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  tytPreGetBool(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
  }

  getSeekersProfilesList(){
    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true)
      companyId = localStorage.getItem('companyId');
    this.providerService.listSeekerProfiles(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        // this.seekerProfiles = resJSON.body.response.data;
        let searchArray: any[] = [];
        resJSON.body.response.data.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              
              searchArray.push(element);
            });
          }
        });
        if(searchArray.length>0) {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.COMPANY_PROFILE]);
        } else {
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_NEW_SKILLOOKIG]);
        }
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  getUserDetailsForCheckPayment() {

    let isCompanySelected = this.tytPreGetBool(localStorage.getItem('isCompanySelected'));
    let companyId = "";
    if(isCompanySelected == true){
      if(localStorage.getItem('companyId') != null && localStorage.getItem('companyId') != undefined)
      companyId = localStorage.getItem('companyId');
    }

    this.providerService.listProvider(companyId, "").subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if(!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        let gigsList = resJSON.body.response.data;
        let searchArray: any[] = [];
        gigsList.forEach(element => {
          if(element.data && element.data.skill && element.data.skill.length>0) {
            element.data.skill.forEach(element => {
              searchArray.push(element);
            });
          }
        });
        if(searchArray.length>0) {
          
          if(localStorage.getItem('subcategory') === "Company") {
          
            this.userService.getUserDetails().subscribe((res) => {
              let resSTR = JSON.stringify(res);
              let resJSON = JSON.parse(resSTR);
              if(!resJSON.body.response.status) {
                this.toastr.errorToastr(resJSON.body.response.message);
              } else {
                if(resJSON.body.response.data.company != null){
                  localStorage.setItem("isCompanySelected", "true");
                  return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
                } else {
                  return this.router.navigate([CONSTANTS_CLASS.ROUTS.SET_COMPANY_BASICINFO]);
                }
              }
            }, (err) => {
              this.toastr.errorToastr(err.errors);
            });

          } else {
            return this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD]);
          }
            
        }else{
          return this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_SKILL]);
        }
       
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
}

}
