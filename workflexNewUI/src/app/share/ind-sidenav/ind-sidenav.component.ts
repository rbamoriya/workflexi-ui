import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ind-sidenav',
  templateUrl: './ind-sidenav.component.html',
  styleUrls: ['./ind-sidenav.component.scss']
})
export class IndSidenavComponent implements OnInit {

  @Input() isEmailVarify: boolean; 
  @Input() nextTrue: boolean; 
  companySelect:boolean = false;
  constructor() {
    if(localStorage.getItem('subcategory') === "Company") {
      this.companySelect = true;
    } else {
      this.companySelect = false;
    }
  }

  ngOnInit() {
  }

}
