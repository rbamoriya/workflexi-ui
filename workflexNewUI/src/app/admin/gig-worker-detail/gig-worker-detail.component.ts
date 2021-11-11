import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GigWorkerService } from '../services/gig-worker.service';

@Component({
  selector: 'app-gig-worker-detail',
  templateUrl: './gig-worker-detail.component.html',
  styleUrls: ['./gig-worker-detail.component.scss']
})
export class GigWorkerDetailComponent implements OnInit {
  gigId: string;
  gigData: any;
  videoLink: SafeResourceUrl;
  isVideoApproved: boolean;

  constructor(
    private act_route: ActivatedRoute,
    private gigService: GigWorkerService,
    private toastr: ToastrManager,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.gigId = this.act_route.snapshot.queryParamMap.get('gigId');
    this.fetchGigDetails();
  }

  fetchGigDetails() {
    this.gigService.getGigsDetails(this.gigId).subscribe(response => {
      this.gigData = response;
      
      if(this.gigData.body.response.document) {
        this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.gigData.body.response.document);
      }
      this.gigData = this.gigData.body.response.data[0];
      this.isVideoApproved = this.gigData.isApproved
    }, 
    err => {
      this.toastr.errorToastr('Something went wrong');
    })
  }

  approveVideo() {
    console.log('id:', this.gigId);
    this.gigService.approveGigVideo(this.gigId).subscribe(response => {
      this.toastr.successToastr('Video Approved');
      this.fetchGigDetails();
    }, err => {
      this.toastr.errorToastr('Something went wrong');
    })
  }

  unapproveVideo() {
    console.log('id:', this.gigId);
    this.gigService.unapproveGigVideo(this.gigId).subscribe(response => {
      this.toastr.successToastr('Video Unapproved');
      this.fetchGigDetails();
    }, err => {
      this.toastr.errorToastr('Something went wrong');
    })
  }

}
