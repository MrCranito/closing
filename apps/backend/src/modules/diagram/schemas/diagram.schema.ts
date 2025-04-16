import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import {
  DiagramPermissionLevel,
  DiagramStatus,
} from '../entities/diagram.entity';

@Schema({ timestamps: true })
export class DiagramPermissions {
  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  entityType: string;

  @Prop({ required: true, enum: DiagramPermissionLevel })
  level: DiagramPermissionLevel;

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
export class DiagramNode {
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
  children: DiagramNode[];
}

@Schema({ timestamps: true })
export class Diagram extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: DiagramStatus, default: DiagramStatus.ACTIVE })
  status: DiagramStatus;

  @Prop({ type: [{ type: DiagramPermissions }] })
  permissions: DiagramPermissions[];

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

  @Prop({ type: DiagramNode, required: true })
  rootNode: DiagramNode;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const DiagramSchema = SchemaFactory.createForClass(Diagram);
