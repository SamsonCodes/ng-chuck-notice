import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  newUser = {
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  } as User;

  defaultFormValues = {
    name: '',
    userGroup: '',
    password: '1234'
  };
  userForm = this.formBuilder.group(this.defaultFormValues);  
  
  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  onSubmit(){    
    this.userService.postUser(this.newUser).subscribe((res) => {
      this.refreshUserList();
      this.resetForm();
    });      
  }

  onDelete(userId: string){
    this.userService.deleteUser(userId).subscribe(() => {
      this.refreshUserList();
    });
  }

  refreshUserList(){
    this.userService.getUsers().subscribe((res) => {
      this.users = res as User[];
    });
  }

  resetForm(){
    this.userForm.setValue(this.defaultFormValues);
    this.userForm.reset(this.userForm.value);
  }
}
