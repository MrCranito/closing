import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@closing/users/feature').then((m) => m.routes),
  },
];
