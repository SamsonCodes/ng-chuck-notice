import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Assignment } from '../assignment';

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

  deleteAssignment(id: string){
    return this.http.delete(this.assignmentsUrl + `/${id}`);
  }
}
