import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  postUser(user: User){
    return this.http.post(this.usersUrl, user);
  }

  getUsers(){
    return this.http.get(this.usersUrl);
  }

  putUser(user: User){
    return this.http.put(this.usersUrl + `/${user._id}`, user);
  }

  deleteUser(userId: string){
    return this.http.delete(this.usersUrl + `/${userId}`);
  }
}
