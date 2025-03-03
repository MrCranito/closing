import { User } from '@closing/shared/interfaces';
import { Client } from '@closing/shared/interfaces';
import { TreeNode } from '@closing/shared/interfaces';

export interface Session {
  id: string;
  tree?: TreeNode;
  user?: User;
  client?: Client;
  status: SessionStatus;
  createdAt: Date;
  modifiedAt: Date;
}

export enum SessionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
