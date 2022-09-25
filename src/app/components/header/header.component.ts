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
    this.currentUser = this.authService.getUser(); //This loads the currentUser whenever the app is first opened or refreshed
    this.authService.currentUser.subscribe((x)=>{
      this.currentUser = x; // This listens to UPDATES for the currentUser so the header is updated as soon as it changes (for example when logging in) 
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.hasAdminRights();
  }
}
