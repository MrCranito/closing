import { Route } from '@angular/router';
import { NavigationRoutes } from './navigation.routes';

export const routes: Route[] = [
  {
    path: NavigationRoutes.LIST,
    loadComponent: () =>
      import('./tree-list/tree-list.component').then(
        (m) => m.TreeListComponent
      ),
  },
  {
    path: NavigationRoutes.CREATE,
    loadComponent: () =>
      import('./tree-create/tree-create.component').then(
        (m) => m.TreeCreateComponent
      ),
  },
  {
    path: NavigationRoutes.EDIT,
    loadComponent: () =>
      import('./tree-edit/tree-edit.component').then(
        (m) => m.TreeEditComponent
      ),
  },
  {
    path: '**',
    redirectTo: NavigationRoutes.LIST,
  },
];
