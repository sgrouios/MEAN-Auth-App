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
      providers: [  ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
