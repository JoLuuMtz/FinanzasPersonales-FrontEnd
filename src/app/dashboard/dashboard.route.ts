import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';

export const DashBoardRouter: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./pages/welcome-page/welcome-page.component').then(
            (c) => c.WelcomePageComponent
          ),
        data: { title: 'Bienvenida' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports-page/reports-page.component').then(
            (c) => c.ReportsPageComponent
          ),
        data: { title: 'Reportes' },
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./pages/budget-page/budget-page.component').then(
            (c) => c.BudgetPageComponent
          ),
        data: { title: 'Presupuesto' },
      },
      {
        path: 'incomes',
        loadComponent: () =>
          import('./pages/incomes-page/incomes-page.component').then(
            (c) => c.IncomesPageComponent
          ),
        data: { title: 'Ingresos' },
      },
      {
        path: 'spends',
        loadComponent: () =>
          import('./pages/spends-page/spends-page.component').then(
            (c) => c.SpendsPageComponent
          ),
        data: { title: 'Gastos' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/setting-page/setting-page.component').then(
            (c) => c.SettingPageComponent
          ),
        data: { title: 'Configuración' },
      },
    ],
  },
];
