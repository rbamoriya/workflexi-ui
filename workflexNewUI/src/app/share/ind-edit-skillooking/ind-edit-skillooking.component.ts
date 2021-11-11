import { Component, OnInit, Input } from '@angular/core';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-ind-edit-skillooking',
  templateUrl: './ind-edit-skillooking.component.html',
  styleUrls: ['./ind-edit-skillooking.component.scss']
})
export class IndEditSkillookingComponent implements OnInit {

  @Input() id: string;
  ROUTS:any =CONSTANTS_CLASS.ROUTS

  constructor() { }

  ngOnInit() {
  }

}
