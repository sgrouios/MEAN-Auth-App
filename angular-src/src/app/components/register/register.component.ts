import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Loading } from 'src/app/base/loading/loading';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CheckEmailValidator } from 'src/app/validators/check-email-validator';
import { CheckUsernameValidator } from 'src/app/validators/username-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends Loading {

  form: FormGroup = this.initForm();

  constructor(private userService: UserService,
              private notifier: NotifierService,
              private authService: AuthService,
              private router: Router) {
                super();
              }

  initForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', 
      Validators.required, 
      CheckUsernameValidator.checkUsername(this.userService)),
      email: new FormControl('', [
        Validators.required, 
        Validators.email],
        CheckEmailValidator.checkEmail(this.userService)),
      password: new FormControl('', Validators.required)
    });
  }

  onRegisterSubmit() : void {
    if(this.form.valid){
      this.isLoadingSubject$.next(true);
      const user = <User>this.form.value;
      this.authService.registerUser(user)
      .pipe(
        catchError(() => {
          this.notifier.notify('error', 'User could not be registered');
          return EMPTY;
        }),
        tap(() => { 
          this.notifier.notify('success', 'User successfully registered');
          this.router.navigate(['login']);
        }),
        finalize(() => this.isLoadingSubject$.next(false))
      ).subscribe();
    }
  }

}
