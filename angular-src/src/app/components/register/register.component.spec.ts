import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/services/validator.service';

import { RegisterComponent } from './register.component';

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockNotifierService: jasmine.SpyObj<NotifierService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockValidatorService: jasmine.SpyObj<ValidatorService>;

  beforeEach(async () => {
    mockNotifierService = jasmine.createSpyObj<NotifierService>(['notify']);
    mockAuthService = jasmine.createSpyObj<AuthService>(['registerUser']);
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockValidatorService = jasmine.createSpyObj<ValidatorService>(['checkEmail', 'checkUsername']);
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      providers: [
        { provide: NotifierService, useValue: mockNotifierService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ValidatorService, useValue: mockValidatorService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('should initialise form with controls', () => {
    const formControls = ['name', 'username', 'email', 'password'];
    const controls: string[] = [];
    Object.keys(component.form.controls).forEach(key => {
      controls.push(key);
    })
    void expect(formControls).toEqual(controls);
  });

  it('onRegisterSubmit should notify user when successful', () => {
    mockValidatorService.checkEmail.and.returnValue(() => { return of(null)});
    mockValidatorService.checkUsername.and.returnValue(() => { return of(null)});
    const loadingSpy = spyOn(component, 'setLoading');
    mockAuthService.registerUser.and.returnValue(of('successful'));
    mockNotifierService.notify.and.returnValue();
    component.form.setValue({ 
      name: 'Name', 
      username: 'Username', 
      email: 'email@email.com', 
      password: 'password'
    });

    component.onRegisterSubmit();
    void expect(component.form.valid).toBeTrue();
    void expect(loadingSpy).toHaveBeenCalledWith(true);
    void expect(mockAuthService.registerUser).toHaveBeenCalledWith(<User>component.form.value);
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('success', 'User successfully registered');
    void expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    void expect(loadingSpy).toHaveBeenCalledWith(false);
  });

  it('onRegisterSubmit should notify user when there is an error', () => {
    mockValidatorService.checkEmail.and.returnValue(() => { return of(null)});
    mockValidatorService.checkUsername.and.returnValue(() => { return of(null)});
    const loadingSpy = spyOn(component, 'setLoading');
    mockAuthService.registerUser.and.returnValue(throwError('error'));
    mockNotifierService.notify.and.returnValue();
    component.form.setValue({ 
      name: 'Name', 
      username: 'Username', 
      email: 'email@email.com', 
      password: 'password'
    });

    component.onRegisterSubmit();
    void expect(component.form.valid).toBeTrue();
    void expect(loadingSpy).toHaveBeenCalledWith(true);
    void expect(mockAuthService.registerUser).toHaveBeenCalledWith(<User>component.form.value);
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('error', 'User could not be registered');
    void expect(loadingSpy).toHaveBeenCalledWith(false);
  });

  it('onRegisterSubmit should not call registerUser if form is invalid', () => {
    mockAuthService.registerUser.and.returnValue(of('successful'));
    component.onRegisterSubmit();
    void expect(mockAuthService.registerUser).not.toHaveBeenCalled();
  });

});
