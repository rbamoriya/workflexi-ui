import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SkillslookingComponent } from 'src/app/hiring/skillslooking/skillslooking.component';
import { SkillService } from '../services/skill.service';

@Component({
  selector: 'app-skill-looking-for',
  templateUrl: './skill-looking-for.component.html',
  styleUrls: ['./skill-looking-for.component.scss']
})
export class SkillLookingForComponent implements OnInit {
  skillList: any;
  selectedValue = '';
  p: number = 1;

  constructor(
    private router : Router,
    private skillService: SkillService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.fetchAllSkillList();
  }

  fetchAllSkillList() {
    this.skillService.getAllSkills().subscribe(response => {
      console.log('response:', response);
      this.skillList = response;
      this.skillList = this.skillList.body.response.data;
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  deleteSkill(id) {
    console.log('delete id:', id);
    this.skillService.deleteSkillDetails(id).subscribe(response => {
      console.log(response);
      this.toastr.successToastr('Deleted Successfully');
      this.fetchAllSkillList();
    }, err => {
      this.toastr.errorToastr('Something went wrong')
    })
  }
}
