import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@closing/layout/feature').then((m) => m.routes),
  },
];
