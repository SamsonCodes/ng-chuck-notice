import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task';
import { convertToDateString } from '../../dateHelper';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';

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

  taskForm = this.fb.group({
    title: this.newTask.title,
    description: this.newTask.description,
    deadline: this.newTask.deadline,
    status: this.newTask.status,
    assignments: this.fb.array([]),
    dependencies: this.fb.array([])
  });

  otherTasks: Task[] = [];
  allUsers: User[] = [];
  
  constructor(
    private taskService: TaskService,
    private userService: UserService, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshTaskList();
    this.getAllTasks();
    this.getAllUsers();
  }

  getAllTasks(): void {
    this.taskService.getTasks().subscribe((res)=>{
      this.otherTasks = res as Task[];  
    })
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe((res)=>{
      this.allUsers = res as User[];  
    });
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
    this.newTask = {
      _id: '',
      title: 'Title',
      description: 'Description',
      deadline: '',
      status: 'open',    
      created_by: '62e3e215e4c239fe3041682c',
      created_on: ''
    } as Task;
  
    this.taskForm = this.fb.group({
      title: this.newTask.title,
      description: this.newTask.description,
      deadline: this.newTask.deadline,
      status: this.newTask.status,
      assignments: this.fb.array([]),
      dependencies: this.fb.array([])
    });
  }

  onDelete(taskId: string){
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.refreshTaskList();
    });
  }  

  get formAssignments(){
    return this.taskForm.get('assignments') as FormArray;
  }

  addAssignment(): void {
    this.formAssignments.push(this.fb.control(''));
  }

  removeAssignment(i: number): void {
    this.formAssignments.removeAt(i);
  }

  get formDependencies(){
    return this.taskForm.get('dependencies') as FormArray;
  }

  addDependency(): void {
    this.formDependencies.push(this.fb.control(''));
    this.taskForm.patchValue({status: 'waiting'});
  }

  removeDependency(i: number): void {
    this.formDependencies.removeAt(i);
  }

  logger(){
    console.log(this.taskForm.value);
    console.log(this.newTask);
  }
}
