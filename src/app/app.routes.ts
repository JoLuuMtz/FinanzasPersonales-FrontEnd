import { Routes } from '@angular/router';
import NotFoundPageComponent from './shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.route').then((r) => r.AuthRoutes),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.route').then((r) => r.DashBoardRouter),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Pagina no encontrada',
  },
];
