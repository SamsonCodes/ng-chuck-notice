import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Assignment } from 'src/app/classes/assignment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Dependencieservice } from 'src/app/services/dependency.service';
import { Dependency } from 'src/app/classes/dependency';


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
    assignments: this.fb.array([]),
    dependencies: this.fb.array([])
  });

  id: string = '';
  
  allUsers: User[] = [];
  assignments: Assignment[] = [];  
  assignedUsers: User[] = [];

  allTasks: Task[] = [];
  dependencies: Dependency[] = []; 
  dependencyTasks: Task[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dependencyService: Dependencieservice,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getId();
    this.getTask();
    this.getAllUsers();
    this.getAllTasks();
    this.getAssignments();
    this.getDependencies();
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

  getAllTasks(): void {
    this.taskService.getTasks().subscribe((res)=>{
      this.allTasks = res as Task[];
    })
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

  getDependencies(): void {
    this.dependencyService.getTaskDependencies(this.id).subscribe((res)=>{
      this.dependencies = res as Array<Dependency>;   
      this.getDependencyTasks();   
      this.selectDependencies();
    })
  }

  getDependencyTasks(): void {
    this.dependencyTasks = [];
    this.dependencies.forEach((dependency)=>{
      this.allTasks.forEach((task)=>{
        if(task._id == dependency.dependency_id){
          this.dependencyTasks.push(task);
        }
      })
    })
  }

  selectDependencies(): void {
    for(let dependency of this.dependencies){
      this.formDependencies.push(this.fb.control(dependency.dependency_id));
    }
  }

  onSubmit(): void {     
    this.submitAssignments(this.taskForm.value.assignments);    
    this.submitDependencies(this.taskForm.value.dependencies);   
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });  
  }  

  onDelete(): void {
    this.taskService.deleteTask(this.id).subscribe((res)=>{
      this.goBack();
    })   
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

  submitDependencies(formDependencyValues: Array<string>): void {   
    let databaseAmount =  this.dependencies.length;
    let formAmount = formDependencyValues.length;

    let existingIndices = this.range(0, databaseAmount - 1);
    for(let i of existingIndices){
      if(formDependencyValues[i] != this.dependencies[i].dependency_id){
        let updatedDependency = {
          _id: this.dependencies[i]._id,
          dependency_id: formDependencyValues[i],
          task_id: this.dependencies[i].task_id
        } as Dependency;
        this.dependencyService.putDependency(updatedDependency).subscribe((res)=>{});
      }
    }

    if(databaseAmount < formAmount){
      let newIndices = this.range(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        let newDependency = {
          _id: '',
          dependency_id: formDependencyValues[i],
          task_id: this.id
        } as Dependency;
        this.dependencyService.postDependency(newDependency).subscribe((res)=>{});
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

  get formDependencies(){
    return this.taskForm.get('dependencies') as FormArray;
  }

  addDependency(): void {
    this.formDependencies.push(this.fb.control(''));
  }

  removeDependency(i: number): void {
    this.formDependencies.removeAt(i);
    if(this.dependencies.length > 0 && i < this.dependencies.length)    {
      this.dependencyService.deleteDependency(this.dependencies[i]._id).subscribe((res)=>{
        this.dependencies.splice(i, 1);
        this.getDependencyTasks();
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
