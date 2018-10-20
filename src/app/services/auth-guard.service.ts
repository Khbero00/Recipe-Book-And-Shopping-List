import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) { }

 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
    .map(autheticated => {
      if (autheticated) {
        return true;
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  
}
