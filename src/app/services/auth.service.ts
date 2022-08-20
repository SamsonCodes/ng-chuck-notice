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
    console.log(responseObj.expiresIn);

    const expires = moment().add(1, 'days');
    console.log(`expires: ${JSON.stringify(expires.valueOf())}`);
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
    let user = new User(
      responseObj.user._id, 
      responseObj.user.name,
      "",
      responseObj.user.userGroup,
      0
    );
    this.currentUserSubject.next(user);
  }          

  logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('expires');
      this.currentUserSubject.next(undefined);
  }

  isLoggedIn() {
    console.log(moment());
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
}
