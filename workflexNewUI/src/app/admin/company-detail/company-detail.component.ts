import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  companyId: string;
  companyData: any;

  constructor(
    private act_route: ActivatedRoute,
    private companyService: CompanyService,
    private toastr: ToastrManager
  ) { }

  ngOnInit() {
    this.companyId = this.act_route.snapshot.queryParamMap.get('companyId');
    this.fetchCompanyDetails();
  }

  fetchCompanyDetails() {
    this.companyService.getCompanyData(this.companyId).subscribe(response => {
      this.companyData = response;
      this.companyData = this.companyData.body.response.data;
    }, err => {
      this.toastr.errorToastr('Something went wrong');
    });
  }

  verifyCompany(id) {
    this.companyService.verifyCompany(id).subscribe(response => {
      this.toastr.successToastr('Updated');
      this.fetchCompanyDetails();
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  unVerifyCompany(id) {
    console.log('unverified funct');
    this.companyService.unverifyCompany(id).subscribe(response => {
      console.log('resp:', response);
      this.fetchCompanyDetails();
    }, err => {
      console.log('err:', err);
    })
  }

}
