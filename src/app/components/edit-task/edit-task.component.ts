import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Assignment } from 'src/app/classes/assignment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { DependencyService } from 'src/app/services/dependency.service';
import { Dependency } from 'src/app/classes/dependency';
import { AuthService } from 'src/app/services/auth.service';


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

  otherTasks: Task[] = [];
  dependencies: Dependency[] = []; 
  dependencyTasks: Task[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private authService: AuthService
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
      let allTasks = res as Task[];      
      this.otherTasks = allTasks.filter(task=>
        (task._id != this.id)
      )      
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
      this.otherTasks.forEach((task)=>{
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
    if(this.taskForm.value.dependencies.length > 0){
      this.submitDependencies(this.taskForm.value.dependencies)
        .pipe(
          defaultIfEmpty(),
        ).subscribe((res)=>{
          this.taskService.putTask(this.selectedTask).subscribe(() => {
            this.goBack();          
        });
      });
    }  
    else{
      this.taskService.putTask(this.selectedTask).subscribe(() => {
        this.goBack();          
      });
    }
           
  }

  onDelete(): void {
    this.taskService.deleteTask(this.id).subscribe(()=>{
      this.goBack();
    })   
  }

  submitAssignments(formAssignmentValues: Array<string>): void {   
    let databaseAmount =  this.assignments.length;
    let formAmount = formAssignmentValues.length;

    let existingIndices = this.range(0, databaseAmount - 1);
    for(let i of existingIndices){
      if(formAssignmentValues[i] != this.assignments[i].user_id){
        let updatedAssignment: Assignment = 
        {
          _id: this.assignments[i]._id,
          user_id: formAssignmentValues[i],
          task_id: this.assignments[i].task_id
        };
        this.assignmentService.putAssignment(updatedAssignment).subscribe();
      }
    }

    if(databaseAmount < formAmount){
      let newIndices = this.range(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        let newAssignment: Assignment = 
        {
          _id: '',
          user_id: formAssignmentValues[i],
          task_id: this.id
        };
        this.assignmentService.postAssignment(newAssignment).subscribe();
      }
    }
  }

  submitDependencies(formDependencyValues: Array<string>): Observable<Object[]> {
    let databaseAmount =  this.dependencies.length;
    let formAmount = formDependencyValues.length;
    
    let databaseCalls = [];
    let existingIndices = this.range(0, databaseAmount - 1);
    
    for(let i of existingIndices){
      if(formDependencyValues[i] != this.dependencies[i].dependency_id){
        let updatedDependency: Dependency = 
        {
          _id: this.dependencies[i]._id,
          dependency_id: formDependencyValues[i],
          task_id: this.dependencies[i].task_id
        };
        databaseCalls.push(this.dependencyService.putDependency(updatedDependency));
      }
    }

    if(databaseAmount < formAmount){
      let newIndices = this.range(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        let newDependency: Dependency = 
        {
          _id: '',
          dependency_id: formDependencyValues[i],
          task_id: this.id
        };
        databaseCalls.push(this.dependencyService.postDependency(newDependency));
      }
    }    
    return forkJoin(databaseCalls);
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
    this.taskForm.patchValue({status: 'waiting'});
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
  
  range(from: number, to: number): Array<number>{
    if(from == 0){
      return Array.from(Array(to + 1).keys()); //Example: range(0,3) => [0,1,2,3]
    }
    else {
      let length = (to + 1) - from;
      let tempRange = Array.from(Array(length).keys());
      let range = tempRange.map((val)=>{return val + from})
      return range; //Example: range(1,3) returns [1,2,3]
    }    
  }  

  isManager(): boolean {
    return this.authService.isManager();
  } 

  getUserName(id:string){
    return this.allUsers.find(element=> element._id == id)?.name;
  }
}
