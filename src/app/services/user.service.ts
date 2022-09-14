import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';

import { User } from '../classes/user';
import { AssignmentService } from './assignment.service';
import { Assignment } from '../classes/assignment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private assignmentService: AssignmentService
    ) { }

  postUser(user: User){
    return this.http.post(this.usersUrl, user);
  }

  getUsers(){
    return this.http.get(this.usersUrl);
  }

  getUser(userId: string){
    return this.http.get(this.usersUrl + `/${userId}`);
  }

  putUser(user: User){
    return this.http.put(this.usersUrl + `/${user._id}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    let observable = new Observable<void>(subscriber=>{
      this.deleteAssignments(userId).subscribe(()=>{
        this.http.delete(this.usersUrl + `/${userId}`).subscribe((response)=>{
          console.log(response);
          subscriber.next();
        });
      })
    })
    return observable;
  }

  private deleteAssignments(userId: string): Observable<void>{
    let observable = new Observable<void>(subscriber=>{
      this.assignmentService.getUserAssignments(userId)
      .subscribe((results) => {
        let userAssignments = results as Array<Assignment>;
        let deleteCalls: Observable<Object>[] = [];
        userAssignments.forEach((assignment)=>{
          deleteCalls.push(this.assignmentService.deleteAssignment(assignment._id));
        })
        if(deleteCalls.length > 0){
          combineLatest(deleteCalls).subscribe(()=>{               
            subscriber.next();
          })
        }
        else{
          subscriber.next();
        }        
      })
    })
    return observable;
  }
}
