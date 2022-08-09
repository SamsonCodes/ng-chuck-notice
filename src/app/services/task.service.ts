import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../classes/task';
import { AssignmentService } from './assignment.service';
import { Assignment } from '../classes/assignment';
import { DependencyService } from './dependency.service';
import { Dependency } from '../classes/dependency';
import { forkJoin, Observable, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  putTask(task: Task): Observable<void>{
    let observable = new Observable<void>(subscriber=>{
      this.dependencyCheckAndUpdate(task).subscribe(()=>{        
        this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe(()=>{ 
          if(task.status == 'finished'){
            this.updateDependantTasks(task._id).subscribe(()=>{           
              subscriber.next(); 
            });
          }  
          else {            
            subscriber.next();
          }
        });    
      }); 
    })
    return observable;
  }

  private dependencyCheckAndUpdate(task: Task): Observable<void> { 
    console.log(`Performing dependencyCheckAndUpdate for ${task.title}`);
    let observable = new Observable(subscriber => {
      this.getDependencyTasks(task._id).subscribe((res)=> {        
        let dependencyTasks = res as Array<Task>;
        let open = true;                 
        for(let dTask of dependencyTasks){
          if(open){            
            if(dTask.status!='finished'){
              open = false;
              console.log(`${task.title} still waiting on dependency: ${dTask.title}`);              
            }
          }
        }        
        if(task.status =='waiting' && open){
          console.log(`opening ${task.title}`);
          task.status = 'open';          
          this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe((res)=>{
            console.log(`dependencyCheckAndUpdate for ${task.title} finished`);
            subscriber.next();
          });
        }
        else {
          console.log(`dependencyCheckAndUpdate for ${task.title} finished`);
          subscriber.next();
        }        
      })    
    }) as Observable<void>;
    return observable;
  }

  private getDependencyTasks(taskId: string): Observable<Task[]> {
    let observable = new Observable<Task[]>(subscriber=>{
      this.dependencyService.getTaskDependencies(taskId).subscribe((results)=>{
        let dependencies = results as Array<Dependency>;
        if(dependencies.length > 0){
          let taskCalls: Observable<Task>[] = [];
          dependencies.forEach((dependency)=>{
            const taskCall = this.getTask(dependency.dependency_id) as Observable<Task>;
            taskCalls.push(taskCall);
          });          
          combineLatest(taskCalls).subscribe((res)=>{            
            subscriber.next(res);
          });
        }
        else{
          subscriber.next([]);
        }         
      })
    });
    return observable;
  }

  private updateDependantTasks(taskId: string): Observable<void> {     
    console.log(`Performing updateDependantTasks for task:${taskId}`);
    let observable = new Observable(subscriber => {
      this.getDependantTasks(taskId).pipe(
        switchMap((dependantTasks: Task[])=>{  
          return this.dependencyCheckAndUpdateAll(dependantTasks);
        })
      ).subscribe(()=>{
          subscriber.next();
      });
    }) as Observable<void>;
    return observable;
  }   

  private dependencyCheckAndUpdateAll(tasks: Task[]): Observable<void>{
    let observable = new Observable<void>(subscriber=>{
      let checkAndUpdateCalls: Observable<void>[] = [];
          tasks.forEach(task => {   
            if(task.status == 'waiting'){
              let checkAndUpdateCall = this.dependencyCheckAndUpdate(task);
              checkAndUpdateCalls.push(checkAndUpdateCall);
            }
          })
          if(checkAndUpdateCalls.length > 0){
            combineLatest(checkAndUpdateCalls).subscribe(()=>{
              console.log('All check and update calls finished.');            
              subscriber.next();
            });
          } 
          else{
            subscriber.next();
          } 
    });
    return observable;
  }

  private getDependantTasks(taskId: string): Observable<Task[]> {
    let observable = new Observable(subscriber=>{
      this.dependencyService.getDependenciesOn(taskId).subscribe((results)=>{
        let dependenciesOn = results as Array<Dependency>;        
        if(dependenciesOn.length > 0){
          let taskCalls: Observable<Task>[] = [];
          dependenciesOn.forEach((dependency)=>{
            const taskCall = this.getTask(dependency.task_id) as Observable<Task>;
            taskCalls.push(taskCall);
          });          
          forkJoin(taskCalls).subscribe((tasks)=>{
            console.log('dependant tasks loaded');  
            console.log(tasks);          
            subscriber.next(tasks);
          });       
        }
        else{
          console.log('no dependant tasks');
          subscriber.next([]);
        }         
      })
    }) as Observable<Task[]>;
    return observable;
  }
  
  deleteTask(taskId: string){
    let observable = new Observable<void>(subscriber=>{
      this.getTask(taskId).subscribe((taskData)=>{
        let task = taskData as Task;
        task.status='finished'; //First save the task as finished so the dependant tasks can be updated before task deletion.
        this.http.put(this.tasksUrl + `/${taskId}`, task).subscribe(()=>{
          this.updateDependantTasks(taskId).subscribe(()=>{
            this.deleteAssignments(taskId);
            this.deleteDependenciesOf(taskId);
            this.deleteDependenciesOn(taskId);
            this.http.delete(this.tasksUrl + `/${taskId}`).subscribe(()=>{
              subscriber.next();
            });
          })
        })
      });      
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
