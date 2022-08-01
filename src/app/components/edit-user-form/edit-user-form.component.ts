import { Component, OnChanges, Input, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { UserService } from '../../user.service';
import { User } from '../../user';

@Component({
  selector: 'edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css'],
  providers: [UserService]
})
export class EditUserFormComponent implements OnInit {
  @Input() selectedUser = {
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  } as User;

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
    this.resetForm();
  }

  onSubmit(){
    console.log(this.userForm.value); 
    this.userService.putUser(this.userForm.value).subscribe((res) => {
      this.selectedUser=this.userForm.value as User;
      this.resetForm();
    });      
  }

  resetForm(){
    this.userForm.setValue({
      _id: this.selectedUser._id,
      name: this.selectedUser.name,
      password: this.selectedUser.password,
      userGroup: this.selectedUser.userGroup,
      penalties: this.selectedUser.penalties
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetForm();
  }

  logger(){
    console.log(this.userForm.value);    
  }
}
