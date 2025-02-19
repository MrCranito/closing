import { Route } from '@angular/router';


export const routes: Route[] = [
    {
      path: '',
      loadChildren: () => import('@closing/landing/feature').then(m => m.routes)
    }
] 