import { User } from '../user/user.interface';
import { TreeNode } from '../tree-node/tree-node.interface';

export interface Session {
  id: string;
  name: string;
  description?: string;
  treeNode: TreeNode;
  participants: User[];
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'completed' | 'scheduled';
  duration?: number; // in minutes
  notes?: string;
}
