import { Route } from '@angular/router';
import { AuthGuard } from '@closing/shared/utils';
import { AuthStore } from '@closing/shared/data-access';
import { MainNavigationRoutes } from '@closing/shared/interfaces';
import { UsersStore } from '@closing/users/data-access';
import { DiagramStore } from '@closing/diagram/data-access';

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
        path: MainNavigationRoutes.Diagram,
        loadChildren: () =>
          import('@closing/diagram/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, DiagramStore],
      },
      {
        path: MainNavigationRoutes.Scenario,
        loadChildren: () =>
          import('@closing/scenario/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, DiagramStore],
      },
      {
        path: MainNavigationRoutes.Users,
        loadChildren: () =>
          import('@closing/users/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, UsersStore],
      },
      {
        path: MainNavigationRoutes.Diagram,
        loadChildren: () =>
          import('@closing/diagram/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore, DiagramStore],
      },
    ],
  },
];
