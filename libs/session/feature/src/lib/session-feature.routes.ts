import { Routes } from '@angular/router';
import { SessionNavigationRoutes } from './navigation.routes';

export const routes: Routes = [
  {
    path: SessionNavigationRoutes.SessionList,
    loadComponent: () =>
      import('./session-list/session-list.component').then(
        (m) => m.SessionListComponent
      ),
  },
];
