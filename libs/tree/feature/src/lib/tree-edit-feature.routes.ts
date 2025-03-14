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
      import('./sitemap-builder/sitemap-builder.component').then(
        (m) => m.SitemapBuilderComponent
      ),
  },
  {
    path: '**',
    redirectTo: NavigationRoutes.LIST,
  },
];
