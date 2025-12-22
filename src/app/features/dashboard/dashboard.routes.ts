import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
  }
];
