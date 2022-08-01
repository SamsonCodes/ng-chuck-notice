import { Component, Input, OnInit } from '@angular/core';
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
  defaultValues = {
    _id: '',
    name: '',
    userGroup: '',
    penalties: 0
  }

  userForm = this.formBuilder.group(this.defaultValues);

  user = {
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  } as User;
  
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
        this.user = user as User;  
    });
  }

  onSubmit(){ 
    this.userService.putUser(this.user).subscribe((res) => {
      this.goBack();
    });      
  }

  goBack(): void {
    this.location.back();
  }
}
