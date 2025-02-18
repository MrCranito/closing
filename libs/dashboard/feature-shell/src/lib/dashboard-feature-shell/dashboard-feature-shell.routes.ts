import { Route } from '@angular/router';
import { NavigationRoutes } from './navigation.routes';

export const routes: Route[] = [
    {
      path: NavigationRoutes.Dashboard,
      loadChildren: () => import('@closing/dashboard/feature').then(m => m.routes)
    }
]