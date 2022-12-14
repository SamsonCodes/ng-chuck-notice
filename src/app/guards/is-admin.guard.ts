import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ){}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this.authService.getUser();
    if(user){
      if(user.userGroup == 'admins' || user.userGroup == 'master'){
        return true;
      }
    }
    return false;
  }
  
}
