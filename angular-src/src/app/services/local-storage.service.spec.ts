import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const user = {id: 'id', name: 'string', username: 'username', email: 'email'};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('setAccessToken should set token', () => {
    service.setAccessToken('test-access');
    void expect(localStorage.getItem(service.ACCESS_TOKEN)).toEqual('test-access');
  });

  it('getAccessToken should return accessToken storage value', () => {
    localStorage.setItem(service.ACCESS_TOKEN, 'test-access');
    void expect(service.getAccessToken()).toEqual('test-access');
  });

  it('setRefreshToken should set token', () => {
    service.setRefreshToken('test-refresh');
    void expect(localStorage.getItem(service.REFRESH_TOKEN)).toEqual('test-refresh');
  });

  it('getRefreshToken should return refreshToken storage value', () => {
    localStorage.setItem(service.REFRESH_TOKEN, 'test-refresh');
    void expect(service.getRefreshToken()).toEqual('test-refresh');
  });

  it('removeTokens should remove access and refresh items', () => {
    localStorage.setItem(service.ACCESS_TOKEN, 'test-access');
    localStorage.setItem(service.REFRESH_TOKEN, 'test-refresh');
    void expect(localStorage.getItem(service.ACCESS_TOKEN)).toEqual('test-access');
    void expect(localStorage.getItem(service.REFRESH_TOKEN)).toEqual('test-refresh');
    service.removeTokens();
    void expect(localStorage.getItem(service.ACCESS_TOKEN)).toBeFalsy();
    void expect(localStorage.getItem(service.REFRESH_TOKEN)).toBeFalsy();
  });

  it('setUserData should set user item in storage', () => {
    service.setUserData(user);
    void expect(localStorage.getItem(service.USER)).toEqual(JSON.stringify(user));
  });

  it('removeUserData should remove user item from storage', () => {
    localStorage.setItem(service.USER, JSON.stringify(user));
    void expect(localStorage.getItem(service.USER)).toEqual(JSON.stringify(user));
    service.removeUserData();
    void expect(localStorage.getItem(service.USER)).toBeFalsy();
  });
});
