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

  userForm = this.formBuilder.group({
    _id: '',
    name: '',
    password: '',
    userGroup: '',
    penalties: 0
  });
  
  constructor(private userService: UserService, private formBuilder: FormBuilder) { 
    
  }

  ngOnInit(): void {
    this.refreshUserList();
  }

  onSubmit(){
    console.log(this.userForm.value); 
    this.userService.postUser(this.userForm.value).subscribe((res) => {
      this.userForm.reset(); 
      this.refreshUserList();
    });
      
  }

  refreshUserList(){
    this.userService.getUsers().subscribe((res) => {
      this.users = res as User[];
    })
  }
}
