import { Observable, pipe, Unsubscribable, tap } from 'rxjs';
import { Signal, Injector, computed } from '@angular/core';
import { TableRequest, RequestWithArguments } from '@closing/shared/interfaces';
import { HttpParams } from '@angular/common/http';
import {
  EmptyFeatureResult,
  patchState,
  signalStoreFeature,
  SignalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { RequestUtil } from '@closing/shared/utils';

type RxMethod<Input> = ((
  input: Input | Signal<Input> | Observable<Input>,
  config?: {
    injector?: Injector;
  }
) => Unsubscribable) &
  Unsubscribable;

export interface RequestState {
  request: TableRequest;
}

type NamedRequestState<RequestName extends string> = {
  [K in keyof RequestState as `${RequestName}${Capitalize<K>}`]: RequestState[K];
};

type RequestComputed = {
  paramsRsql: Signal<HttpParams | undefined>;
};

type NamedRequestComputed<RequestName extends string> = {
  [K in keyof RequestState as `${RequestName}ParamsRsql`]: Signal<TableRequest>;
};

type ChangeRequest = {
  changeRequest: RxMethod<RequestWithArguments>;
};

type NamedChangeRequest<RequestName extends string> = {
  [K in keyof RequestState as `${RequestName}ChangeRequest`]: RxMethod<RequestWithArguments>;
};

export function withTableRequest<T extends string | undefined = undefined>(
  config: {
    init?: Partial<TableRequest>;
    name?: T;
  } = {}
) {
  const requestKey = config?.name ? `${config.name}Request` : 'request';
  const requestParameterslKey = config?.name
    ? `${config.name}ParamsRsql`
    : 'paramsRsql';
  const changeMethodKey = config?.name
    ? `${config.name}ChangeRequest`
    : 'changeRequest';

  const initValue: TableRequest = {
    sorts: [],
    size: 10,
    page: 0,
    filters: [],
    ...config.init,
  };

  return signalStoreFeature(
    withState({ [requestKey]: initValue }),
    withComputed((store: Record<string, Signal<unknown>>) => ({
      [requestParameterslKey]: computed((): HttpParams | undefined => {
        const { sorts, size, page, filters } = store[
          requestKey
        ]() as unknown as TableRequest;

        return RequestUtil.toRsql({
          sorts,
          size,
          page,
          filters,
        });
      }),
    })),
    withMethods((store) => ({
      [changeMethodKey]: rxMethod<RequestWithArguments>(
        pipe(
          tap((request?: RequestWithArguments) =>
            patchState(store, {
              [requestKey]: {
                ...(store as any)[requestKey](),
                ...request,
              },
            })
          )
        )
      ),
    }))
  ) as unknown as SignalStoreFeature<
    EmptyFeatureResult,
    T extends string
      ? {
          state: NamedRequestState<T>;
          computed: NamedRequestComputed<T>;
          methods: NamedChangeRequest<T>;
          props: {};
        }
      : {
          state: RequestState;
          computed: RequestComputed;
          methods: ChangeRequest;
          props: {};
        }
  >;
}
