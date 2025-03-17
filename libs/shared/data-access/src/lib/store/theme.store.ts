import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { LocalStorageService } from '../service/local-storage/local-storage.service';
import { pipe, tap } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: 'light',
};

const THEME_KEY = 'theme_mode';

export const ThemeStore = signalStore(
  withState(initialState),
  withMethods((store, localStorageService = inject(LocalStorageService)) => ({
    setTheme: rxMethod<ThemeMode>(
      pipe(
        tap((mode) => {
          localStorage.setItem(THEME_KEY, mode);
          patchState(store, { mode });
          if (mode === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
      )
    ),

    initializeTheme: rxMethod<void>(
      pipe(
        tap(() => {
          const savedTheme = localStorage.getItem(
            THEME_KEY
          ) as ThemeMode | null;
          const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches;
          const theme = savedTheme || (prefersDark ? 'dark' : 'light');

          patchState(store, { mode: theme });
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
      )
    ),

    toggleTheme: rxMethod<void>(
      pipe(
        tap(() => {
          const currentTheme = store.mode();
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          localStorage.setItem(THEME_KEY, newTheme);
          patchState(store, { mode: newTheme });
          document.documentElement.classList.toggle('dark');
        })
      )
    ),
  }))
);
