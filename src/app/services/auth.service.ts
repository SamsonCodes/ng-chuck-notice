import { Injectable } from '@angular/core';
import * as moment from "moment";
import { Subject, Observable } from 'rxjs';
import { User } from '../classes/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: Subject<User>;
  public currentUser: Observable<User>; //The currentUser is set as a public observable object so that it can be subscribed to in other components for live updates where needed.

  constructor() {
    this.currentUserSubject = new Subject<User>();
    this.currentUser = this.currentUserSubject.asObservable();
  } 

  setLocalStorage(responseObj: any) {
    const expires = moment().add(1, 'days');
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
    let token = responseObj.token.split(' ')[1];  //Remove Bearer prefix  
    let payload = this.parseJwt(token);
    let user = this.extractUserFromPayload(payload);
    this.currentUserSubject.next(user);
  }          

  logout() {
    console.log('logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.currentUserSubject.next(undefined);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires");
    if (expiration) {
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    } else {
        return moment();
    }
  }    

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  getUser(): User | undefined { //This directly reads the current user data from the payload, so unlike the currentUser variable it's a snapshot, not a datastream
    let token = localStorage.getItem('token');
    if(token){
      let payload = this.parseJwt(token);
      return this.extractUserFromPayload(payload);
    }
    else{
      return undefined;
    }      
  }

  extractUserFromPayload(payload: any) : User {
    return new User(
      payload.sub, 
      payload.name,
      "",
      payload.userGroup,
      payload.penalties
    );
  }

  hasManagerRights(): boolean {    
    let user = this.getUser();
    if(user){
      return (user.userGroup === 'managers' || user.userGroup === 'admins' || user.userGroup === 'master');
      //For now, admins have manager rights too.
    }
    return false;
  }
  
  hasAdminRights(): boolean {
    let user = this.getUser();
    if(user){
      return (user.userGroup === 'admins' || user.userGroup === 'master');
    }
    return false;
  }
}
