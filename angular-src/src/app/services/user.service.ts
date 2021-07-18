import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DoesExist } from '../models/does-exist';
import { ExclusionHeader } from '../utils/exclusion-header';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Observable<DoesExist> {
    return this.http.get<DoesExist>(`${this.apiUrl}/check-username?username=${username}`,
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err))
    );
  }

  checkEmail(email: string): Observable<DoesExist> {
    return this.http.get<DoesExist>(`${this.apiUrl}/check-email?email=${email}`,
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err))
    );
  }
}
