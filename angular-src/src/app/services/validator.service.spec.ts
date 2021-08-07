import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

import { ValidatorService } from './validator.service';

fdescribe('ValidatorService', () => {
  let service: ValidatorService;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj<UserService>(['checkEmail', 'checkUsername']);
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    });
    service = TestBed.inject(ValidatorService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });
});
