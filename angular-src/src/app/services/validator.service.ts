import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DoesExist } from '../models/does-exist';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private userService: UserService) { }

  checkEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.userService.checkEmail(control.value).pipe(
        map((result: DoesExist) => (!result.doesExist ? {} : { taken: true })),
        catchError(() => {
          console.error('Check email call error');
          return EMPTY;
        })
      );
    };
  }

  checkUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.userService.checkUsername(control.value).pipe(
        map((result: DoesExist) => (!result.doesExist ? {} : { taken: true })),
        catchError(() => {
          console.error('Check username call error');
          return EMPTY;
        })
      );
    };
  }
}
