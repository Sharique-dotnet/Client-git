import { Routes } from '@angular/router';

export const MAINTENANCE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'band-list',
    pathMatch: 'full'
  },
  {
    path: 'band-list',
    loadComponent: () => import('./band-list/band-list.component').then(m => m.BandListComponent)
  }
];
