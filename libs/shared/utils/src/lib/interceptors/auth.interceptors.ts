import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@closing/shared/data-access';
import { catchError, Observable, throwError } from 'rxjs';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const authToken = authStore.getToken();
  let clonedRequest = req;

  if (authToken) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStore.logOut();
        router.navigate(['/auth/login']);
      }
      return throwError(error);
    })
  );
}
