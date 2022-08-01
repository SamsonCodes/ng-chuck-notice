import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../user';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  defaultValues = {
    _id: '',
    name: '',
    userGroup: '',
  };

  userForm = this.formBuilder.group(this.defaultValues);

  user = {
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  } as User;
  
  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  onSubmit(){
      this.userService.postUser(this.user).subscribe((res) => {
      this.refreshUserList();
      this.resetForm();
    });      
  }

  resetForm(){
    this.userForm.setValue({
      _id: '',
      name: '',
      userGroup: ''
    });
  }

  onDelete(userId: string){
    this.userService.deleteUser(userId).subscribe((res) => {
      this.refreshUserList();
    });
  }

  refreshUserList(){
    this.userService.getUsers().subscribe((res) => {
      this.users = res as User[];
    });
  }
}
