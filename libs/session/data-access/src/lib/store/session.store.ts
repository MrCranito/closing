import { Session } from '../interfaces/session.interface';
import { SessionService } from '../services/session.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { signalStore, withState, withMethods, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { pipe, tap, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { withTableRequest } from '@closing/shared/data-access';

export interface SessionState {
  sessions: Session[];
  loading: boolean;
  total: number;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  total: 0,
  error: null,
};

export const SessionStore = signalStore(
  withState(initialState),
  withTableRequest({ name: 'session' }),
  withMethods((store, service = inject(SessionService)) => ({
    getSessions: rxMethod<{
      page: number;
      size: number;
      sorts: string;
      filters: string;
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ page, size, sorts, filters }) =>
          service.fetch(page, size, sorts, filters)
        ),
        tapResponse({
          next: (response) =>
            patchState(store, {
              sessions: response.items,
              total: response.total,
              loading: false,
            }),
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      store.getSessions({ page: 1, size: 10, sorts: '', filters: '' });
    },
  }))
);
