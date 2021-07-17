import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccessToken } from '../models/access-token';
import { AuthenticateUser } from '../models/authenticate-user';
import { Tokens } from '../models/tokens';
import { User } from '../models/user';
import { UserProfile } from '../models/user-profile';
import { ExclusionHeader } from '../utils/exclusion-header';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {}

  authenticateUser(authenticate: AuthenticateUser): Observable<Tokens> {
    return this.http.post<Tokens>(`users/authenticate`, 
    authenticate, 
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err)),
      tap((tokens: Tokens) => { 
        this.localStorageService.setAccessToken(tokens.accessToken);
        this.localStorageService.setRefreshToken(tokens.refreshToken);
        this.localStorageService.setUserData(tokens.user);
      })
      )
  }

  logout(refreshToken: string): Observable<string> {
    return this.http.get<string>(`users/logout?refreshToken-${refreshToken}`)
    .pipe(
      catchError((err) => throwError(err)),
      tap(() => {
        this.localStorageService.removeTokens();
        this.localStorageService.removeUserData();
      })
    )
  }

  refreshToken(refreshToken: string): Observable<AccessToken> {
    return this.http.post<AccessToken>(`users/refresh`, { token: refreshToken})
    .pipe(
      catchError((err) => throwError(err)),
      tap((token: AccessToken) => {
        this.localStorageService.setAccessToken(token.token);
        this.localStorageService.setUserData(token.user);
      })
    )
  }

  registerUser(user: User): Observable<string> {
    return this.http
      .post<string>(
        `users/register`,
        user,
        ExclusionHeader.addExclusionHeader()
      )
      .pipe(catchError((err) => throwError(err)));
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`users/profile`)
    .pipe(
      catchError((err) => throwError(err))
    )
  }
}
