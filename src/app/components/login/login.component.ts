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
  loginForm = this.formBuilder.group(this.defaultFormValues);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Working...')
  }

  onSubmit(): void {
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
        console.log(response)
        // If the user authenticates successfully, we need to store the JWT returned in localStorage
        this.authService.setLocalStorage(response);

      },

      // If there is an error
      (error) => {
        console.log(error);
      },
      
      // When observable completes
      () => {
        console.log('done!');
        this.router.navigate(['']);
      }

    );
  }

}
