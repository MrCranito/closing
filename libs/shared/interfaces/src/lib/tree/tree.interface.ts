import { TemplateRef } from '@angular/core';
import { User } from '../user/user.interface';

export interface Tree {
  _id?: string;
  name: string;
  description?: string;
  status: TreeStatus;
  permissions?: TreePermissions[];
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  archivedBy?: User;
  icon?: string;
  rootNode: TreeRootNode;
}

export interface TreePermissions {
  entityId: string;
  entityType: string;
  level: TreePermissionLevel;
  grandedAt: Date;
  grandedBy: User;
}

export enum TreePermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
}

export enum TreeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface TreeRootNode {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  archivedBy?: User;
  children?: TreeNode[];
}

export interface TreeNode {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  archivedBy?: User;
  widgets?: Widget[];
  children?: TreeNode[];
}

export interface Widget {
  name: string;
  description?: string;
  type: string;
  template: TemplateRef<any>;
  data: Record<string, any>;
}
