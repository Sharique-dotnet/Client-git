import { Routes } from '@angular/router';

export const MAINTENANCE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'band-list',
    pathMatch: 'full'
  },
  {
    path: 'title-list',
    loadComponent: () => import('./title-list/title-list.component').then(m => m.TitleListComponent)
  },
  {
    path: 'band-list',
    loadComponent: () => import('./band-list/band-list.component').then(m => m.BandListComponent)
  }
];
