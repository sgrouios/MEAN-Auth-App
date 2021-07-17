import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DoesExist } from '../models/does-exist';
import { ExclusionHeader } from '../utils/exclusion-header';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Observable<DoesExist> {
    return this.http.get<DoesExist>(`users/check-username?username=${username}`,
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err))
    );
  }

  checkEmail(email: string): Observable<DoesExist> {
    return this.http.get<DoesExist>(`users/check-email?email=${email}`,
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err))
    );
  }
}
