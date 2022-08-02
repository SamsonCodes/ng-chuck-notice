import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
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

  defaultTaskFormValues = {
    title: '',
    description: '',
    deadline: '',
    status: ''
  }
  taskForm = this.formBuilder.group(this.defaultTaskFormValues);

  id: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getId();
    this.getTask();
  }

  getId(){
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }

  getTask(): void {
    this.taskService.getTask(this.id)
      .subscribe(task => {
        this.selectedTask = task as Task;  
    });
  }

  onSubmit(): void { 
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });      
  }  

  goBack(): void {
    this.location.back();
  }
}
