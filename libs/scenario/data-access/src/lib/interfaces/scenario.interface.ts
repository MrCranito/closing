import { User } from '@closing/shared/interfaces';
import { Customer } from '@closing/shared/interfaces';

export interface Scenario {
  _id: string;
  name: string;
  description?: string;
  diagramId: string;
  diagramName: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ScenarioStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
