import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { Task } from '../../task';
import { Assignment } from 'src/app/assignment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';


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

  assignmentForm = this.formBuilder.group({
    user_id: ''
  }); 

  assignments: Assignment[] = [];
  allUsers: User[] = [];
  assignedUsers: User[] = [];

  id: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService, 
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getId();
    this.getTask();    
    this.getAllUsers();
    this.getAssignments();
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

  getAllUsers(): void {
    this.userService.getUsers().subscribe((res)=>{
      this.allUsers = res as User[];
    });
  }

  onAssignment(): void {
    var assignment = {
      _id: '',
      user_id: this.assignmentForm.value.user_id,
      task_id: this.id
    } as Assignment;
    this.taskService.postAssignment(assignment).subscribe((res)=>{
      this.assignmentForm.setValue({
        user_id: ''
      });
      this.getAssignments();
    })
  }

  removeAssignment(removeUserId: string): void {    
    this.assignments.forEach((assignment)=>
    {
      if(assignment.user_id == removeUserId){
        this.taskService.deleteAssignment(assignment._id).subscribe((res)=>{
          this.getAssignments();
        })
      }
    })
  }

  goBack(): void {
    this.location.back();
  }

  getAssignments(): void {    
    this.taskService.getTaskAssignments(this.id).subscribe((res)=>{
      this.assignments = res as Array<Assignment>;   
      this.getAssignedUsers();   
    })
  }

  getAssignedUsers(): void {
    this.assignedUsers = [];
    this.assignments.forEach((assignment)=>{
      this.allUsers.forEach((user)=>{
        if(user._id == assignment.user_id){
          this.assignedUsers.push(user);
        }
      })
    })
  }
}
