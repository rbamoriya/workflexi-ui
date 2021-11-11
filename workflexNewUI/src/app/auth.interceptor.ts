import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // skip intercepting login request
    if (request.headers.has('Skip-interception')) {
      return next.handle(request);
    }
    return next.handle(request)
      .pipe(
        catchError((err, caught: Observable<HttpEvent<any>>) => {
          if (err instanceof HttpErrorResponse && err.status == 401) {
            localStorage.clear();
            // this.router.navigate(['otp/generate'], { queryParams: { returnUrl: request.url } });
            window.location.href = '/home';
            return of(err as any);
          }
          throw err;
        })
      );
  }
}
