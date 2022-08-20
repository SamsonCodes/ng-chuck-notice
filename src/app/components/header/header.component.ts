import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any | undefined;

  constructor(
    private authService: AuthService    
  ) { }

  ngOnInit(): void {
    this.authService.currentUser?.subscribe((x)=>{
      this.currentUser=x;
      console.log('Current User:')
      console.log(this.currentUser);
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
