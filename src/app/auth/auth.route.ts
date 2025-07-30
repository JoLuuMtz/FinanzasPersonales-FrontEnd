import { Routes } from '@angular/router';
import AuthLayoutComponent from './layout/auth-layout/auth-layout.component';
import { NoAuthGuard } from './guard/auth.guard';

export const AuthRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component'),
    canActivate: [NoAuthGuard], // Aplica el guard a toda la sección de auth
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login-page/login-page.component'),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register-page/register-page.component'),
      },
    ],
  },
];
