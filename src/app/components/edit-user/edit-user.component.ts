import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService]
})
export class EditUserComponent implements OnInit {
  selectedUser = {} as User;

  defaultFormValues = {
    name: '',
    userGroup: '',
    penalties: 0
  }
  userForm = this.formBuilder.group(this.defaultFormValues);  
  
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
    });
  }

  onSubmit(){ 
    this.userService.putUser(this.selectedUser).subscribe((res) => {
      this.goBack();
    });      
  }

  goBack(): void {
    this.location.back();
  }
}
