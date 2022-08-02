import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { Task } from '../../task';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  selectedTask = {
  } as Task;

  defaultFormValues = {
    title: ''
  }
  taskForm = this.formBuilder.group(this.defaultFormValues);  
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.taskService.getTask(id!)
      .subscribe(task => {
        this.selectedTask = task as Task;  
    });
  }

  onSubmit(){ 
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });      
  }

  goBack(): void {
    this.location.back();
  }

}
