import { Routes } from '@angular/router';
import AuthLayoutComponent from './layout/auth-layout/auth-layout.component';


export const AuthRoutes: Routes = [

  {
    path: '',
    loadComponent: ()=> import('./layout/auth-layout/auth-layout.component'),
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
