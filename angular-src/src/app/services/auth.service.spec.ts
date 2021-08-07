import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockLocalStorageService: LocalStorageService;

  beforeEach(() => {
    mockLocalStorageService = jasmine.createSpyObj<LocalStorageService>(['setAccessToken', 'setRefreshToken', 'setUserData', 'removeTokens', 'removeUserData']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [  
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('authenticateUser() should set items in local storage', () => {
    service.authenticateUser({ username: 'user', password: 'pass'})
    .subscribe((tokens) => {
      void expect(mockLocalStorageService.setAccessToken).toHaveBeenCalledWith(tokens.accessToken);
      void expect(mockLocalStorageService.setRefreshToken).toHaveBeenCalledWith(tokens.refreshToken);
      void expect(mockLocalStorageService.setUserData).toHaveBeenCalledWith(tokens.user);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/authenticate`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    req.flush({accessToken: 'access', refreshToken: 'refresh', 
    user: { id: 'id', name: 'name', username: 'username', email: 'email'}});
  });

  it('authenticateUser() should throwError', () => {
    service.authenticateUser({ username: 'user', password: 'pass'})
    .subscribe(() => { return }, (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('Error thrown');
    });

    const req = httpMock.expectOne(`${service.apiUrl}/authenticate`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'Error thrown'});
  });  

  it('logout() should remove items from localStorage', () => {
    service.logout('refreshToken')
    .subscribe(() => {
      void expect(mockLocalStorageService.removeTokens).toHaveBeenCalledTimes(1);
      void expect(mockLocalStorageService.removeUserData).toHaveBeenCalledTimes(1);
    });
    const req = httpMock.expectOne(`${service.apiUrl}/logout?refreshToken=refreshToken`);
    void expect(req.request.headers.has('exclude_authorization')).toBeFalsy();
    void expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('logout() should throw error', () => {
    service.logout('refreshToken')
    .subscribe(() => { return }, (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('Error thrown');
    });
    const req = httpMock.expectOne(`${service.apiUrl}/logout?refreshToken=refreshToken`);
    void expect(req.request.headers.has('exclude_authorization')).toBeFalsy();
    void expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'Error thrown'});
  });

  it('refreshToken() should set items in local storage', () => {
    service.refreshToken('refreshToken')
    .subscribe((token) => {
      void expect(mockLocalStorageService.setAccessToken).toHaveBeenCalledWith(token.token);
      void expect(mockLocalStorageService.setUserData).toHaveBeenCalledWith(token.user);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/refresh`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    void expect(req.request.body).toEqual({token : 'refreshToken'});
    req.flush({token: 'token', 
    user: { id: 'id', name: 'name', username: 'username', email: 'email'}});
  });

  it('refreshToken() should throw error', () => {
    service.refreshToken('refreshToken')
    .subscribe(() => { return }, (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('Error thrown');
    });

    const req = httpMock.expectOne(`${service.apiUrl}/refresh`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    void expect(req.request.body).toEqual({token : 'refreshToken'});
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'Error thrown'});
  });

  it('registerUser() success', () => {
    const user = {name: 'name', email: 'email', username: 'username', password: 'pass'};
    service.registerUser(user)
    .subscribe((res) => void expect(res).toEqual('success'));
    const req = httpMock.expectOne(`${service.apiUrl}/register`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual(user);
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    req.flush('success');
  });

  it('registerUser() should throw error', () => {
    const user = {name: 'name', email: 'email', username: 'username', password: 'pass'};
    service.registerUser(user)
    .subscribe(() => { return }, (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('Error thrown');
    });
    const req = httpMock.expectOne(`${service.apiUrl}/register`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual(user);
    void expect(req.request.headers.has('exclude_authorization')).toBeTruthy();
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'Error thrown'});
  });

  it('getProfile() success', () => {
    const userProfile = { 
      id: 'id', 
      name: 'name', 
      email: 'email', 
      username: 'username', 
      profileInformation: 'info', 
      profileImage: 'image'
  }
    service.getProfile()
    .subscribe((res) => {
      void expect(res).toEqual(userProfile);
    })

    const req = httpMock.expectOne(`${service.apiUrl}/profile`);
    void expect(req.request.method).toEqual('GET');
    req.flush(userProfile);
  });

  it('getProfile() should throw error', () => {
    const userProfile = { 
      id: 'id', 
      name: 'name', 
      email: 'email', 
      username: 'username', 
      profileInformation: 'info', 
      profileImage: 'image'
  }
    service.getProfile()
    .subscribe(() => { return }, (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('Error thrown');
    })

    const req = httpMock.expectOne(`${service.apiUrl}/profile`);
    void expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'Error thrown'});
  });
});
