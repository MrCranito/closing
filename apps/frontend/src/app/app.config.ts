import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {
  AuthStore,
  environment,
  NotificationStore,
} from '@closing/shared/data-access';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT } from '@closing/shared/interfaces';
import { MessageService } from 'primeng/api';
import { AuthInitService, AuthInterceptor } from '@closing/shared/utils';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    provideAppInitializer(() => inject(AuthInitService).initAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    AuthStore,
    NotificationStore,
    MessageService,
  ],
};
