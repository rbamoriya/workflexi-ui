import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-approved',
  templateUrl: './company-approved.component.html',
  styleUrls: ['./company-approved.component.scss']
})
export class CompanyApprovedComponent implements OnInit {
  companyList: any;
  selectedValue = '';
  filteredCompanyList: any[];
  p: number = 1;

  constructor(
    private companyService : CompanyService,
    private router : Router,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.fetchAllCompaniesList();
  }

  fetchAllCompaniesList() {
    this.filteredCompanyList = [];
    this.companyService.getAllCompanies().subscribe(response => {
      this.companyList = response;
      this.companyList = this.companyList.body.response.data;
      this.filteredCompanyList = this.companyList;
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  navigateDetail(id) {
    this.router.navigate(['admin/company-detail'], { queryParams: {companyId: id} })
  }

  filter(key) {
    console.log('key:', key);
    this.filteredCompanyList = [];
    const filterCompanyList = JSON.parse(JSON.stringify(this.companyList));
    this.filteredCompanyList =  filterCompanyList.filter( company => {
      console.log('company.companyIsVerified:', company.companyIsVerified);
      if(key==="Verified" && company.companyIsVerified) {
        return company;
      }
      if(key==="Unverified" && !company.companyIsVerified) {
        return company;
      } else {
        return company;
      }
    });
    console.log('filterCompanyList:', filterCompanyList);
  }

  verifyCompany(id) {
    this.companyService.verifyCompany(id).subscribe(response => {
      console.log('resp:', response);
      this.fetchAllCompaniesList();
      this.toastr.successToastr('Updated');
    }, err => {
      this.toastr.errorToastr('Error Occure');
    })
  }

  unVerifyCompany(id) {
    console.log('unverified funct');
    this.companyService.unverifyCompany(id).subscribe(response => {
      this.fetchAllCompaniesList();
      this.toastr.successToastr('Updated');
    }, err => {
      this.toastr.errorToastr('Error Occure');
    })
  }

}
