import { Route } from '@angular/router';
import { NavigationRoutes } from './navigation.routes';

export const routes: Route[] = [
  {
    path: NavigationRoutes.LIST,
    loadComponent: () =>
      import('./diagram-list/diagram-list.component').then(
        (m) => m.DiagramListComponent
      ),
  },
  {
    path: NavigationRoutes.CREATE,
    loadComponent: () =>
      import('./diagram-create/diagram-create.component').then(
        (m) => m.DiagramCreateComponent
      ),
  },
  {
    path: NavigationRoutes.EDIT,
    loadComponent: () =>
      import('./diagram-edit/diagram-edit.component').then(
        (m) => m.DiagramEditComponent
      ),
  },
  {
    path: '**',
    redirectTo: NavigationRoutes.LIST,
  },
];
