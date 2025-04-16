import { TemplateRef } from '@angular/core';
import { User } from '../user/user.interface';

export interface Diagram {
  _id: string;
  name: string;
  description?: string;
  status: DiagramStatus;
  permissions?: DiagramPermissions[];
  createdAt: Date;
  updatedAt: Date;
  rootNode: DiagramRootNode;
}

export interface DiagramPermissions {
  userId: string;
  level: DiagramPermissionLevel;
}

export enum DiagramPermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
}

export enum DiagramStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface DiagramRootNode {
  _id: string;
  name: string;
  type: string;
  data?: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
  children?: DiagramNode[];
}

export interface DiagramNode {
  _id: string;
  name: string;
  type: string;
  data?: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
  children?: DiagramNode[];
}

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
  widgets?: NodeWidget[];
  actions?: NodeAction[];
  children?: TreeNode[];
  x?: number;
  y?: number;
}

export interface NodeWidget {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface NodeAction {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface Widget {
  name: string;
  description?: string;
  type: string;
  template: TemplateRef<any>;
  data: Record<string, any>;
}
