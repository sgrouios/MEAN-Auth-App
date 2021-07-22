import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, concatMap, mergeMap, tap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService){}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(req.headers.has('exclude_authorization')){
      req = req.clone({
        headers: req.headers.delete('exclude_authorization')
      })
      return next.handle(req);
    }

    return this.tokenService.getAuthHeader()
    .pipe(
      concatMap((bearerToken: string) => {
        req = req.clone({
          headers: req.headers.append('Authorization', bearerToken)
        });
        return next.handle(req).pipe(
          tap(
            (event) => event,
            (err) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                  return this.tokenService.errorHandler(new Error('Unauthorized user'));
                }
              }
              return throwError(err);
            }
          )
        );
      }),
      catchError((err) => throwError(err))
    )
  }
}
