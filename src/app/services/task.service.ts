import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../classes/task';
import { AssignmentService } from './assignment.service';
import { Assignment } from '../classes/assignment';
import { DependencyService } from './dependency.service';

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
    this.assignmentService.getTaskAssignments(taskId)
      .subscribe((results) => {
        let taskAssignments = results as Array<Assignment>;
        taskAssignments.forEach((assignment)=>{
          this.assignmentService.deleteAssignment(assignment._id).subscribe();
        })
      })
    // Remove all dependencies OF this task
    this.dependencyService.getTaskDependencies(taskId)
      .subscribe((results) => {
        let taskDependencies = results as Array<Assignment>;
        taskDependencies.forEach((dependency)=>{
          this.dependencyService.deleteDependency(dependency._id).subscribe();
        })
      })
    // Remove all dependencies ON this task
    this.dependencyService.getDependenciesOn(taskId)
      .subscribe((results) => {
        let dependenciesOn = results as Array<Assignment>;
        dependenciesOn.forEach((dependency)=>{
          this.dependencyService.deleteDependency(dependency._id).subscribe();
        })
      })
    return this.http.delete(this.tasksUrl + `/${taskId}`);
  }
}
