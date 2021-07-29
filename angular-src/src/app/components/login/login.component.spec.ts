import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { TestStubs } from 'src/app/testing/stubs/test-stubs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotifierService: jasmine.SpyObj<NotifierService>;
  let mockTokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>(['authenticateUser']);
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockNotifierService = jasmine.createSpyObj<NotifierService>(['notify']);
    mockTokenService = jasmine.createSpyObj<TokenService>(['setLoginState']);
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NotifierService, useValue: mockNotifierService },
        { provide: TokenService, useValue: mockTokenService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should set form when component initialised', () => {
    const controls = ['username', 'password'];
    const componentFormControls: string[] = [];
    Object.keys(component.form.controls).forEach(key => {
      componentFormControls.push(key);
    })
    void expect(componentFormControls).toEqual(controls); 
  });

  it('onLoginSubmit should notify user when login successful', () => {
    const setLoadingSpy = spyOn(component, 'setLoading');
    component.form.setValue({ username: 'User', password: 'Password'});
    mockAuthService.authenticateUser.and.returnValue(of(TestStubs.tokens));
    mockNotifierService.notify.and.returnValue();
    mockTokenService.setLoginState.and.returnValue();
    component.onLoginSubmit();
    void expect(setLoadingSpy).toHaveBeenCalledWith(true);
    void expect(mockAuthService.authenticateUser).toHaveBeenCalledWith(component.form.value);
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('success', 'User successfully authenticated');
    void expect(mockTokenService.setLoginState).toHaveBeenCalledWith(true);
    void expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
    void expect(setLoadingSpy).toHaveBeenCalledWith(false);
  });

  it('onLoginSubmit should do nothing if form is invalid', () => {
    component.onLoginSubmit();
    void expect(mockAuthService.authenticateUser).not.toHaveBeenCalled();
  });

  it('onLoginSubmit should notify user if there is an error loggin in', () => {
    const setLoadingSpy = spyOn(component, 'setLoading');
    component.form.setValue({ username: 'User', password: 'Password'});
    mockAuthService.authenticateUser.and.returnValue(throwError('unauthenticated'));
    mockNotifierService.notify.and.returnValue();
    component.onLoginSubmit();
    void expect(setLoadingSpy).toHaveBeenCalledWith(true);
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('error', 'User could not be authenticated');
    void expect(setLoadingSpy).toHaveBeenCalledWith(false);
  });
});
