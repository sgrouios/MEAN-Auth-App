// import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { TokenService } from '../services/token.service';
// import { TokenInterceptor } from './token-interceptor';

// fdescribe('TokenInterceptor', () => {
//   let client: HttpClient;
//   let controller: HttpTestingController;
//   let interceptor: TokenInterceptor;
//   let mockTokenService: jasmine.SpyObj<TokenService>;

//   beforeEach(async() => {
//     mockTokenService = jasmine.createSpyObj<TokenService>(['getAuthHeader', 'errorHandler']);
//     interceptor = new TokenInterceptor(mockTokenService);
//     await TestBed.configureTestingModule({
//       imports: [ HttpClientTestingModule ],
//       providers: [
//         { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
//       ]
//     });
//     client = TestBed.inject(HttpClient);
//     controller = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     controller.verify();
//   })

//   xit('should create an instance', () => {
//     void expect(interceptor).toBeTruthy();
//   });

//   it('should delete exclude_authorization header and call handle()', (done) => {
//     const body = 'successful';
//     client.get('/test'/*, { body: 'body'}, { headers: new HttpHeaders('exclude_authorization')} */)
//     .subscribe(x => { 
//       void expect(x).toEqual(body);
//       done();
//     });
//     const request = controller.expectOne('/test');
//     request.flush(body);
//   });

//   // https://www.dotnetcurry.com/angularjs/unit-testing-angular-services
// });
