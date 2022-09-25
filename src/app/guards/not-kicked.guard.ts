import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotKickedGuard implements CanActivate {
  MAX_PENALTIES = 3;
  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this.authService.getUser();
    if(user){
      if(user.userGroup == 'master'){
        return true;
      }
      else if(user.penalties < this.MAX_PENALTIES){
        return true;
      }
      else{
        this.router.navigate(['kicked']);
      }
    }
    return false;
  }
  
}
