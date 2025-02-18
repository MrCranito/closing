import { Route } from '@angular/router';
import { AppNavigationRoutes } from './navigation.routes';

export const appRoutes: Route[] = [
    {
        path: AppNavigationRoutes.Dashboard,
        loadChildren: () => import('@closing/dashboard/feature-shell').then(m => m.routes)
    },
]