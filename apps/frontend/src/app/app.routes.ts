import { Route } from '@angular/router';
import { AppNavigationRoutes } from './navigation.routes';

export const appRoutes: Route[] = [
  {
    path: AppNavigationRoutes.Landing,
    loadChildren: () =>
      import('@closing/landing/feature-shell').then((m) => m.routes),
  },
  {
    path: AppNavigationRoutes.Authentification,
    loadChildren: () =>
      import('@closing/authentification/feature-shell').then((m) => m.routes),
  },
  {
    path: AppNavigationRoutes.Dashboard,
    loadChildren: () =>
      import('@closing/dashboard/feature-shell').then((m) => m.routes),
  },
  {
    path: AppNavigationRoutes.TreeEdit,
    loadChildren: () =>
      import('@closing/tree-edit/feature-shell').then((m) => m.routes),
  },
];
