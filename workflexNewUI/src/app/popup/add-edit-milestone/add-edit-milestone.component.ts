import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {INDIAN_DATE_FORMAT} from 'src/app/constants/constants';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';


@Component({
  selector: 'app-add-edit-milestone',
  templateUrl: './add-edit-milestone.component.html',
  styleUrls: ['./add-edit-milestone.component.scss'],
  providers: [

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: INDIAN_DATE_FORMAT }
  ]
})
export class AddEditMilestoneComponent implements OnInit {
  title = 'Add Task';
  taskForm: FormGroup;
  task;
  isFirstTask;
  startDate = moment();

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditMilestoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.isFirstTask = this.data.isFirstTask;
      this.startDate = data.startDate && (this.startDate > data.startDate) ? this.startDate : data.startDate; 
      if(data.task) {
        this.title = "Edit Task";
        this.task = data.task;
      }
    }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      tasks: this.formBuilder.array([])
    });
    
    const noOfTasks = this.isFirstTask ? 3 : 1;
    for(let i=0; i<noOfTasks; i++) {
      const taskForm = this.formBuilder.group({
        endDate: [this.task ? this.task.endDate: '',[Validators.required]],
        amount: [this.task ? this.task.amount: '', [Validators.required]],
        description: [this.task ? this.task.description : '', [Validators.required]]
      });
      this.tasks.push(taskForm);
    }
    
  }

  get tasks() {
    return this.taskForm.get('tasks') as FormArray;
  }

  addTask() {
    if(this.taskForm.valid) {
      this.data.tasks = this.taskForm.value.tasks;
      this.dialogRef.close(this.data);
    } else {
      this.taskForm.markAllAsTouched()
    }
  }

  deleteTask(i){
    if(this.tasks.length > 1) {
      this.tasks.removeAt(i);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getMinDate(index) {
    if(!this.isFirstTask) {
      return this.startDate;
    }
    
    if(index == 0) {
      return this.startDate;
    }

    if(index == 1) {
      return this.tasks.at(0).get('endDate').value ? this.tasks.at(0).get('endDate').value : this.startDate;
    }

    if(index == 2) {
      return this.tasks.at(1).get('endDate').value ? this.tasks.at(1).get('endDate').value : 
        (this.tasks.at(0).get('endDate').value ? this.tasks.at(0).get('endDate').value : this.startDate); 
    }

  }

  getMaxDate(index) {
    if(!this.isFirstTask) {
      return '';
    }

    if(index == 0) {
      return this.tasks.length > 1 && this.tasks.at(1).get('endDate').value ? this.tasks.at(1).get('endDate').value : 
       (this.tasks.length > 2 && this.tasks.at(2).get('endDate').value ? this.tasks.at(2).get('endDate').value : '');
    }

    if(index == 1) {
      return this.tasks.length > 2 && this.tasks.at(2).get('endDate').value ? this.tasks.at(2).get('endDate').value : '';
    }
  }

}
