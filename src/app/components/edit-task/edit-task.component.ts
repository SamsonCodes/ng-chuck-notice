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
import { ChuckNorrisApiService } from 'src/app/services/chuck-norris-api.service';

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
    formAssignments: this.fb.array([]),
    formDependencies: this.fb.array([])
  });

  id: string = '';
  
  allUsers: User[] = [];
  assignments: Assignment[] = []; 

  otherTasks: Task[] = [];
  dependencies: Dependency[] = []; 

  selectConfig = {
    valueField: "value",
    labelField: "label",
    highlight: false,
    create: false,
    persist: true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    searchField: ['label']
  };
  data = [
    {
      label: 'Option 1',
      value: '1'
    },
      {
      label: 'Option 2',
      value: '2'
    },
      {
      label: 'Option 3',
      value: '3'
    }
  ]
  finishedOnLoad = false;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private authService: AuthService,
    private chuckService: ChuckNorrisApiService
  ) {}

  ngOnInit(): void {
    this.getId();
    this.getTask();
    this.getAllUsers();
    this.getOtherTasks();
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
        if(this.selectedTask.status == 'finished'){
          this.finishedOnLoad = true;
        }
    });
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe((res)=>{
      this.allUsers = res as User[];  
    });
  }

  getOtherTasks(): void {
    this.taskService.getTasks().subscribe((res)=>{
      let allTasks = res as Task[];      
      this.otherTasks = allTasks.filter(task=>
        (task._id != this.id)
      );      
      this.createSelectOptions();
    })
  }

  createSelectOptions(){
    let options = []
    for(let i = 0; i < this.otherTasks.length; i++){
      let dataObject = {
        'label': this.otherTasks[i].title,
        'value': this.otherTasks[i]._id
      }
      options.push(dataObject);
    }
    this.data = options;
  }

  getAssignments(): void {    
    this.assignmentService.getTaskAssignments(this.id).subscribe((res)=>{
      this.assignments = res as Array<Assignment>; 
      for(let assignment of this.assignments){
        this.formAssignments.push(this.fb.control(assignment.user_id));
      }
    })
  }

  getDependencies(): void {
    this.dependencyService.getTaskDependencies(this.id).subscribe((res)=>{
      this.dependencies = res as Array<Dependency>; 
      for(let dependency of this.dependencies){
        this.formDependencies.push(this.fb.control(dependency.dependency_id));
      }
    })
  }

  onSubmit(): void {   
    console.log(this.selectedTask)
    if(this.selectedTask.status == "finished" && !this.finishedOnLoad){
      console.log('Finished');
      this.getJoke().subscribe(joke => {
        alert(joke);
      })
    }    
    this.submitAssignments(this.taskForm.value.formAssignments);  
    this.submitDependencies(this.taskForm.value.formDependencies)
      .pipe(
        defaultIfEmpty(),
      ).subscribe(()=>{
        this.taskService.putTask(this.selectedTask).subscribe(() => {
          this.goBack();          
      });
    });      
  }

  onDelete(): void {
    this.taskService.deleteTask(this.id).subscribe(()=>{
      this.goBack();
    })   
  }

  submitAssignments(formAssignmentValues: Array<string>): void {   
    let databaseAmount = this.assignments.length;
    let formAmount = formAssignmentValues.length;

    let existingIndices = this.createRange(0, databaseAmount - 1);
    for(let i of existingIndices){
      if(formAssignmentValues[i] != this.assignments[i].user_id){
        this.updateAssignment(this.assignments[i], formAssignmentValues[i]);
      }
    }

    let formHasNewAssignments = databaseAmount < formAmount;
    if(formHasNewAssignments){
      let newIndices = this.createRange(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        this.postAssignment(formAssignmentValues[i]);
      }
    }
  }

  createRange(from: number, to: number): Array<number>{
    if(from == 0){
      return Array.from(Array(to + 1).keys()); //Example: createRange(0,3) => [0,1,2,3]
    }
    else {
      let length = (to + 1) - from;
      let tempRange = Array.from(Array(length).keys());
      let range = tempRange.map((val)=>{return val + from})
      return range; //Example: createRange(1,3) returns [1,2,3]
    }    
  }  

  updateAssignment(assignment: Assignment, newUserId: string){
    let updatedAssignment: Assignment = 
    {
      _id: assignment._id,
      user_id: newUserId,
      task_id: assignment.task_id
    };
    this.assignmentService.putAssignment(updatedAssignment).subscribe();
  }

  postAssignment(userId: string){
    let newAssignment: Assignment = 
    {
      _id: '',
      user_id: userId,
      task_id: this.id
    };
    this.assignmentService.postAssignment(newAssignment).subscribe();
  }

  submitDependencies(formDependencyValues: Array<string>): Observable<Object[]> {
    let databaseAmount =  this.dependencies.length;
    let formAmount = formDependencyValues.length;
    
    let databaseCalls = [];
    let existingIndices = this.createRange(0, databaseAmount - 1);
    
    for(let i of existingIndices){
      if(formDependencyValues[i] != this.dependencies[i].dependency_id){
        databaseCalls.push( this.updateDependencyObservable(this.dependencies[i], formDependencyValues[i]) );
      }
    }

    let formHasNewDependencies = databaseAmount < formAmount;
    if(formHasNewDependencies){
      let newIndices = this.createRange(databaseAmount, formAmount - 1);
      for(let i of newIndices){
        databaseCalls.push( this.postDependencyObservable(formDependencyValues[i]) );
      }
    }    
    return forkJoin(databaseCalls);
  }

  updateDependencyObservable(dependency: Dependency, newDependencyId: string): Observable<Object> {
    let updatedDependency: Dependency = 
    {
      _id: dependency._id,
      dependency_id: newDependencyId,
      task_id: dependency.task_id
    };
    return this.dependencyService.putDependency(updatedDependency);
  }

  postDependencyObservable(newDependencyId: string): Observable<Object> {
    let newDependency: Dependency = 
    {
      _id: '',
      dependency_id: newDependencyId,
      task_id: this.id
    };
    return this.dependencyService.postDependency(newDependency)
  }

  get formAssignments(){
    //Allows us to easily access the assignment form array in the functions below.
    return this.taskForm.get('formAssignments') as FormArray;
  }

  addFormAssignment(): void {
    this.formAssignments.push(this.fb.control(''));
  }

  removeAssignment(i: number): void {
    this.formAssignments.removeAt(i);
    if(this.assignments.length > 0 && i < this.assignments.length)    {
      this.assignmentService.deleteAssignment(this.assignments[i]._id).subscribe((res)=>{
        this.assignments.splice(i, 1);
      });
    }
  }

  get formDependencies(){
    //Allows us to easily access the dependency form array in the functions below.
    return this.taskForm.get('formDependencies') as FormArray;
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
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  isManager(): boolean {
    return this.authService.hasManagerRights();
  } 

  getUserName(id:string){
    return this.allUsers.find(element=> element._id == id)?.name;
  }

  getJoke(){
    return this.chuckService.getOne();
  }
}
