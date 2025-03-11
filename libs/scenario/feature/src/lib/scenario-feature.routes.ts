import { Routes } from '@angular/router';
import { ScenarioNavigationRoutes } from './navigation.routes';

export const routes: Routes = [
  {
    path: ScenarioNavigationRoutes.ScenarioList,
    loadComponent: () =>
      import('./scenario-list/scenario-list.component').then(
        (m) => m.ScenarioListComponent
      ),
  },
];
