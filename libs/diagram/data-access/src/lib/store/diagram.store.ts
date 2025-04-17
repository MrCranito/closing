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
import { Diagram } from '@closing/shared/interfaces';
import { DiagramService } from '../services/diagram.service';

export const DiagramStore = signalStore(
  withState({ loading: false, error: '', total: 0, selectedDiagram: null }),
  withEntities({
    entity: type<Diagram>(),
    collection: 'diagrams',
  }),
  withTableRequest({ name: 'diagrams' }),
  withMethods((store, service = inject(DiagramService)) => ({
    getDiagrams: rxMethod<{
      page: number;
      size: number;
      sorts: string;
      filters: string;
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ page, size, sorts, filters }) =>
          service.fetch(page, size, sorts, filters).pipe(
            map((diagrams) => ({
              items: diagrams,
              total: diagrams.length,
            }))
          )
        ),
        tapResponse({
          next: (response) => {
            console.log(response);
            patchState(
              store,
              { loading: false, total: response.total },
              addEntities(response.items, {
                collection: 'diagrams',
                selectId: (diagram) => diagram._id ?? '',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    createDiagram: rxMethod<Partial<Diagram>>(
      pipe(
        switchMap((diagram) => service.create(diagram)),
        tapResponse({
          next: (response) => {
            patchState(
              store,
              {
                loading: false,
              },
              addEntity(response, {
                collection: 'diagrams',
                selectId: (diagram) => diagram._id ?? '',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    updateDiagram: rxMethod<Diagram>(
      pipe(
        switchMap((diagram) => service.update(diagram)),
        tapResponse({
          next: (response) => {
            patchState(
              store,
              {
                loading: false,
              },
              setEntity(response, {
                collection: 'diagrams',
                selectId: (diagram) => diagram._id ?? '',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    deleteDiagram: rxMethod<string>(
      pipe(
        switchMap((id) => service.delete(id)),
        tapResponse({
          next: (id) => {
            patchState(
              store,
              { loading: false },
              removeEntity(id, {
                collection: 'diagrams',
              })
            );
          },
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
    getDiagramById: rxMethod<string>(
      pipe(
        switchMap((id) => service.getById(id)),
        tapResponse({
          next: (response) => {
            if (
              store
                .diagramsEntities()
                .find((diagram) => diagram._id === response._id)
            ) {
              patchState(
                store,
                { loading: false },
                setEntity(response, {
                  collection: 'diagrams',
                  selectId: (diagram) => diagram._id ?? '',
                })
              );
            } else {
              patchState(
                store,
                { loading: false },
                addEntity(response, {
                  collection: 'diagrams',
                  selectId: (diagram) => diagram._id ?? '',
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
      store.getDiagrams({ page: 1, size: 10, sorts: '', filters: '' });
    },
  }))
);
