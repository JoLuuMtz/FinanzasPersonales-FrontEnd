import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn,  Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege rutas que requieren autenticación
 * Redirige al login si no está autenticado
 */
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.userToken();
  const isAuthenticated = authService.IsAutenticated();
  const user = authService.getCurrentUser();



  if (!token || !isAuthenticated || !user) {

    router.navigate(['/auth/login']);
    return false;
  }


  return true;
};

/**
 * Guard inverso: impide acceso a login/registro si ya está autenticado
 * Redirige al dashboard si ya está logueado
 */
export const NoAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.userToken();
  const isAuthenticated = authService.IsAutenticated();
  const user = authService.getCurrentUser();



  // Si ya está autenticado, redirigir al dashboard
  if (token && isAuthenticated && user) {

    router.navigate(['/dashboard']);
    return false;
  }


  return true;
};
