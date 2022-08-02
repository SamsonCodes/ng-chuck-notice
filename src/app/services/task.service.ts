import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../task';
import { Assignment } from '../assignment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksUrl = 'http://localhost:3000/api/tasks';
  assignmentsUrl = 'http://localhost:3000/api/assignments';

  constructor(private http: HttpClient) { }

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
    return this.http.delete(this.tasksUrl + `/${taskId}`);
  }

  postAssignment(assignment: Assignment){
    return this.http.post(this.assignmentsUrl, assignment);
  }

  getTaskAssignments(taskId: string){
    return this.http.get(this.assignmentsUrl +`/task/${taskId}`);
  }

  deleteAssignment(id: string){
    return this.http.delete(this.assignmentsUrl + `/${id}`);
  }
}
