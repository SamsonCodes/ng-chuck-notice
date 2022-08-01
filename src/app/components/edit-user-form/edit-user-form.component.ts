import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../user.service';
import { User } from '../../user';

@Component({
  selector: 'edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css'],
  providers: [UserService]
})
export class EditUserFormComponent implements OnInit {
  @Input() selectedUser?: User;

  userForm = this.formBuilder.group({
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  });
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id!)
      .subscribe(user => {
        this.selectedUser = user as User;        
        this.resetForm();
      });
  }

  onSubmit(){
    this.userService.putUser(this.userForm.value).subscribe((res) => {
      this.goBack();
    });      
  }

  resetForm(){
    if(this.selectedUser){
      this.userForm.setValue({
        _id: this.selectedUser._id,
        name: this.selectedUser.name,
        password: this.selectedUser.password,
        userGroup: this.selectedUser.userGroup,
        penalties: this.selectedUser.penalties
      })
    }
    console.log('resetForm() selectedUser not defined');
        
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetForm();
  }

  goBack(): void {
    this.location.back();
  }
}
