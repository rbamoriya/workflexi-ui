import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  taskId;
  taskData: any;

  constructor( 
    private act_route: ActivatedRoute,
    private taskService: TaskService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    console.log('Id:', this.act_route.snapshot.queryParamMap.get('taskId'));
    this.taskId = this.act_route.snapshot.queryParamMap.get('taskId');
    this.getTaskDetail();
  }

  getTaskDetail() {
    this.taskService.getTaskDetails(this.taskId).subscribe(response => {
      console.log(response);
      this.taskData = response;
      this.taskData = this.taskData.body.response.data;
    }, err => {
      console.log(err);
      this.toastr.errorToastr('Something went Wrong');
    })
  }
}
