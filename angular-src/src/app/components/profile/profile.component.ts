import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EMPTY, ReplaySubject, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  private readonly userProfileSubject$ = new ReplaySubject<UserProfile>(1);
  userProfile$ = this.userProfileSubject$.asObservable();
  form: FormGroup = new FormGroup({profileInformation: new FormControl({ value: '', disabled: true}, Validators.required)});

  constructor(private authService: AuthService, private notifier: NotifierService) { }

  ngOnInit(): void {
    this.authService.getProfile()
    .pipe(
      tap((user: UserProfile) => this.updateProfile(user)),
      catchError(() => {
        this.notifier.notify('error', 'Could not get profile data');
        return EMPTY;
      })
    ).subscribe();
  }
  
  editProfile(): void {
      this.form.controls.profileInformation.enable();
  }

  cancelProfile(): void {
    // get last user value from ReplaySubject
    this.userProfile$.pipe(
      take(1),
      tap((user) => { 
        // assign retrieved value back to formcontrol
        this.form.controls.profileInformation.setValue(user.profileInformation); 
      })
    ).subscribe();
    this.form.controls.profileInformation.disable();
  }

  onProfileSubmit(): void {
    console.log(this.form.value);
  }

  updateProfile(user: UserProfile): void {
    this.userProfileSubject$.next(user);
    this.form.controls.profileInformation.setValue(user.profileInformation);
  }
}
