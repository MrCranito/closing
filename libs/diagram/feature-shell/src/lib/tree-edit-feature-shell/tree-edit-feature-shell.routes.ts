import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@closing/diagram/feature').then((m) => m.routes),
  },
];
