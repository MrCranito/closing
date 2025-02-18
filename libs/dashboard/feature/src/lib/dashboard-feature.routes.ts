import { Route } from "@angular/router";

export const routes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent)
    }
]