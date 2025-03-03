import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { NotificationStatusEnum, User } from '@closing/shared/interfaces';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { of, pipe, switchMap, tap, timer } from 'rxjs';
import { LocalStorageService } from '../service/local-storage/local-storage.service';
import { NotificationStore } from './notification.store';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      localStorageService = inject(LocalStorageService),
      notificationStore = inject(NotificationStore)
    ) => ({
      login: rxMethod<{ email: string; password: string; rememberMe: boolean }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((parameters) => {
            return authService
              .login(parameters.email, parameters.password)
              .pipe(
                tapResponse({
                  next: (response) => {
                    localStorageService.setToken(response.token);
                    patchState(store, {
                      user: response.user,
                      loading: false,
                    });
                  },
                  error: (err) => {
                    notificationStore.addNotification({
                      id: uuidv4(),
                      message: 'Error on login',
                      status: NotificationStatusEnum.Error,
                    });

                    patchState(store, { loading: false });
                  },
                })
              );
          })
        )
      ),
      register: rxMethod<{
        user: User;
      }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((parameters) => {
            return authService.register(parameters.user).pipe(
              tapResponse({
                next: (user) => patchState(store, { user, loading: false }),
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Error on register',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            );
          })
        )
      ),
      sendEmailVerification: rxMethod<{ email: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((parameters) => {
            notificationStore.addNotification({
              id: uuidv4(),
              message: 'Email have been sent',
              status: NotificationStatusEnum.Info,
            });
            return authService.sendEmailVerification(parameters.email).pipe(
              tapResponse({
                next: () => patchState(store, { loading: false }),
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Error during email verification',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            );
          })
        )
      ),
      loginWithGoogle: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            return authService.loginWithGoogle().pipe(
              tapResponse({
                next: (user) => patchState(store, { user, loading: false }),
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Error on login with google',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            );
          })
        )
      ),
      updateUserInfo: rxMethod<{
        lastname: string;
        firstname: string;
        companyName: string;
      }>(
        pipe(
          switchMap(({ lastname, firstname, companyName }) => {
            return authService
              .update({ lastname, firstname }, companyName)
              .pipe(
                tapResponse({
                  next: (user) => patchState(store, { user, loading: false }),
                  error: (err) => {
                    notificationStore.addNotification({
                      id: uuidv4(),
                      message: 'Error on updating your info',
                      status: NotificationStatusEnum.Error,
                    });
                    patchState(store, { loading: false });
                  },
                })
              );
          })
        )
      ),
      updateEmail: rxMethod<{ id: string; email: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((parameters) => {
            return authService
              .updateEmail(parameters.id, parameters.email)
              .pipe(
                tapResponse({
                  next: (user) => patchState(store, { user, loading: false }),
                  error: (err) => {
                    patchState(store, { loading: false });
                  },
                })
              );
          })
        )
      ),
      logOut: rxMethod<void>(
        pipe(
          tap(() => {
            localStorageService.removeToken();
            patchState(store, { user: null });
            router.navigate(['/auth']);
          })
        )
      ),
      validateToken: rxMethod<void>(
        pipe(
          switchMap(() =>
            authService.validateToken().pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, { user });
                },
                error: (err) => {
                  localStorageService.removeToken();
                  patchState(store, { user: null });
                  router.navigate(['/auth/login']);
                },
              })
            )
          )
        )
      ),
      startPeriodicTokenValidation: rxMethod<void>(
        pipe(
          switchMap(() =>
            // Validate token every 5 minutes
            timer(0, 5 * 60 * 1000).pipe(
              switchMap(() => {
                if (!localStorageService.getToken()) {
                  return of(null);
                }
                return authService.validateToken().pipe(
                  tapResponse({
                    next: (user) => patchState(store, { user }),
                    error: () => {
                      localStorageService.removeToken();
                      patchState(store, { user: null });
                      router.navigate(['/auth/login']);
                    },
                  })
                );
              })
            )
          )
        )
      ),
      requestPasswordReset: rxMethod<{ email: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ email }) =>
            authService.requestPasswordReset(email).pipe(
              tapResponse({
                next: () => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Password reset instructions sent to your email',
                    status: NotificationStatusEnum.Success,
                  });
                  patchState(store, { loading: false });
                },
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Failed to send password reset email',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            )
          )
        )
      ),
      resetPassword: rxMethod<{ token: string; newPassword: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ token, newPassword }) =>
            authService.resetPassword(token, newPassword).pipe(
              tapResponse({
                next: () => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Password reset successful',
                    status: NotificationStatusEnum.Success,
                  });
                  patchState(store, { loading: false });
                  router.navigate(['/auth/login']);
                },
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Failed to reset password',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            )
          )
        )
      ),
      changePassword: rxMethod<{
        currentPassword: string;
        newPassword: string;
      }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ currentPassword, newPassword }) =>
            authService.changePassword(currentPassword, newPassword).pipe(
              tapResponse({
                next: () => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Password changed successfully',
                    status: NotificationStatusEnum.Success,
                  });
                  patchState(store, { loading: false });
                },
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Failed to change password',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            )
          )
        )
      ),
      getToken: () => localStorageService.getToken(),
      isAuthenticated: () =>
        localStorageService.token() != null ? true : false,
      verifyEmail: rxMethod<{ token: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((parameters) => {
            return authService.verifyEmail(parameters.token).pipe(
              tapResponse({
                next: () => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Email verified successfully',
                    status: NotificationStatusEnum.Success,
                  });
                  patchState(store, { loading: false });
                },
                error: (err) => {
                  notificationStore.addNotification({
                    id: uuidv4(),
                    message: 'Failed to verify email',
                    status: NotificationStatusEnum.Error,
                  });
                  patchState(store, { loading: false });
                },
              })
            );
          })
        )
      ),
    })
  )
);
