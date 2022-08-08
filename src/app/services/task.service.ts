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


  observableTest(){    
    let observable = new Observable(subscriber=>{
      this.fetchProduct('A').pipe(
        switchMap((product) => this.fetchSimilarProducts(product)),
        switchMap((products: string[]) => {
          console.log('deleting products:');
          console.log(products);        
          
          let deleteCalls: Observable<string>[] = [];
          products.forEach(product=>{
            let deleteCall: Observable<string> = this.deleteProduct(product); 
            deleteCalls.push(deleteCall);
          })
          return combineLatest(deleteCalls);
        })
      ).subscribe((deleteResults: string[])=>{
        console.log('All deletecalls returned.');      
        subscriber.next(deleteResults);
      })
    }) as Observable<string[]>;
    return observable;
  }

  observableTestB(){
    let observable = new Observable(subscriber=>{
      this.fetchProduct('A1').subscribe((p)=>{
        let product = p as string;
        this.fetchSimilarProducts(product).subscribe(sp=>{          
          subscriber.next(sp)
        })
      });
    }) as Observable<string[]>
    return observable;
  }

  fetchProduct(productId: string): Observable<string> {
    let observable = new Observable(subscriber=>{
      console.log('Fetching product with id: ', productId);
      setTimeout(()=>{
        let product = 'product' + productId;
        console.log(product + ' found');
        subscriber.next(product);
      }, 100);
    }) as Observable<string>
    return observable;
  }

  fetchSimilarProducts(product: string) {
    let observable = new Observable(subscriber=>{
      console.log('Fetching similar products for ', product);
      setTimeout(()=>{
        let similarProducts = [];
        for(let i = 0; i < 3; i++){
          similarProducts.push(product + i);
        }
        console.log('similar products found');
        subscriber.next(similarProducts);
      }, 100);
    }) as Observable<string[]>
    return observable;
  }

  deleteProduct(product: string){
    let observable = new Observable(subscriber=>{
      console.log('deleting ' + product);
      setTimeout(()=>{
        console.log(product + ' deleted.');
        subscriber.next(product);
      }, 100);
    }) as Observable<string>
    return observable;
  }

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
        this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe(()=>{ 
          if(task.status == 'finished'){
            console.log(`Updating status of tasks depending on ${task.title}`);
            this.updateDependantTasks(task).subscribe(()=>{
              console.log('upDateDependantTasks finished');              
              observer.next(); 
            });
          }  
          else {            
            observer.next();
          }
        });        
        
      }) 
    })
    return observable;
  }

  private dependencyCheck(task: Task): Observable<boolean> { 
    console.log(`Performing dependencycheck for task:${task.title}`);
    let observable = new Observable<boolean>(observer => {
      this.getDependencyTasks(task._id).subscribe((res)=> {
        console.log('dependency tasks loaded');
        
        let dependencyTasks = res as Array<Task>;
        let open = true;                 
        for(let dTask of dependencyTasks){
          if(open){            
            if(dTask.status!='finished'){
              open = false;        
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
        if(dependencies.length > 0){
          let taskCalls: Observable<Task>[] = [];
          dependencies.forEach((dependency)=>{
            const taskCall = this.getTask(dependency.dependency_id) as Observable<Task>;
            taskCalls.push(taskCall);
          })
          
          forkJoin(taskCalls).subscribe((res)=>{            
            observer.next(res);
          })       
        }
        else{
          observer.next([]);
        }         
      })
    });
    return observable;
  }

  private updateDependantTasks(task: Task) {     
    console.log(`Performing updateDependantTasks for task:${task._id}`);
    //get dependant tasks
    //perform dependency check for each dependant task that has status waiting
    //for each dependant task: if dependency check yields true value for open, update the dependant task status to open    
    let observable = new Observable<boolean>(observer => {
      this.getDependantTasks(task._id).subscribe((res)=> {        
        let dependantTasks = res as Array<Task>;        
        console.log(`${dependantTasks.length} dependant tasks loaded`);
        console.log(dependantTasks);
        if(dependantTasks.length > 0){
          let dependencyUpdates = []
          for(let dTask of dependantTasks){
            if(dTask.status == 'waiting'){
              console.log(`scheduling dependency check and update for ${dTask.title}`);              
              dependencyUpdates.push(this.dependencyCheckAndUpdate(dTask) as Observable<boolean>);
            }
            else{
              console.log(`${dTask.title} already open.`);
            }                        
          }
          console.log(dependencyUpdates);          
          forkJoin(dependencyUpdates).subscribe(()=>{            
            console.log(`All dependency checks and updates are completed.`);            
            observer.complete();
          });          
        } 
        else{
          console.log('No dependant tasks loaded so skipping.');          
          observer.complete();
        }
      })    
    })   
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

  private dependencyCheckAndUpdate(task: Task): Observable<boolean> { 
    console.log(`Performing dependencyCheckAndUpdate for ${task.title}`);
    let observable = new Observable<boolean>(observer => {
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
          this.http.put(this.tasksUrl + `/${task._id}`, task).subscribe(()=>{
            console.log(`dependencyCheckAndUpdate for ${task.title} finished`);
            observer.complete();
          });
        }
        else {
          console.log(`dependencyCheckAndUpdate for ${task.title} finished`);
          observer.complete();
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
