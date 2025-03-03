import {
  signalStore,
  withMethods,
  patchState,
  withHooks,
  withState,
  type,
} from '@ngrx/signals';
import {
  withEntities,
  setEntities,
  SelectEntityId,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { pipe, tap, switchMap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withTableRequest } from '@closing/shared/data-access';
import { Tree } from '@closing/shared/interfaces';
import { TreeService } from '../services/tree.service';

const selectId: SelectEntityId<Tree> = (tree) => tree.id ?? '';

export const TreeStore = signalStore(
  withState({ loading: false, error: '', total: 0 }),
  withEntities({ entity: type<Tree>(), collection: 'trees' }),
  withTableRequest({ name: 'trees' }),
  withMethods((store, service = inject(TreeService)) => ({
    getTrees: rxMethod<{
      page: number;
      size: number;
      sorts: string;
      filters: string;
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ page, size, sorts, filters }) =>
          service.fetch(page, size, sorts, filters).pipe(
            map((trees) => ({
              items: trees,
              total: trees.length,
            }))
          )
        ),
        tapResponse({
          next: (response) => {
            patchState(
              store,
              { loading: false, total: response.total },
              setEntities(response.items, {
                collection: 'trees',
                selectId,
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      store.getTrees({ page: 1, size: 10, sorts: '', filters: '' });
    },
  }))
);
