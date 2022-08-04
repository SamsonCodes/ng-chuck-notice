import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Dependency } from '../classes/dependency';

@Injectable({
  providedIn: 'root'
})
export class DependencyService {
  dependenciesUrl = 'http://localhost:3000/api/dependencies';

  constructor(private http: HttpClient) { }

  postDependency(dependency: Dependency){
    return this.http.post(this.dependenciesUrl, dependency);
  }

  getTaskDependencies(taskId: string){
    return this.http.get(this.dependenciesUrl +`/task/${taskId}`);
  }

  putDependency(dependency: Dependency){
    return this.http.put(this.dependenciesUrl +`/${dependency._id}`, dependency);
  }

  deleteDependency(id: string){
    return this.http.delete(this.dependenciesUrl + `/${id}`);
  }
}
