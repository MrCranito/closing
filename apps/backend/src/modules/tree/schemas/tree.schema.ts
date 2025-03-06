import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { TreePermissionLevel, TreeStatus } from '../entities/tree.entity';
@Schema({ timestamps: true })
export class TreePermissions {
  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true, enum: TreePermissionLevel })
  level: TreePermissionLevel;

  @Prop({ required: true })
  grandedAt: Date;

  @Prop({ required: true })
  grandedBy: string;

  @Prop({ required: true })
  createdBy: string;
}

@Schema({ timestamps: true })
export class Widget {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Object })
  data: Record<string, any>;
}

@Schema({ timestamps: true })
export class TreeNode {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Date })
  archivedAt?: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop()
  archivedBy?: string;

  @Prop({ type: [Widget] })
  widgets: Widget[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  children: TreeNode[];
}

@Schema({ timestamps: true })
export class Tree extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: TreeStatus, default: TreeStatus.ACTIVE })
  status: TreeStatus;

  @Prop({ type: [{ type: TreePermissions }] })
  permissions: TreePermissions[];

  @Prop({ type: Date })
  archivedAt?: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  updatedBy: string;

  @Prop()
  archivedBy?: string;

  @Prop()
  icon?: string;

  @Prop({ type: TreeNode, required: true })
  rootNode: TreeNode;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
