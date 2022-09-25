import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AssignmentService } from '../services/assignment.service';
import { Assignment } from '../classes/assignment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAssignedGuard implements CanActivate {
  constructor(
    private assignmentService: AssignmentService, 
    private authService: AuthService
  ){}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {    
    let id =  route.params.id;
    
    let observable = new Observable<boolean | UrlTree>(subscriber=>{
      this.assignmentService.getTaskAssignments(id).subscribe((assignmentObjects) => {
        let assignments = assignmentObjects as Array<Assignment>;
        let loggedInId = this.authService.getUser()!._id;
        if(this.UserInAssignments(assignments, loggedInId) || this.authService.hasManagerRights()){
          subscriber.next(true);
        } else {
          subscriber.next(false);
        }
        subscriber.complete();
      });
    })
    return observable;
  }
  
  private UserInAssignments(assignments: Array<Assignment>, userId: string): boolean {
    return assignments.filter( x => {return x.user_id == userId} ).length > 0;
  }
}
