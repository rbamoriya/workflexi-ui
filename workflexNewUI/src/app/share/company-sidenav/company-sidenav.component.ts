import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-company-sidenav',
  templateUrl: './company-sidenav.component.html',
  styleUrls: ['./company-sidenav.component.scss']
})
export class CompanySidenavComponent implements OnInit {

  @Input() edit: boolean;
  constructor() { }

  ngOnInit() {
  }
}
