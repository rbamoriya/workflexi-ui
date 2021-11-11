import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTS } from 'src/app/constants/constants';
import { GigworkerDashboardService } from 'src/app/services/gigworker-dashboard.service';
import { HiringDashboardService } from 'src/app/services/hiring-dashboard.service';
import { ProviderService } from 'src/app/services/provider.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import * as CONSTANTS_CLASS from '../../constants/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() hirerFilter = new EventEmitter<any>();
  @Output() gigWorkerFilter = new EventEmitter<any>();

  constructor(private router: Router,
    public toastr: ToastrManager,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private userService: UserService,
    private providerService: ProviderService,
    private spinner: NgxSpinnerService,
    private gigworkerDashboardService: GigworkerDashboardService,
    private hiringDashboardService: HiringDashboardService,
    public activatedRoute: ActivatedRoute) { }

  skillList: any[] = [];
  skills: any[] = [];
  basicInfoForm: FormGroup;
  searchByName: string;
  searchByLocation: string;
  searchByMinExp: string;
  searchByMaxExp: string;

  postgigORskill: string;
  filterExpFlag:boolean;


  ngOnInit() {
    this.getSkillList();

    if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if (localStorage.getItem('category') === 'Gig Worker') {
        this.postgigORskill = "Post your skill";
        this.filterExpFlag=false;
      } else {
        this.postgigORskill = "Post a gig";
        this.filterExpFlag=true;
      }
    }
  }

  getSkillList() {
    this.providerService.skillList().subscribe((res) => {
      let resSTR = JSON.stringify(res);
      let resJSON = JSON.parse(resSTR);
      if (!resJSON.body.response.status) {
        this.toastr.errorToastr(resJSON.body.response.message);
      } else {
        this.skillList = resJSON.body.response.data;
      }
    }, (err) => {
      this.toastr.errorToastr(err.errors);
    });
  }

  somethingClick(checkbox: MatCheckbox, item: string) {
    if (!checkbox.checked) {
      this.skills.push(item);
    } else {
      const index: number = this.skills.indexOf(item);
      if (index !== -1)
        this.skills.splice(index, 1);
    }
  }

  applyFilter() {
    if (this.skills && this.skills.length > 0) {
      let searchText: string = this.skills.join();
      if (this.router.url.indexOf("/gigworker/dashboard") !== -1) {
        this.gigworkerDashboardService.getSeekersList(searchText);
      } else {
        this.hiringDashboardService.searchText = searchText;
        this.hiringDashboardService.currentPage = 1;
        this.hiringDashboardService.searchForGigs(false, this.hiringDashboardService.currentPage);
      }
      this.hirerFilter.emit(1);
    }
  }

  goToLookingForSkill() {
    if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {
      if (localStorage.getItem('category') === 'Gig Worker') {
         this.router.navigate([CONSTANTS_CLASS.ROUTS.ADD_NEW_SKILL]);
      } else {
        this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_NEW_SKILLOOKIG]);
      }
    }
  }


  searchbyAdditionalFilter(fieldName: String) {

    var searchbyField: any;
    if (fieldName == 'name') {
      if(this.searchByName)
      searchbyField = { name: this.searchByName };
    } else if (fieldName == 'location') {
      if(this.searchByLocation)
      searchbyField = { location: this.searchByLocation };
    } else if (fieldName == 'experience') {
      if(this.searchByMinExp && this.searchByMaxExp)
      searchbyField = { minExp: this.searchByMinExp, maxExp: this.searchByMaxExp };
      else if(this.searchByMinExp)
      searchbyField = { minExp: this.searchByMinExp}
      else if(this.searchByMaxExp)
      searchbyField = { maxExp: this.searchByMaxExp}
    }

    if (searchbyField) {
      this.router.navigate([], {
        queryParams: searchbyField,
        queryParamsHandling: 'merge',
      });

      

      if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {
        if (localStorage.getItem('category') === 'Gig Worker') {
          this.gigWorkerFilter.emit('apply');
        } else {
          this.hirerFilter.emit('apply');
        }
      }


    }
  }


  clearFilter() {
    this.searchByName = "";
    this.searchByLocation = "";
    this.searchByMinExp = "";
    this.searchByMaxExp = "";
    if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {


      if (localStorage.getItem('category') === 'Gig Worker') {
        if (this.activatedRoute.snapshot.queryParams['view'] == 'shortlisted_me') {
          this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD], { queryParams: { view: 'shortlisted_me' } });

        } else if (this.activatedRoute.snapshot.queryParams['view'] == 'hired') {
          this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD], { queryParams: { view: 'hired' } });
        } else {
          this.router.navigate([CONSTANTS_CLASS.ROUTS.GIG_WORKER_DASHBOARD], { queryParams: { search: 'gig' } });
        }
      } else {

        if (this.activatedRoute.snapshot.queryParams['view'] == 'shortlisted') {

          this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD], { queryParams: { view: 'shortlisted' } });
        } else {
          this.router.navigate([CONSTANTS_CLASS.ROUTS.HIRER_DASHBOARD], { queryParams: { search: 'gig' } });
        }
      }

      if (localStorage.getItem('category') && localStorage.getItem('subcategory')) {
        if (localStorage.getItem('category') === 'Gig Worker') {
          this.gigWorkerFilter.emit('clear');
        } else {
          this.hirerFilter.emit('clear');
        }
      }
    }
  }
}
