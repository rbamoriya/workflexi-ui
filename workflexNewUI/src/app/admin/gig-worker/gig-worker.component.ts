import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GigWorkerService } from '../services/gig-worker.service';

@Component({
  selector: 'app-gig-worker',
  templateUrl: './gig-worker.component.html',
  styleUrls: ['./gig-worker.component.scss']
})
export class GigWorkerComponent implements OnInit {
  gigsList: any;
  selectedValue: String = '';
  tableColumns  :  string[] = ['name', 'mobile', 'title', 'skill', 'descriptions', 'totalExperience', 'location', 'action'];
  pageList: any[] = [5, 10];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  p: number = 1;
  
  constructor(
    private router : Router,
    private gigService: GigWorkerService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.fetchAllGigList();
  }

  applyFilter(filterValue: string) {
    console.log('filterValue:', filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  fetchAllGigList() {
    this.gigService.getAllGigs().subscribe(response => {
      console.log('response:', response);
      this.gigsList = response;
      this.gigsList = this.gigsList.body.response.data;

      this.dataSource = new MatTableDataSource<any>(this.gigsList);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('this.dataSource:', this.dataSource);
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  filter(selectedValue) {
    console.log('selectedValue:', selectedValue);
  }

  navigateDetail(id) {
    this.router.navigate(['admin/gig-worker-detail'], { queryParams: {gigId: id} })
  }

  deleteGig(id) {
    console.log('delete id:', id);
    this.gigService.deleteGigDetails(id).subscribe(response => {
      console.log(response);
      this.toastr.successToastr('Deleted Successfully');
      this.fetchAllGigList();
    }, err => {
      this.toastr.errorToastr('Something went wrong')
    })
  }

}

// export interface GigData {
//   name: any;
//   mobile: any;
//   title: any;
//   skill: any;
//   descriptions: any;
  
//   location: any;
// }