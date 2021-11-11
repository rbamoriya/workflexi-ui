import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showMenu = '';
  hide ='';
  status = true;
  isLoginDisable: boolean;
  constructor(private router: Router) {
    if(this.router.url.indexOf("userprofile/registration") > -1 || this.router.url.indexOf("hiring/registration") > -1 ){
      this.isLoginDisable = true;
    }
   }
  toggleDisplayDiv(){
    this.showMenu = 'menushow';
    this.hide = 'hide'
  };
  toggleHideDiv(){
    this.showMenu = '';
    this.hide = ''
  }


  ngOnInit() {
  }

}
