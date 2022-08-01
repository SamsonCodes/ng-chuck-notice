import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TaskService } from '../../task.service';
import { Task } from '../../task';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TaskService]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask?: Task;


  defaultValues = {
    title: 'Title',
    description: 'Description',
    deadline: '',
    status: 'Open',    
    created_by: '62e3e215e4c239fe3041682c',
    created_on: ''
  }
  taskForm = this.formBuilder.group(this.defaultValues);
  
  constructor(
    private taskService: TaskService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshTaskList();
  }

  onSubmit(){
    console.log(this.taskForm.value); 
    this.taskService.postTask(this.taskForm.value).subscribe((res) => {
      this.refreshTaskList();
      this.resetForm();
    });      
  }

  resetForm(){
    this.taskForm.setValue(this.defaultValues);
  }

  onEdit(task: Task){
    this.selectedTask = task;
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
