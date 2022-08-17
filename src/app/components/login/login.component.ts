import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  defaultFormValues = {
    name: '',
    password: '',
  };
  loginForm = this.formBuilder.group(this.defaultFormValues);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('Working...')
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((res1)=>{
      console.log(res1);
      this.authService.loggedIn().subscribe((res2)=>{
        console.log(res2);
      })
    })
  }

}
