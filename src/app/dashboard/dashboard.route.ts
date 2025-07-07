import { Routes } from '@angular/router';

export const DashBoardRouter: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
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
      },
      {
        path: 'reports', loadComponent: () =>
          import('./pages/reports-page/reports-page.component').then((c) => c.ReportsPageComponent) 
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./pages/budget-page/budget-page.component').then(
            (c) => c.BudgetPageComponent
          ),
      },
      {
        path: 'incomes',
        loadComponent: () =>
          import('./pages/incomes-page/incomes-page.component').then(
            (c) => c.IncomesPageComponent
          ),
      },
      {
        path: 'spends',
        loadComponent: () =>
          import('./pages/spends-page/spends-page.component').then(
            (c) => c.SpendsPageComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/setting-page/setting-page.component').then(
            (c) => c.SettingPageComponent
          ),
      },
    ],
  },
];
