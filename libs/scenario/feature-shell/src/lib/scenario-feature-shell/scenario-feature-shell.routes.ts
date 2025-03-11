import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@closing/scenario/feature').then((m) => m.routes),
  },
];
