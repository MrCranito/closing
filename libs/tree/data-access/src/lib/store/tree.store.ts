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
  addEntity,
  setEntity,
  removeEntity,
  addEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { pipe, tap, switchMap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withTableRequest } from '@closing/shared/data-access';
import { Tree } from '@closing/shared/interfaces';
import { TreeService } from '../services/tree.service';

export const TreeStore = signalStore(
  withState({ loading: false, error: '', total: 0, selectedTree: null }),
  withEntities({
    entity: type<Tree>(),
    collection: 'trees',
  }),
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
              addEntities(response.items, {
                collection: 'trees',
                selectId: (tree) => tree._id ?? '',
              })
            );

            console.log(store.treesEntities());
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    createTree: rxMethod<Partial<Tree>>(
      pipe(
        switchMap((tree) => service.create(tree)),
        tapResponse({
          next: (response) => {
            patchState(
              store,
              {
                loading: false,
              },
              addEntity(response, {
                collection: 'trees',
                selectId: (tree) => tree._id ?? '',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    updateTree: rxMethod<Tree>(
      pipe(
        switchMap((tree) => service.update(tree)),
        tapResponse({
          next: (response) => {
            patchState(
              store,
              {
                loading: false,
              },
              setEntity(response, {
                collection: 'trees',
                selectId: (tree) => tree._id ?? '',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    deleteTree: rxMethod<string>(
      pipe(
        switchMap((id) => service.delete(id)),
        tapResponse({
          next: (id) => {
            patchState(
              store,
              { loading: false },
              removeEntity(id, {
                collection: 'trees',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    getTreeById: rxMethod<string>(
      pipe(
        switchMap((id) => service.getById(id)),
        tapResponse({
          next: (response) => {
            if (
              store.treesEntities().find((tree) => tree._id === response._id)
            ) {
              patchState(
                store,
                { loading: false },
                setEntity(response, {
                  collection: 'trees',
                  selectId: (tree) => tree._id ?? '',
                })
              );
            } else {
              patchState(
                store,
                { loading: false },
                addEntity(response, {
                  collection: 'trees',
                  selectId: (tree) => tree._id ?? '',
                })
              );
            }
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
