import { Route } from "@angular/router";
import { NavigationRoutes } from "./navigation.routes";

export const routes: Route[] = [
    {
        path: NavigationRoutes.Landing,
        loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent)
    }
]