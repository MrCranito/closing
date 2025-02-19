import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@closing/authentification/feature').then(m => m.routes)
  }
];