import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hiring-ind',
  templateUrl: './hiring-ind.component.html',
  styleUrls: ['./hiring-ind.component.scss']
})
export class HiringIndComponent implements OnInit {

  @Input() isEmailVarify:boolean;
  constructor() { }

  ngOnInit() {
  }

}
