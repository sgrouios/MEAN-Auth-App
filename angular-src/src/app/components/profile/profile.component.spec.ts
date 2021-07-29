import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifierService } from 'angular-notifier';
import { of, Subject, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TestStubs } from 'src/app/testing/stubs/test-stubs';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockNotifier: jasmine.SpyObj<NotifierService>;
  let mockIsLoadingSubject$ = new Subject<boolean>();
  let mockIsLoading$ = mockIsLoadingSubject$.asObservable();

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>(['getProfile']);
    mockUserService = jasmine.createSpyObj<UserService>(['editProfile', 'updateProfileImage']);
    mockNotifier = jasmine.createSpyObj<NotifierService>(['notify']);
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: NotifierService, useValue: mockNotifier }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAuthService.getProfile.and.returnValue(of(TestStubs.userProfile));
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.isLoadingSubject$ = mockIsLoadingSubject$;
    component.isLoading$ = mockIsLoading$;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should get profile data OnInit', () => {
    const getProfileSpy = spyOn(component, 'getProfileData').and.returnValue(of(TestStubs.userProfile));
    component.ngOnInit();
    void expect(getProfileSpy).toHaveBeenCalled();
  });

  it('getProfileData should update user profile on success', () => {
    const updateProfileSpy = spyOn(component, 'updateProfile');
    component.getProfileData().pipe(take(1)).subscribe();
    void expect(updateProfileSpy).toHaveBeenCalledWith(TestStubs.userProfile);
  });

  it('getProfileData should notify user if unsuccessful', () => {
    mockAuthService.getProfile.and.returnValue(throwError('no profile data'));
    mockNotifier.notify.and.returnValue();
    component.getProfileData().pipe(take(1)).subscribe();
    void expect(mockNotifier.notify).toHaveBeenCalledWith('error', 'Could not get profile data');
  });

  it('editProfile should call changeProfileEditable', () => {
    const changeProfileEditSpy = spyOn(component, 'changeProfileEditable');
    component.editProfile();
    void expect(changeProfileEditSpy).toHaveBeenCalledWith(true);
  });

  it('cancelProfile should call changeProfileEditable and reset profile information', () => {
    const changeProfileEditSpy = spyOn(component, 'changeProfileEditable');
    component.cancelProfile();
    void expect(changeProfileEditSpy).toHaveBeenCalledWith(false);
    component.userProfile$.pipe(take(1)).subscribe(user => {
      void expect(user.profileInformation).toEqual(component.profileInformation);
    })
  });

  it('onProfileSubmit should notify user when successful', () => {
    const setLoadingSpy = spyOn(component, 'setLoading');
    const getProfileSpy = spyOn(component, 'getProfileData').and.returnValue(of(TestStubs.userProfile));
    const changeProfileEditSpy = spyOn(component, 'changeProfileEditable');
    mockNotifier.notify.and.returnValue();
    mockUserService.editProfile.and.returnValue(of('successfully edited'));
    component.onProfileSubmit();
    void expect(setLoadingSpy).toHaveBeenCalledWith(true);
    void expect(mockUserService.editProfile).toHaveBeenCalledWith(component.profileInformation);
    void expect(getProfileSpy).toHaveBeenCalled();
    void expect(mockNotifier.notify).toHaveBeenCalledWith('success', 'User profile updated');
    void expect(changeProfileEditSpy).toHaveBeenCalledWith(false);
    void expect(setLoadingSpy).toHaveBeenCalledWith(false);
  });

  it('onProfileSubmit should notify user when unsuccessful', () => {
    const setLoadingSpy = spyOn(component, 'setLoading');
    mockUserService.editProfile.and.returnValue(throwError('error'));
    mockNotifier.notify.and.returnValue();
    component.onProfileSubmit();
    void expect(setLoadingSpy).toHaveBeenCalledWith(true);
    void expect(mockNotifier.notify).toHaveBeenCalledWith('error', 'Profile could not be updated');
    void expect(setLoadingSpy).toHaveBeenCalledWith(false);
  });

  it('updateProfile should change profileInformation', () => {
    const setUserProfileSpy = spyOn(component, 'setUserProfile');
    component.updateProfile(TestStubs.userProfile);
    void expect(component.profileInformation).toEqual(TestStubs.userProfile.profileInformation);
    void expect(setUserProfileSpy).toHaveBeenCalledWith(TestStubs.userProfile);
  });

  it('changeProfileEditable should change enableEdit boolean', () => {
    component.changeProfileEditable(true);
    void expect(component.enableEdit).toBeTrue();
  });

  it('updateProfileImage should notify user if successful', () => {
    mockUserService.updateProfileImage.and.returnValue(of('success'));
    const getProfileSpy = spyOn(component, 'getProfileData').and.returnValue(of(TestStubs.userProfile));
    mockNotifier.notify.and.returnValue();
    component.updateProfileImage('image-url').pipe(take(1)).subscribe();
    void expect(getProfileSpy).toHaveBeenCalled();
    void expect(mockNotifier.notify).toHaveBeenCalledWith('success', 'Updated user profile image');
  });

  it('updateProfileImage should notify user if there is an error', () => {
    const getProfileSpy = spyOn(component, 'getProfileData');
    mockUserService.updateProfileImage.and.returnValue(throwError(new HttpErrorResponse({status: 500})));
    mockNotifier.notify.and.returnValue();
    component.updateProfileImage('image-url').pipe(take(1)).subscribe();
    void expect(mockNotifier.notify).toHaveBeenCalledWith('error', `Could not update user's profile image`);
  });

  it('updateProfileImage should notify user if error 413', () => {
    const getProfileSpy = spyOn(component, 'getProfileData');
    mockUserService.updateProfileImage.and.returnValue(throwError(new HttpErrorResponse({status: 413})));
    mockNotifier.notify.and.returnValue();
    component.updateProfileImage('image-url').pipe(take(1)).subscribe();
    void expect(mockNotifier.notify).toHaveBeenCalledWith('error', `Image size too large`);
  });
});
