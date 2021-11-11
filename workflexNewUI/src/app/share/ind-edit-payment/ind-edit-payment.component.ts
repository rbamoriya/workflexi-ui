import { Component, OnInit } from '@angular/core';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-ind-edit-payment',
  templateUrl: './ind-edit-payment.component.html',
  styleUrls: ['./ind-edit-payment.component.scss']
})
export class IndEditPaymentComponent implements OnInit {

  ROUTS:any =CONSTANTS_CLASS.ROUTS

  constructor() { }

  ngOnInit() {
  }

}
