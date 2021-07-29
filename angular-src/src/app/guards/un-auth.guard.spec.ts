import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

import { UnAuthGuard } from './un-auth.guard';

describe('UnAuthGuard', () => {
  let guard: UnAuthGuard;
  let mockTokenService: jasmine.SpyObj<TokenService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockTokenService = jasmine.createSpyObj<TokenService>(['isLoggedIn']);
    mockRouter = jasmine.createSpyObj<Router>(['parseUrl'])
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(UnAuthGuard);
  });

  it('should be created', () => {
    void expect(guard).toBeTruthy();
  });
});
