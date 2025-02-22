import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { AuthStore, environment } from '@closing/shared/data-access';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT } from '@closing/shared/interfaces';

// Detect system theme
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
const theme = prefersDarkMode ? LaraDarkBlue : Aura;

// Apply Tailwind dark mode
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(),
    AuthStore,
  ],
};
