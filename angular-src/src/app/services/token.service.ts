import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccessToken } from '../models/access-token';
import { Jwt } from '../models/jwt';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private isLoggedInSubject$ = new BehaviorSubject(false);
  isLoggedIn$ = this.isLoggedInSubject$.asObservable();

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private authService: AuthService) { }

  rehydrateMemberLogin(): Observable<boolean> {
    return this.isLoggedIn();
  }
  
  setLoginState(loggedIn: boolean): void {
    this.isLoggedInSubject$.next(loggedIn);
  }

  isLoggedIn(): Observable<boolean> {
    return this.getAccessToken(true)
    .pipe(
      map(() => true),
      catchError(() => { 
        return of(false) 
      })
    )
  }

  getAuthHeader(): Observable<string> {
    return this.getAccessToken()
    .pipe(
      catchError((err) => throwError(err)),
      map((token: string) => `Bearer ${token}`)
    )
  }

  getAccessToken(isSoft: boolean = false): Observable<string> {
    const token = this.localStorageService.getAccessToken();
    if(!token){
      return this.errorHandler(new Error('No access token'), isSoft);
    }
    if(this.isTokenExpired(token)){
      return this.getRefreshToken();
    }
    return of(token);
  }

  getRefreshToken(isSoft: boolean = false): Observable<string> {
    const refreshToken = this.localStorageService.getRefreshToken();
    if(!refreshToken){
      return this.errorHandler(new Error('No refresh token'), isSoft);
    }
    if(this.isTokenExpired(refreshToken)){
      return this.errorHandler(new Error('Refresh token expired'), isSoft);
    }

    return this.authService.refreshToken(refreshToken)
    .pipe(
      map((token: AccessToken) => token.token),
      catchError(() => this.errorHandler(new Error('Token could not be refreshed'), isSoft))
    )

  }

  errorHandler(err: Error, isSoft: boolean = false): Observable<string> {
    this.localStorageService.removeTokens();
    this.localStorageService.removeUserData();
    if(!isSoft){
      this.router.navigate(['login']);
    }
    return throwError(err);
  }

  isTokenExpired(token: string): boolean {
    let payload: Jwt;
    try{
      payload = (JSON.parse(atob(token.split('.')[1]))) as Jwt;
    }
    catch{
      return false;
    }
    if(payload.exp < new Date().getTime() / 1000){
      return true;
    } else
      return false;
  }
}
