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

  getId(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }

  getTask(): void {
    this.taskService.getTask(this.id).subscribe(task => {
        this.selectedTask = task as Task;  
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

  selectAssignments(): void {
    for(let assignment of this.assignments){
      this.formAssignments.push(this.fb.control(assignment.user_id));
    }
  }

  onSubmit(): void {     
    var formAssignmentValues = this.taskForm.value.assignments;
    this.submitAssignments(formAssignmentValues); 
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });
         
  }  

  submitAssignments(formAssignmentValues: Array<string>): void {   
    let databaseAmount =  this.assignments.length;
    let formAmount = formAssignmentValues.length;

    let existingIndices = this.range(0, databaseAmount - 1);
    for(let i of existingIndices){
      if(formAssignmentValues[i] != this.assignments[i].user_id){
        let updatedAssignment = {
          _id: this.assignments[i]._id,
          user_id: formAssignmentValues[i],
          task_id: this.assignments[i].task_id
        } as Assignment;
        this.assignmentService.putAssignment(updatedAssignment).subscribe((res)=>{});
      }
    }

    if(databaseAmount < formAmount){
      let newIndices = this.range(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        let newAssignment = {
          _id: '',
          user_id: formAssignmentValues[i],
          task_id: this.id
        } as Assignment;
        this.assignmentService.postAssignment(newAssignment).subscribe((res)=>{});
      }
    }
  }

  get formAssignments(){
    return this.taskForm.get('assignments') as FormArray;
  }

  addAssignment(): void {
    this.formAssignments.push(this.fb.control(''));
  }

  removeAssignment(i: number): void {
    this.formAssignments.removeAt(i);
    if(this.assignments.length > 0 && i < this.assignments.length)    {
      this.assignmentService.deleteAssignment(this.assignments[i]._id).subscribe((res)=>{
        this.assignments.splice(i, 1);
        this.getAssignedUsers();
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
  
  range(start: number, finish: number): Array<number>{
    if(start == 0){
      return Array.from(Array(finish + 1).keys()); //Example: (0,3) => [0,1,2,3]
    }
    else {
      let length = (finish + 1) - start;
      var tempRange = Array.from(Array(length).keys());
      var range = tempRange.map((val)=>{return val + start})
      return range; //Example: (1,3) returns [1,3]
    }    
  }

  logger(): void{
    // console.log(this.taskForm.value);    
  }
}
