import type { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: ':lang(es|en)/cv',
    loadChildren: () => import('./cv/cv.routes').then((m) => m.CV_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
