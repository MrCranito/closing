import { Route } from '@angular/router';
import { NavigationRoutes } from './navigation.routes';

export const routes: Route[] = [
  {
    path: NavigationRoutes.Login,
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: NavigationRoutes.Register,
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: NavigationRoutes.ForgotPassword,
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: NavigationRoutes.ResetPassword,
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: NavigationRoutes.NotVerifiedAccount,
    loadComponent: () =>
      import('./not-verified-account/not-verified-account.component').then(
        (m) => m.NotVerifiedComponent
      ),
  },
  {
    path: NavigationRoutes.VerifyEmail,
    loadComponent: () =>
      import('./verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      ),
  },
  {
    path: '**',
    redirectTo: NavigationRoutes.Login,
  },
];
