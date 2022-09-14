import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this.authService.getUser();
    if(user){
      if(user.penalties < this.MAX_PENALTIES){
        return true;
      }
      else{
        this.router.navigate(['kicked']);
      }
    }
    return false;
  }
  
}
