import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-end-date',
  templateUrl: './task-end-date.component.html',
  styleUrls: ['./task-end-date.component.scss']
})
export class TaskEndDateComponent implements OnInit {
  taskList: any;
  selectedValue = '';
  p: number = 1;

  constructor(
    private router : Router,
    private taskService: TaskService,
    private toastr: ToastrManager
    ) { }

  ngOnInit() {
    this.fetchAllTaskList();
  }

  fetchAllTaskList() {
    this.taskService.getAllTask().subscribe(response => {
      console.log('response:', response);
      this.taskList = response;
      this.taskList = this.taskList.body.response.data;
    }, err => {
      console.log('err:', err);
      this.toastr.errorToastr('Something went wrong');
    })
  }

  filter(selectedValue) {
    console.log('selectedValue:', selectedValue);
  }

  navigateDetail(id) {
    this.router.navigate(['admin/task-detail'], { queryParams: {taskId: id} })
  }

  deleteTask(id) {
    console.log('delete id:', id);
    this.taskService.deleteTaskDetails(id).subscribe(response => {
      this.toastr.successToastr('Deleted Successfully');
      this.fetchAllTaskList();
    }, err => {
      this.toastr.errorToastr('Something went wrong');
    })
  }

}
