import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@closing/tree/feature').then((m) => m.routes),
  },
];
