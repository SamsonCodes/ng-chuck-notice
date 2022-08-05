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
    let observable = new Observable(observer=>{
      this.dependencyCheck(task).subscribe(open=>{
        console.log('dependency check finished');
        
        if(!open){
          task.status = 'waiting'; 
        }
        else{
          if (task.status == 'waiting'){
            task.status = 'open';
          }
        }        
        console.log(task);         
        if(task.status == 'finished'){
          console.log('Updating status of tasks depending on this finished task');
          this.dependencyOnUpdate(task).subscribe((res)=>{
            this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe((res)=>{          
              observer.next(res); 
            });
          });
        }
        else {
          this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe((res)=>{          
            observer.next(res); 
          });
        }        
      }) 
    })
    return observable;
  }

  deleteTask(taskId: string){
    this.deleteAssignments(taskId);
    this.deleteDependenciesOf(taskId);
    this.deleteDependenciesOn(taskId);
    return this.http.delete(this.tasksUrl + `/${taskId}`);
  }

  private dependencyCheck(task: Task): Observable<boolean> { 
    console.log(`Performing dependencycheck for task:${task._id}`);
    let observable = new Observable<boolean>(observer => {
      this.getDependencyTasks(task._id).subscribe((res)=> {
        console.log('dependency tasks loaded');
        
        let dependencyTasks = res as Array<Task>;
        let open = true;                 
        for(let dTask of dependencyTasks){
          if(open){            
            if(dTask.status!='finished'){
              open = false;
              console.log(`Still waiting on dependency: ${dTask.title}`);              
            }
          }
        }
        observer.next(open);
      })    
    })   
    return observable;
  }

  private dependencyOnUpdate(task: Task) { 
    console.log(`Performing dependencyOnUpdate for task:${task._id}`);
    let observable = new Observable<boolean>(observer => {
      this.getDependantTasks(task._id).subscribe((res)=> {        
        let dependantTasks = res as Array<Task>;        
        console.log(`${dependantTasks.length} dependant tasks loaded`);
        console.log(dependantTasks);
        if(dependantTasks.length > 0){
          let updates = [];
          for(let dOnTask of dependantTasks){
            if(dOnTask.status == 'waiting'){
              dOnTask.status ='open';
              updates.push(this.http.put(this.tasksUrl + `/${dOnTask._id}`, dOnTask));
            }
          }
          if(updates.length > 0){
            forkJoin(updates).subscribe((res)=>{
              console.log('Updates completed.');
              console.log(res);
              observer.next();
            });
          } 
          else {
            console.log('No updates required.');            
            observer.next();
          }          
        }
        else{
          console.log('No dependant tasks loaded so skipping.');          
          observer.next();
        }
      })    
    })   
    return observable;
  }

  private getDependencyTasks(taskId: string) {
    let observable = new Observable(observer=>{
      this.dependencyService.getTaskDependencies(taskId).subscribe((results)=>{
        let dependencies = results as Array<Dependency>;
        if(dependencies.length > 0){
          let taskCalls: Observable<Task>[] = [];
          dependencies.forEach((dependency)=>{
            const taskCall = this.getTask(dependency.dependency_id) as Observable<Task>;
            taskCalls.push(taskCall);
          })
          
          forkJoin(taskCalls).subscribe((res)=>{
            console.log('dependencies loaded');
            
            observer.next(res);
          })       
        }
        else{
          console.log('no dependencies');
          observer.next([]);
        }         
      })
    });
    return observable;
  }

  private getDependantTasks(taskId: string) {
    let observable = new Observable(observer=>{
      this.dependencyService.getDependenciesOn(taskId).subscribe((results)=>{
        let dependenciesOn = results as Array<Dependency>;
        console.log(`${dependenciesOn.length} dependenciesOn found:`)
        console.log(dependenciesOn);
        
        if(dependenciesOn.length > 0){
          let taskCalls: Observable<Task>[] = [];
          dependenciesOn.forEach((dependency)=>{
            const taskCall = this.getTask(dependency.task_id) as Observable<Task>;
            taskCalls.push(taskCall);
          })
          
          forkJoin(taskCalls).subscribe((res)=>{
            console.log('dependant tasks loaded');
            
            observer.next(res);
          })       
        }
        else{
          console.log('no dependant tasks');
          observer.next([]);
        }         
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
