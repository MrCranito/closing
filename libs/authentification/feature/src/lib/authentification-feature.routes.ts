import { Route } from "@angular/router";
import { NavigationRoutes } from "./navigation.routes";

export const routes: Route[] = [
    {
        path: NavigationRoutes.Login,
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: NavigationRoutes.Register,
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
    }
]