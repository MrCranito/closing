import { User } from '@closing/shared/interfaces';
import { Customer } from '@closing/shared/interfaces';

export interface Session {
  id: string;
  treeId: string;
  treeName: string;
  user?: User;
  customer?: Customer;
  status: SessionStatus;
  createdAt: Date;
  modifiedAt: Date;
}

export enum SessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
