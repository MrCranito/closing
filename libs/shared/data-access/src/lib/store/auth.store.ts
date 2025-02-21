import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { User } from '@closing/shared/interfaces';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { pipe, switchMap, tap } from 'rxjs';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(AuthService)) => ({
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((parameters) => {
          return service.login(parameters.email, parameters.password).pipe(
            tapResponse({
              next: (user) => patchState(store, { user, isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
    register: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((parameters) => {
          return service.register(parameters.email, parameters.password).pipe(
            tapResponse({
              next: (user) => patchState(store, { user, isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
    loginWithGoogle: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return service.loginWithGoogle().pipe(
            tapResponse({
              next: (user) => patchState(store, { user, isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
    getToken: () => store.token,
    isAuthenticated: () => (store.token() != null ? true : false),
  }))
);
