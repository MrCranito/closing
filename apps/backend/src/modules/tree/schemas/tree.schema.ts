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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  grandedBy: User;
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  archivedBy?: User;

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  archivedBy?: User;

  @Prop()
  icon?: string;

  @Prop({ type: TreeNode, required: true })
  rootNode: TreeNode;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
