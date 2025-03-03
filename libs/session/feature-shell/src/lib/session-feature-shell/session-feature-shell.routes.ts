import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@closing/session/feature').then((m) => m.routes),
  },
];
