import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { Task } from '../../task';
import { Assignment } from 'src/app/assignment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  selectedTask = {
  } as Task;

  defaultFormValues = {
    title: '',
    description: '',
    deadline: '',
    status: ''
  }
  taskForm = this.formBuilder.group(this.defaultFormValues);  

  userNames: string[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private taskService: TaskService, 
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTask();
    this.getAssignments();
  }

  getTask(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.taskService.getTask(id!)
      .subscribe(task => {
        this.selectedTask = task as Task;  
    });
  }

  onSubmit(){ 
    this.taskService.putTask(this.selectedTask).subscribe((res) => {
      this.goBack();
    });      
  }

  goBack(): void {
    this.location.back();
  }

  getAssignments(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.taskService.getTaskAssignments(id!).subscribe((res)=>{
      var assignments = res as Array<Assignment>;
      assignments.forEach((assignment)=>{
        var user_id = assignment.user_id;
        this.userService.getUser(user_id).subscribe((userRes)=> {
          var user = userRes as User;
          this.userNames.push(user.name);      
        });
      })
    })
  }
}
