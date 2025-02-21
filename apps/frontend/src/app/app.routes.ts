import { Route } from '@angular/router';
import { AuthGuard } from '@closing/shared/utils';
import { AppNavigationRoutes } from './navigation.routes';
import { AuthStore } from '@closing/shared/data-access';

export const appRoutes: Route[] = [
  {
    path: AppNavigationRoutes.Authentification,
    loadChildren: () =>
      import('@closing/authentification/feature-shell').then((m) => m.routes),
    providers: [AuthStore],
  },
  {
    path: AppNavigationRoutes.Dashboard,
    loadChildren: () =>
      import('@closing/dashboard/feature-shell').then((m) => m.routes),
    canActivate: [AuthGuard],
    providers: [AuthStore],
  },
  {
    path: AppNavigationRoutes.TreeEdit,
    loadChildren: () =>
      import('@closing/tree/feature-shell').then((m) => m.routes),
    canActivate: [AuthGuard],
    providers: [AuthStore],
  },
];
