import { Route } from '@angular/router';
import { AuthGuard } from '@closing/shared/utils';
import { AuthStore } from '@closing/shared/data-access';
import { LayoutNavigationRoutes } from './navigation.routes';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout-feature/layout-feature.component').then(
        (m) => m.LayoutFeatureComponent
      ),
    children: [
      {
        path: LayoutNavigationRoutes.Dashboard,
        loadChildren: () =>
          import('@closing/dashboard/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore],
      },
      {
        path: LayoutNavigationRoutes.Tree,
        loadChildren: () =>
          import('@closing/tree/feature-shell').then((m) => m.routes),
        canActivate: [AuthGuard],
        providers: [AuthStore],
      },
    ],
  },
];
