import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
  message = '';
  loginForm = this.formBuilder.group(this.defaultFormValues);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.message = 'Sending login info...';
    const username = this.loginForm.value.name;
    const password = this.loginForm.value.password;

    const headers = new HttpHeaders({'Content-type': 'application/json'});

    const reqObject = {
      name: username,
      password: password
    };
    
    this.http.post('http://localhost:3000/api/users/login', reqObject, { headers: headers }).subscribe(
      
      // The response data
      (response) => {
        // If the user authenticates successfully, we need to store the JWT returned in localStorage
        this.authService.setLocalStorage(response);
      },

      // If there is an error
      (error) => {
        console.log(error);
        if(error.status==401){
          this.message = "Invalid username/password."
        } else {
          this.message = "Something went wrong on the server."
        }
      },
      
      // When observable completes
      () => {
        console.log('redirecting to /')
        this.router.navigate(['']);
      }

    );
  }

  logger(){
    console.log(this.loginForm);
  }
}
