import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  login(loginData: Object){
    return this.http.post(this.baseUrl+'api/users/login', loginData);
  }

  loggedIn(){
    return this.http.get(this.baseUrl+'api/loggedin');
  }
}
