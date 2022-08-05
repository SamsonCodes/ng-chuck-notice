import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../classes/task';
import { AssignmentService } from './assignment.service';
import { Assignment } from '../classes/assignment';
import { DependencyService } from './dependency.service';
import { Dependency } from '../classes/dependency';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksUrl = 'http://localhost:3000/api/tasks';  

  constructor(
    private http: HttpClient,
    private assignmentService: AssignmentService,
    private dependencyService: DependencyService
    ) { }

  postTask(task: Task){
    return this.http.post(this.tasksUrl, task);
  }

  getTasks(){
    return this.http.get(this.tasksUrl);
  }

  getTask(taskId: string){
    return this.http.get(this.tasksUrl + `/${taskId}`);
  }

  putTask(task: Task){
    return this.http.put(this.tasksUrl + `/${task._id}`, task);
  }

  deleteTask(taskId: string){
    this.deleteAssignments(taskId);
    this.deleteDependenciesOf(taskId);
    this.deleteDependenciesOn(taskId);
    return this.http.delete(this.tasksUrl + `/${taskId}`);
  }

  dependencyCheck(taskId: string): Observable<boolean> { 
    console.log(`Performing dependencycheck for task:${taskId}`);
    let observable = new Observable<boolean>(observer => {
      this.getDependencyTasks(taskId).subscribe((res)=> {
        let dependencyTasks = res as Array<Task>;
        let open = true;                 
        for(let task of dependencyTasks){
          if(open){            
            if(task.status!='finished'){
              open = false;
              console.log(`task:${task.title}:${task.status}`);
              console.log('Still waiting on dependencies.');              
            }
          }
        }
        observer.next(open);
      })    
    })   
    return observable;
  }

  private getDependencyTasks(taskId: string) {
    let observable = new Observable(observer=>{
      this.dependencyService.getTaskDependencies(taskId).subscribe((results)=>{
        let dependencies = results as Array<Dependency>;
        let taskCalls: Observable<Task>[] = [];
        dependencies.forEach((dependency)=>{
          const taskCall = this.getTask(dependency.dependency_id) as Observable<Task>;
          taskCalls.push(taskCall);
        })
        forkJoin(taskCalls).subscribe((res)=>{
          observer.next(res);
        })        
      })
    });
    return observable;
  }

  private deleteAssignments(taskId: string){
    this.assignmentService.getTaskAssignments(taskId)
      .subscribe((results) => {
        let taskAssignments = results as Array<Assignment>;
        taskAssignments.forEach((assignment)=>{
          this.assignmentService.deleteAssignment(assignment._id).subscribe();
        })
      })
  }

  private deleteDependenciesOf(taskId: string){
    this.dependencyService.getTaskDependencies(taskId)
      .subscribe((results) => {
        let taskDependencies = results as Array<Assignment>;
        taskDependencies.forEach((dependency)=>{
          this.dependencyService.deleteDependency(dependency._id).subscribe();
        })
      })
  }

  private deleteDependenciesOn(taskId: string){
    this.dependencyService.getDependenciesOn(taskId)
      .subscribe((results) => {
        let dependenciesOn = results as Array<Assignment>;
        dependenciesOn.forEach((dependency)=>{
          this.dependencyService.deleteDependency(dependency._id).subscribe();
        })
      })
  }
}
