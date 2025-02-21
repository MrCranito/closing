import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'create',
    loadComponent: () =>
      import('./tree-create/tree-create.component').then(
        (m) => m.TreeCreateComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./tree-edit/tree-edit.component').then(
        (m) => m.TreeEditComponent
      ),
  },
];
