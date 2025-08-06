import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RefreshTokenResponse } from '../interfaces/refresh-token.interface';

//TODO: Leer y entender que hace este Interceptor
// Variables globales para manejar el estado del refresh
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

//? LEER SOBRE LOS INTERCEPTORES

export function AuthInterceptor(
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> {
  const authService = inject(AuthService);

  // Obtener el token actual
  const token = authService.userToken();

  // Si hay token, agregarlo al header
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('refresh-token')) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
}

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshAccessToken().pipe(
      switchMap((response: RefreshTokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);

        // Actualizar el token en el servicio
        authService.updateTokens(response.accessToken, response.refreshToken);

        return next(addToken(request, response.accessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logOut();
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addToken(request, token)))
    );
  }
}
