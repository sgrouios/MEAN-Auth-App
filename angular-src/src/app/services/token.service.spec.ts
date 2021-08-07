import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { TokenUser } from '../models/tokens';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      ['getAccessToken', 'getRefreshToken', 'removeTokens', 'removeUserData']);
    mockAuthService = jasmine.createSpyObj<AuthService>(['refreshToken']);
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('rehydrateMemberLogin should return result of isLoggedIn', () => {
    const isLoggedInSpy = spyOn(service, 'isLoggedIn').and.returnValue(of(true));
    service.rehydrateMemberLogin().subscribe(x => void expect(x).toBeTrue());
    void expect(isLoggedInSpy).toHaveBeenCalledTimes(1);
  });

  it('setLoginState should emit boolean to logged in subject', () => {
    service.isLoggedIn$.pipe(take(1))
    .subscribe(x => void expect(x).toBeFalse());
    service.setLoginState(true);
    service.isLoggedIn$.pipe(take(1))
    .subscribe(x => void expect(x).toBeTrue());
  });

  it('isLoggedIn should return true if a token found', () => {
    const getAccessTokenSpy = spyOn(service, 'getAccessToken').and.returnValue(of('token'));
    service.isLoggedIn().pipe(take(1))
    .subscribe(x => void expect(x).toBeTrue());
    void expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });

  it('isLoggedIn should return false error thrown', () => {
    const getAccessTokenSpy = spyOn(service, 'getAccessToken').and.returnValue(throwError('no token'));
    service.isLoggedIn().pipe(take(1))
    .subscribe(x => void expect(x).toBeFalse());
    void expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });

  it('getAuthHeader should return Bearer header', () => {
    const getAccessTokenSpy = spyOn(service, 'getAccessToken').and.returnValue(of('access-token'));
    service.getAuthHeader().pipe(take(1))
    .subscribe(token => void expect(token).toEqual(`Bearer access-token`));
  });

  it('getAuthHeader should throw error', () => {
    const getAccessTokenSpy = spyOn(service, 'getAccessToken').and.returnValue(throwError('error'));
    service.getAuthHeader().pipe(take(1))
    .subscribe(() => { return },
    (err) => void expect(err).toEqual('error'));
  });

  it('getAccessToken should return token - not expired', () => {
    const token = 'access-token';
    mockLocalStorageService.getAccessToken.and.returnValue(token);
    const isTokenExpSpy = spyOn(service, 'isTokenExpired').and.returnValue(false);
    service.getAccessToken().pipe(take(1))
    .subscribe(token => void expect(token).toEqual(token));
    void expect(mockLocalStorageService.getAccessToken).toHaveBeenCalledTimes(1);
    void expect(isTokenExpSpy).toHaveBeenCalledOnceWith(token);
  });

  it('getAccessToken should return token - expired', () => {
    const token = 'access-token';
    const newToken = 'new-access-token';
    mockLocalStorageService.getAccessToken.and.returnValue(token);
    const isTokenExpSpy = spyOn(service, 'isTokenExpired').and.returnValue(true);
    const getRefreshSpy = spyOn(service, 'getRefreshToken').and.returnValue(of(newToken));
    service.getAccessToken().pipe(take(1))
    .subscribe(token => void expect(token).toEqual(newToken));
    void expect(mockLocalStorageService.getAccessToken).toHaveBeenCalledTimes(1);
    void expect(isTokenExpSpy).toHaveBeenCalledOnceWith(token);
    void expect(getRefreshSpy).toHaveBeenCalledTimes(1);
  });

  it('getAccessToken should call errorHandler if no token found - isSoft = false', () => {
    mockLocalStorageService.getAccessToken.and.returnValue('');
    const errorSpy = spyOn(service, 'errorHandler').and.returnValue(throwError('error handler'));
    service.getAccessToken().pipe(take(1))
    .subscribe(() => { return },
    (err) => void expect(err).toEqual('error handler'));
    void expect(mockLocalStorageService.getAccessToken).toHaveBeenCalledTimes(1);
    void expect(errorSpy).toHaveBeenCalledWith(new Error('No access token'), false);
  });

  it('getAccessToken should call errorHandler if no token found - isSoft = true', () => {
    mockLocalStorageService.getAccessToken.and.returnValue('');
    const errorSpy = spyOn(service, 'errorHandler').and.returnValue(throwError('error handler'));
    service.getAccessToken(true).pipe(take(1))
    .subscribe(() => { return },
    (err) => void expect(err).toEqual('error handler'));
    void expect(mockLocalStorageService.getAccessToken).toHaveBeenCalledTimes(1);
    void expect(errorSpy).toHaveBeenCalledWith(new Error('No access token'), true);
  });

  it('getRefreshToken should return new access token', () => {
    const refreshToken = 'refresh-token';
    const accessToken = 'access-token';
    const user: TokenUser = { id: 'id', name: 'name', username: 'username', email: 'email'};
    mockLocalStorageService.getRefreshToken.and.returnValue(refreshToken);
    const isTokenExpSpy = spyOn(service, 'isTokenExpired').and.returnValue(false);
    mockAuthService.refreshToken.and.returnValue(of({ token: accessToken, user: user}));
    service.getRefreshToken().pipe(take(1))
    .subscribe(x => void expect(x).toEqual(accessToken));
    void expect(mockLocalStorageService.getRefreshToken).toHaveBeenCalledTimes(1);
    void expect(isTokenExpSpy).toHaveBeenCalledWith(refreshToken);
    void expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
  });

  it('getRefreshToken should call error handler if error refreshing token', () => {
    const refreshToken = 'refresh-token';
    mockLocalStorageService.getRefreshToken.and.returnValue(refreshToken);
    const isTokenExpSpy = spyOn(service, 'isTokenExpired').and.returnValue(false);
    const errorHandlerSpy = spyOn(service, 'errorHandler').and.callThrough();
    mockAuthService.refreshToken.and.returnValue(throwError('refresh token error'));
    service.getRefreshToken().pipe(take(1))
    .subscribe(() => { return },
    (err: Error) => void expect(err.message).toEqual('Token could not be refreshed'));
    void expect(mockLocalStorageService.getRefreshToken).toHaveBeenCalledTimes(1);
    void expect(isTokenExpSpy).toHaveBeenCalledWith(refreshToken);
    void expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
    void expect(errorHandlerSpy).toHaveBeenCalledWith(new Error('Token could not be refreshed'), false);
  });

  it('getRefreshToken should call error handler if no refresh token found', () => {
    mockLocalStorageService.getRefreshToken.and.returnValue('');
    const errorHandlerSpy = spyOn(service, 'errorHandler').and.callThrough();
    service.getRefreshToken().pipe(take(1))
    .subscribe(() => { return },
    (err: Error) => void expect(err.message).toEqual('No refresh token'));
    void expect(mockLocalStorageService.getRefreshToken).toHaveBeenCalledTimes(1);
    void expect(errorHandlerSpy).toHaveBeenCalledWith(new Error('No refresh token'), false);
  });

  it('getRefreshToken should call error handler if refresh token expired', () => {
    const refreshToken = 'refresh-token';
    mockLocalStorageService.getRefreshToken.and.returnValue(refreshToken);
    const isTokenExpSpy = spyOn(service, 'isTokenExpired').and.returnValue(true);
    const errorHandlerSpy = spyOn(service, 'errorHandler').and.callThrough();
    service.getRefreshToken().pipe(take(1))
    .subscribe(() => { return },
    (err: Error) => void expect(err.message).toEqual('Refresh token expired'));
    void expect(mockLocalStorageService.getRefreshToken).toHaveBeenCalledTimes(1);
    void expect(isTokenExpSpy).toHaveBeenCalledWith(refreshToken);
    void expect(errorHandlerSpy).toHaveBeenCalledWith(new Error('Refresh token expired'), false);
  });

  it('errorHandler should throw error - isSoft = false', () => {
    const error = new Error('Error passed in');
    service.errorHandler(error).pipe(take(1))
    .subscribe(() => { return },
    (err: Error) => void expect(err.message).toEqual('Error passed in'));
    void expect(mockLocalStorageService.removeTokens).toHaveBeenCalledTimes(1);
    void expect(mockLocalStorageService.removeUserData).toHaveBeenCalledTimes(1);
    void expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('errorHandler should throw error - isSoft = true', () => {
    const error = new Error('Error passed in');
    service.errorHandler(error, true).pipe(take(1))
    .subscribe(() => { return },
    (err: Error) => void expect(err.message).toEqual('Error passed in'));
    void expect(mockLocalStorageService.removeTokens).toHaveBeenCalledTimes(1);
    void expect(mockLocalStorageService.removeUserData).toHaveBeenCalledTimes(1);
    void expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
