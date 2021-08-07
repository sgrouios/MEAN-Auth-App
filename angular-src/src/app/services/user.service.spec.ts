import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(UserService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  })

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('checkUsername should return DoesExist model on success', () => {
    service.checkUsername('username')
    .subscribe(x => void expect(x.doesExist).toBeTrue());
    const req = mockHttp.expectOne(`${service.apiUrl}/check-username?username=username`);
    void expect(req.request.method).toEqual('GET');
    void expect(req.request.headers.has('exclude_authorization')).toBeTrue();
    req.flush({doesExist: true});
  });

  it('checkUsername should catch error when thrown', () => {
    service.checkUsername('username')
    .subscribe(() => { return },
      (err) => {
        void expect(err.status).toEqual(500);
        void expect(err.statusText).toEqual('error');
      });
    const req = mockHttp.expectOne(`${service.apiUrl}/check-username?username=username`);
    void expect(req.request.method).toEqual('GET');
    void expect(req.request.headers.has('exclude_authorization')).toBeTrue();
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'error'});
  });

  it('checkEmail should return DoesExist model on success', () => {
    service.checkEmail('email')
    .subscribe(x => void expect(x.doesExist).toBeTrue());
    const req = mockHttp.expectOne(`${service.apiUrl}/check-email?email=email`);
    void expect(req.request.method).toEqual('GET');
    void expect(req.request.headers.has('exclude_authorization')).toBeTrue();
    req.flush({doesExist: true});
  });

  it('checkEmail should catch error when thrown', () => {
    service.checkEmail('email')
    .subscribe(() => { return },
      (err) => {
        void expect(err.status).toEqual(500);
        void expect(err.statusText).toEqual('error');
      });
    const req = mockHttp.expectOne(`${service.apiUrl}/check-email?email=email`);
    void expect(req.request.method).toEqual('GET');
    void expect(req.request.headers.has('exclude_authorization')).toBeTrue();
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'error'});
  });

  it('editProfile should return on success', () => {
    const profileInformation = 'information';
    service.editProfile(profileInformation)
    .subscribe(x => void expect(x).toEqual('success'));
    const req = mockHttp.expectOne(`${service.apiUrl}/edit-profile`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual({profileInformation: profileInformation});
    req.flush('success');
  });

  it('editProfile should catch error when thrown', () => {
    const profileInformation = 'information';
    service.editProfile(profileInformation)
    .subscribe(() => { return },
    (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('error');
    });
    const req = mockHttp.expectOne(`${service.apiUrl}/edit-profile`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual({profileInformation: profileInformation});
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'error'});
  });

  it('updateProfileImage should return string on success', () => {
    const imageUrl = 'url';
    service.updateProfileImage(imageUrl)
    .subscribe(x => void expect(x).toEqual('success'));
    const req = mockHttp.expectOne(`${service.apiUrl}/update-profile-image`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual({imageUrl: imageUrl});
    req.flush('success');
  });

  it('updateProfileImage should return error when thrown', () => {
    const imageUrl = 'url';
    service.updateProfileImage(imageUrl)
    .subscribe(() => { return },
    (err) => {
      void expect(err.status).toEqual(500);
      void expect(err.statusText).toEqual('error');
    });
    const req = mockHttp.expectOne(`${service.apiUrl}/update-profile-image`);
    void expect(req.request.method).toEqual('POST');
    void expect(req.request.body).toEqual({imageUrl: imageUrl});
    req.error(new ErrorEvent('error'), { status: 500, statusText: 'error'});
  });

});
