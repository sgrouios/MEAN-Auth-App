import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import { catchError, concatMap, finalize, take, tap } from 'rxjs/operators';
import { Loading } from 'src/app/base/loading/loading';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends Loading implements OnInit {

  private readonly userProfileSubject$ = new ReplaySubject<UserProfile>(1);
  userProfile$ = this.userProfileSubject$.asObservable();
  enableEdit = false;
  profileInformation!: string;

  constructor(private authService: AuthService,
              private userService: UserService, 
              private notifier: NotifierService) { 
                super();
              }

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
    this.setLoading(true);
    this.userService.editProfile(this.profileInformation)
    .pipe(
      concatMap(() => this.getProfileData()),      
      catchError(() => {
        this.notifier.notify('error', 'Profile could not be updated');
        return EMPTY;
      }),
      tap(() => { 
        this.notifier.notify('success', 'User profile updated');
        this.changeProfileEditable(false);
      }),
      finalize(() => this.setLoading(false))
    ).subscribe();
  }

  updateProfile(user: UserProfile): void {
    this.profileInformation = user.profileInformation;
    this.setUserProfile(user);
  }

  setUserProfile(user: UserProfile) : void {
    this.userProfileSubject$.next(user);
  }

  changeProfileEditable(bool: boolean): void {
    this.enableEdit = bool;
  }

  profileUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0) as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const profileImage = reader.result?.toString() as string;
      this.updateProfileImage(profileImage).subscribe();
    }
  }

  updateProfileImage(image: string): Observable<UserProfile> {
    return this.userService.updateProfileImage(image)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 413){
          this.notifier.notify('error', `Image size too large`);
        }
        else
          this.notifier.notify('error', `Could not update user's profile image`);
        return EMPTY;
      }),
      concatMap(() => this.getProfileData()),
      tap(() => {
        this.notifier.notify('success', 'Updated user profile image');
      })
    )
  }
}
