import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  providers: [UserService]
})
export class UserFormComponent {
  users: User[] = [];
  selectedUser?: User;

  userForm = this.formBuilder.group({
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  });
  
  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  onSubmit(){
    console.log(this.userForm.value); 
    this.userService.postUser(this.userForm.value).subscribe((res) => {
      this.refreshUserList();
      this.resetForm();
    });      
  }

  resetForm(){
    this.userForm.setValue({
      _id: '',
      name: '',
      password: '1234',
      userGroup: '',
      penalties: 0
    });
  }

  onEdit(user: User){
    this.selectedUser = user;
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

  logger(){
    console.log(this.userForm.value);    
  }
}
