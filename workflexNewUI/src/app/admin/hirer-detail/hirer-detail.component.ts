import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HirerService } from '../services/hirer.service';

@Component({
  selector: 'app-hirer-detail',
  templateUrl: './hirer-detail.component.html',
  styleUrls: ['./hirer-detail.component.scss']
})
export class HirerDetailComponent implements OnInit {
  hirerId: string;
  hirerData: any;
  walletBal: any;

  constructor(
    private act_route: ActivatedRoute,
    private hirerService: HirerService,
    private toastr: ToastrManager
  ) { }

  ngOnInit() {
    this.hirerId = this.act_route.snapshot.queryParamMap.get('hirerId');
    this.fetchGigDetails();
  }

  fetchGigDetails() {
    console.log('hirerId:', this.hirerId);
    this.hirerService.getHirerDetails(this.hirerId).subscribe(response => {
      console.log('response: ', response);
      this.hirerData = response;
      this.walletBal = this.hirerData.body.response.walletBal;
      this.hirerData = this.hirerData.body.response.data[0];
      console.log('this.hirerData:',this.hirerData);
    }, 
    err => {
      console.error('error:', err);
    })
  }

}
