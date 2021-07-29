import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TokenService } from 'src/app/services/token.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNotifierService: jasmine.SpyObj<NotifierService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>(['logout']);
    mockNotifierService = jasmine.createSpyObj<NotifierService>(['notify']);
    mockLocalStorageService = jasmine.createSpyObj<LocalStorageService>(['getRefreshToken']);
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockTokenService = jasmine.createSpyObj<TokenService>(['setLoginState']);
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [ 
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotifierService, useValue: mockNotifierService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: TokenService, useValue: mockTokenService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });

  it('onLogoutClick should notify user when logout successful', () => {
    mockLocalStorageService.getRefreshToken.and.returnValue('refresh-token');
    mockAuthService.logout.and.returnValue(of('successfully logged out'))
    mockNotifierService.notify.and.returnValue();
    mockTokenService.setLoginState.and.returnValue();
    component.onLogoutClick();
    void expect(mockAuthService.logout).toHaveBeenCalledWith('refresh-token');
    void expect(mockTokenService.setLoginState).toHaveBeenCalledWith(false);
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('success', 'User successfully logged out');
    void expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('onLogoutClick should notify user when logout unsuccessful', () => {
    mockLocalStorageService.getRefreshToken.and.returnValue('refresh-token');
    mockAuthService.logout.and.returnValue(throwError('logout unsuccessful'));
    mockNotifierService.notify.and.returnValue();
    component.onLogoutClick();
    void expect(mockAuthService.logout).toHaveBeenCalledWith('refresh-token');
    void expect(mockNotifierService.notify).toHaveBeenCalledWith('error', 'User could not be logged out');  });
});
