import { Injectable } from '@angular/core';
import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setLocalStorage(responseObj: any) {
    console.log(responseObj.expiresIn);

    const expires = moment().add(1, 'days');
    console.log(`expires: ${JSON.stringify(expires.valueOf())}`);
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
  }          

  logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('expires');
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
