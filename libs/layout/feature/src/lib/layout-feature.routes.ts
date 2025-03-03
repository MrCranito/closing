import { Route } from '@angular/router';
import { AuthGuard } from '@closing/shared/utils';
import { AuthStore } from '@closing/shared/data-access';
import { MainNavigationRoutes } from '@closing/shared/interfaces';
import { SessionStore } from '@closing/session/data-access';
import { UsersStore } from '@closing/users/data-access';
import { TreeStore } from '@closing/tree/data-access';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout-feature/layout-feature.component').then(
        (m) => m.LayoutFeatureComponent
      ),
    children: [
      {
        path: MainNavigationRoutes.Dashboard,
        loadChildren: () =>
          import('@closing/dashboard/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore],
      },
      {
        path: MainNavigationRoutes.Tree,
        loadChildren: () =>
          import('@closing/tree/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, TreeStore],
      },
      {
        path: MainNavigationRoutes.Session,
        loadChildren: () =>
          import('@closing/session/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, SessionStore],
      },
      {
        path: MainNavigationRoutes.Users,
        loadChildren: () =>
          import('@closing/users/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, UsersStore],
      },
    ],
  },
];
