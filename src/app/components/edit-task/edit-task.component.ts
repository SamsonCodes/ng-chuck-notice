import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { Task } from '../../task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Assignment } from 'src/app/assignment';
import { User } from 'src/app/user';
import { UserService } from 'src/app/services/user.service';
import { fromEventPattern } from 'rxjs';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  selectedTask = {
  } as Task;

  taskForm = this.fb.group({
    title: '',
    description: '',
    deadline: '',
    status: '',
    assignments: this.fb.array([])
  });

  id: string = '';
  
  allUsers: User[] = [];
  assignments: Assignment[] = [];  
  assignedUsers: User[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private fb: FormBuilder
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
    var assignmentValues = this.taskForm.value.assignments;
    console.log(assignmentValues);
    console.log(this.assignments);
    
    //1) for indices corresponding to existing assignments, update if user_id has changed
    for(let i = 0; i < this.assignments.length; i++){
      if(assignmentValues[i] != this.assignments[i].user_id){
        let newAssignment = {
          _id: this.assignments[i]._id,
          user_id: assignmentValues[i],
          task_id: this.assignments[i].task_id
        } as Assignment;
        this.assignmentService.putAssignment(newAssignment).subscribe((res)=>{});
      }
    }
    //2) for remaining indices add new assignment
    for(let i = this.assignments.length; i < assignmentValues.length; i++){
      let newAssignment = {
        _id: '',
        user_id: assignmentValues[i],
        task_id: this.id
      } as Assignment;
      this.assignmentService.postAssignment(newAssignment).subscribe((res)=>{});
    }
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });      
  } 

  getAllUsers(): void {
    this.userService.getUsers().subscribe((res)=>{
      this.allUsers = res as User[];  
    });
  }
  
  getAssignments(): void {    
    this.assignmentService.getTaskAssignments(this.id).subscribe((res)=>{
      this.assignments = res as Array<Assignment>;   
      this.getAssignedUsers();   
      this.selectAssignments();
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

  removeAssignment(i: number): void {
    this.formAssignments.removeAt(i);
    if(this.assignments.length > 0 && i < this.assignments.length)    {
      this.assignmentService.deleteAssignment(this.assignments[i]._id).subscribe((res)=>{
        this.getAssignedUsers();
      });
    }
  }

  get formAssignments(){
    return this.taskForm.get('assignments') as FormArray;
  }

  addAssignment(){
    this.formAssignments.push(this.fb.control(''));
  }

  selectAssignments(){
    for(let assignment of this.assignments){
      this.formAssignments.push(this.fb.control(assignment.user_id));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
