import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Route, Router } from '@angular/router';
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

  console.log('AuthGuard - Estado:', {
    token: !!token,
    isAuthenticated,
    hasUser: !!user,
  });

  if (!token || !isAuthenticated || !user) {
    console.log('Acceso denegado - Redirigiendo al login');
    router.navigate(['/auth/login']);
    return false;
  }

  console.log('Acceso autorizado');
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

  console.log('NoAuthGuard - Estado:', {
    token: !!token,
    isAuthenticated,
    hasUser: !!user,
  });

  // Si ya está autenticado, redirigir al dashboard
  if (token && isAuthenticated && user) {
    console.log('Usuario ya autenticado - Redirigiendo al dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  console.log('Acceso autorizado a rutas de autenticación');
  return true;
};
