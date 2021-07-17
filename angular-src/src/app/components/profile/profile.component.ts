import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { EMPTY, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserProfile } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  private readonly userProfileSubject$ = new Subject<UserProfile>();
  userProfile$ = this.userProfileSubject$.asObservable();

  constructor(private authService: AuthService, private router: Router, private notifier: NotifierService) { }

  ngOnInit(): void {
    this.authService.getProfile()
    .pipe(
      tap((user: UserProfile) => this.userProfileSubject$.next(user)),
      catchError(() => {
        this.notifier.notify('error', 'Could not get profile data');
        return EMPTY;
      })
    ).subscribe();
  }
}
