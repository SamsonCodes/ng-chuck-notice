import { Injectable } from '@angular/core';
import * as moment from "moment";
import { Subject, Observable } from 'rxjs';
import { User } from '../classes/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: Subject<User>;
  public currentUser: Observable<User>;

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
    let user = new User(
      payload.sub, 
      payload.name,
      "",
      payload.userGroup,
      payload.penalties
    );
    this.currentUserSubject.next(user);
  }          

  logout() {
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
}
