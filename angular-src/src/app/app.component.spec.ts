import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { TokenService } from './services/token.service';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockTokenService: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    mockTokenService = jasmine.createSpyObj<TokenService>(['rehydrateMemberLogin', 'setLoginState']);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: TokenService, useValue: mockTokenService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockTokenService.rehydrateMemberLogin.and.returnValue(of(true));
    mockTokenService.setLoginState.and.returnValue();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    void expect(app).toBeTruthy();
  });

  it('OnInit should call setLoginState with true if user logged in', () => {
    void expect(mockTokenService.rehydrateMemberLogin).toHaveBeenCalledTimes(1);
    void expect(mockTokenService.setLoginState).toHaveBeenCalledWith(true);
  });

  it('OnInit should call setLoginState with false if user logged in', () => {
    mockTokenService.rehydrateMemberLogin.and.returnValue(of(false));
    component.ngOnInit();
    void expect(mockTokenService.rehydrateMemberLogin).toHaveBeenCalledTimes(2);
    void expect(mockTokenService.setLoginState).toHaveBeenCalledWith(false);
  });

});
