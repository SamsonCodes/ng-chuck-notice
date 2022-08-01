import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TaskService } from '../../task.service';
import { Task } from '../../task';

import { convertToDateString } from '../../dateHelper';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TaskService]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  defaultValues = {
    title: 'Title',
    description: 'Description',
    deadline: ''
  }

  taskForm = this.formBuilder.group(this.defaultValues);

  task = {
    title: 'Title',
    description: 'Description',
    deadline: '',
    status: 'Open',    
    created_by: '62e3e215e4c239fe3041682c',
    created_on: ''
  } as Task;
  
  constructor(
    private taskService: TaskService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshTaskList();
  }

  onSubmit(){        
    this.task.created_on = this.getCreatedOn();
    console.log(this.task); 
    this.taskService.postTask(this.task).subscribe((res) => {
      this.refreshTaskList();
      this.resetForm();
    });      
  }

  getCreatedOn(){
    var today = new Date();
    var todayString = convertToDateString(today);
    return todayString
  }

  resetForm(){
    this.taskForm.setValue(this.defaultValues);
  }

  onDelete(taskId: string){
    this.taskService.deleteTask(taskId).subscribe((res) => {
      this.refreshTaskList();
    });
  }

  refreshTaskList(){
    this.taskService.getTasks().subscribe((res) => {
      this.tasks = res as Task[];
    });
  }

  logger(){
    console.log(this.taskForm.value);    
  }
}
