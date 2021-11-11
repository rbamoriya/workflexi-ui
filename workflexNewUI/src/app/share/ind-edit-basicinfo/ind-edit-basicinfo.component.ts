import { Component, OnInit } from '@angular/core';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-ind-edit-basicinfo',
  templateUrl: './ind-edit-basicinfo.component.html',
  styleUrls: ['./ind-edit-basicinfo.component.scss']
})
export class IndEditBasicinfoComponent implements OnInit {

  ROUTS:any =CONSTANTS_CLASS.ROUTS
  constructor() { }

  ngOnInit() {
  }

}
