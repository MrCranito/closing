import { TemplateRef } from '@angular/core';
import { User } from '../user/user.interface';

export interface Diagram {
  _id?: string;
  name: string;
  description?: string;
  status: DiagramStatus;
  permissions?: DiagramPermissions[];
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  archivedBy?: User;
  icon?: string;
  rootNode: DiagramRootNode;
}

export interface DiagramPermissions {
  entityId: string;
  entityType: string;
  level: DiagramPermissionLevel;
  grandedAt: Date;
  grandedBy: User;
}

export enum DiagramPermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
}

export enum DiagramStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface DiagramRootNode {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  archivedBy?: User;
  x: number;
  y: number;
  children?: DiagramNode[];
}

export interface DiagramNode {
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
  children?: DiagramNode[];
  x: number;
  y: number;
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
