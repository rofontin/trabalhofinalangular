import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Se não tiver já um auth no headers pega do localStorage e seta
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERRO ' + error.status, error);
        return throwError(error);
      }));

  }

}
