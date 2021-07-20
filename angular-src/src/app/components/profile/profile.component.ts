import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EMPTY, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, concatMap, take, tap } from 'rxjs/operators';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  private readonly userProfileSubject$ = new ReplaySubject<UserProfile>(1);
  userProfile$ = this.userProfileSubject$.asObservable();
  enableEdit = false;
  profileInformation!: string;

  constructor(private authService: AuthService,
              private userService: UserService, 
              private notifier: NotifierService) { }

  ngOnInit(): void {
    this.getProfileData().subscribe();
  }
  
  getProfileData(): Observable<UserProfile> {
    return this.authService.getProfile()
    .pipe(
      tap((user: UserProfile) => this.updateProfile(user)),
      catchError(() => {
        this.notifier.notify('error', 'Could not get profile data');
        return EMPTY;
      })
    );
  }

  editProfile(): void {
    this.changeProfileEditable(true);
  }

  cancelProfile(): void {
    this.userProfile$
    .pipe(
      take(1),
      tap((user) => this.profileInformation = user.profileInformation)
    ).subscribe();
    this.changeProfileEditable(false);
  }

  onProfileSubmit(): void {
    this.userService.editProfile(this.profileInformation)
    .pipe(
      catchError((err) => {
        this.notifier.notify('error', 'Profile could not be updated');
        return EMPTY;
      }),
      concatMap(() => this.getProfileData()),      
      tap(() => { 
        this.notifier.notify('success', 'User profile updated');
        this.changeProfileEditable(false);
      })
    ).subscribe();
  }

  updateProfile(user: UserProfile): void {
    this.profileInformation = user.profileInformation;
    this.userProfileSubject$.next(user);
  }

  changeProfileEditable(bool: boolean): void {
    this.enableEdit = bool;
  }
}
