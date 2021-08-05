import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockTokenService = jasmine.createSpyObj<TokenService>(['isLoggedIn']);
    mockRouter = jasmine.createSpyObj<Router>(['parseUrl']);
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });

  it('canActivate should return true if user is loggedIn', () => {
    mockTokenService.isLoggedIn.and.returnValue(of(true));
    guard.canActivate().pipe(take(1)).subscribe(x => void expect(x).toBeTrue());
  });

  it('canActivate should return UrlTree if user is not logged in', () => {
    mockTokenService.isLoggedIn.and.returnValue(of(false));
    guard.canActivate().pipe(take(1)).subscribe();
    void expect(mockRouter.parseUrl).toHaveBeenCalledWith('');
  });
});
