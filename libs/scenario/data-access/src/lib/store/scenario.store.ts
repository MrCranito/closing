import { Scenario } from '../interfaces/scenario.interface';
import { ScenarioService } from '../services/scenario.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  signalStore,
  withState,
  withMethods,
  withHooks,
  type,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { pipe, tap, switchMap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { withTableRequest } from '@closing/shared/data-access';
import { addEntities, withEntities } from '@ngrx/signals/entities';

export const ScenarioStore = signalStore(
  withState({ loading: false, error: '', total: 0 }),
  withEntities({ entity: type<Scenario>(), collection: 'scenarios' }),
  withTableRequest({ name: 'scenario' }),
  withMethods((store, service = inject(ScenarioService)) => ({
    getScenarios: rxMethod<{
      page: number;
      size: number;
      sorts: string;
      filters: string;
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ page, size, sorts, filters }) =>
          service.fetch(page, size, sorts, filters).pipe(
            map((response) => ({
              total: response.length,
              items: response,
            }))
          )
        ),
        tapResponse({
          next: (response) =>
            patchState(
              store,
              { loading: false, total: response.total },
              addEntities(response.items, {
                collection: 'scenarios',
                selectId: (scenario) => scenario._id,
              })
            ),
          error: (error) =>
            patchState(store, { error: error as string, loading: false }),
        })
      )
    ),
  })),

  withHooks((store) => ({
    onInit: () => {
      store.getScenarios({ page: 1, size: 10, sorts: '', filters: '' });
    },
  }))
);
