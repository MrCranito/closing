import { InjectionToken } from '@angular/core';
import { Environment } from './environment.interface';

export const ENVIRONMENT: InjectionToken<Environment> =
  new InjectionToken<Environment>('ENVIRONMENT');
