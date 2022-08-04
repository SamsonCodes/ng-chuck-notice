import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Assignment } from '../classes/assignment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  assignmentsUrl = 'http://localhost:3000/api/assignments';

  constructor(private http: HttpClient) { }  

  postAssignment(assignment: Assignment){
    return this.http.post(this.assignmentsUrl, assignment);
  }

  getTaskAssignments(taskId: string){
    return this.http.get(this.assignmentsUrl +`/task/${taskId}`);
  }

  putAssignment(assignment: Assignment){
    return this.http.put(this.assignmentsUrl +`/${assignment._id}`, assignment);
  }

  deleteAssignment(id: string){
    return this.http.delete(this.assignmentsUrl + `/${id}`);
  }
}
