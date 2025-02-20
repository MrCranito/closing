import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@closing/tree-edit/feature').then((m) => m.routes),
  },
];
