import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task';
import { convertToDateString } from '../../dateHelper';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TaskService]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  newTask = {
    _id: '',
    title: 'Title',
    description: 'Description',
    deadline: '',
    status: 'open',    
    created_by: '62e3e215e4c239fe3041682c',
    created_on: ''
  } as Task;

  defaultFormValues = {
    title: 'Title',
    description: 'Description',
    deadline: ''
  }
  taskForm = this.formBuilder.group(this.defaultFormValues);  
  
  constructor(
    private taskService: TaskService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshTaskList();
  }
  
  refreshTaskList(){
    this.taskService.getTasks().subscribe((res) => {
      this.tasks = res as Task[];
    });
  }

  onSubmit(){        
    this.newTask.created_on = this.getCreatedOn();
    this.taskService.postTask(this.newTask).subscribe((res) => {
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
    this.taskForm.setValue(this.defaultFormValues);
  }

  onDelete(taskId: string){
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.refreshTaskList();
    });
  }  
}
