import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService,
              private router: Router){}

  canActivate(): Observable<boolean | UrlTree > {
    return this.tokenService.isLoggedIn()
    .pipe(
      map((canRoute) => {
        if(canRoute){
          return true;
        }
        return this.router.parseUrl('');
      })
    );
  }
  
}
