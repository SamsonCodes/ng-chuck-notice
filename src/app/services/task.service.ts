import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksUrl = 'http://localhost:3000/api/tasks';

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
}
