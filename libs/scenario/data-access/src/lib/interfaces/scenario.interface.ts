import { User } from '@closing/shared/interfaces';
import { Customer } from '@closing/shared/interfaces';

export interface Scenario {
  id: string;
  treeId: string;
  treeName: string;
  user?: User;
  customer?: Customer;
  status: ScenarioStatus;
  createdAt: Date;
  modifiedAt: Date;
}

export enum ScenarioStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
