import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(
    private authService: AuthService    
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }

  onRefresh(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }
}
