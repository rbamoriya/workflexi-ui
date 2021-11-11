import { Component, OnInit, Input } from '@angular/core';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-ind-edit-skill-sidenav',
  templateUrl: './ind-edit-skill-sidenav.component.html',
  styleUrls: ['./ind-edit-skill-sidenav.component.scss']
})
export class IndEditSkillSidenavComponent implements OnInit {

  @Input() id: string;

  ROUTS:any =CONSTANTS_CLASS.ROUTS
  constructor() { }

  ngOnInit() {
  }

}
