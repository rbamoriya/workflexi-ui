import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HirerService } from '../services/hirer.service';

@Component({
  selector: 'app-hirer',
  templateUrl: './hirer.component.html',
  styleUrls: ['./hirer.component.scss']
})
export class HirerComponent implements OnInit {
  hirerList: any;
  selectedValue = '';
  p: number = 1;

  constructor(
    private router : Router,
    private hirerService: HirerService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.fetchAllHirerList();
  }

  fetchAllHirerList() {
    this.hirerService.getAllHirer().subscribe(response => {
      console.log('response:', response);
      this.hirerList = response;
      this.hirerList = this.hirerList.body.response.data;
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  filter(selectedValue) {
    console.log('selectedValue:', selectedValue);
  }

  navigateDetail(id) {
    this.router.navigate(['admin/hirer-detail'], { queryParams: {hirerId: id} })
  }

  deleteHirer(id) {
    console.log('delete id:', id);
    this.hirerService.deleteHirerDetails(id).subscribe(response => {
      this.toastr.successToastr('Deleted Successfully');
      this.fetchAllHirerList();
    }, err => {
      this.toastr.errorToastr('Something went wrong');
    })
  }
}
