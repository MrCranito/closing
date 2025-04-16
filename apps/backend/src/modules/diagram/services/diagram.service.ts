import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, FilterQuery } from 'mongoose';
import { Diagram } from '../schemas/diagram.schema';
import { User } from '../../users/entities/user.entity';
import {
  DiagramStatus,
  DiagramPermissionLevel,
} from '../entities/diagram.entity';
import { Request } from 'express';

@Injectable()
export class DiagramService {
  constructor(
    @InjectModel(Diagram.name) private diagramModel: Model<Diagram>
  ) {}

  async getMany(req: Request, user: User): Promise<Diagram[]> {
    const { page, limit, sort, filter } = req.query || {};

    let query = this.diagramModel.find({
      $or: [
        {
          'permissions.entityType': 'TEAM',
          'permissions.entityId': { $in: user.teamIds },
        },
        {
          'permissions.entityType': 'USER',
          'permissions.entityId': user.id,
        },
      ],
    });

    // Apply filters
    if (filter && Object.keys(filter).length > 0) {
      query = query.find(filter as FilterQuery<Diagram>);
    }

    // Apply sorting
    if (sort && Object.keys(sort).length > 0) {
      const sortConditions: Record<string, SortOrder> = {};
      Object.entries(sort).forEach(([field, order]) => {
        sortConditions[field] = order === 'DESC' ? -1 : 1;
      });
      query = query.sort(sortConditions);
    }

    // Apply pagination
    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));
    }

    return query.exec();
  }

  async getOne(req: Request, user: User): Promise<Diagram> {
    const id = req.params?.id;
    const diagram = await this.diagramModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (!diagram) {
      throw new Error('Diagram not found');
    }

    return diagram;
  }

  async createOne(
    req: Request,
    dto: Partial<Diagram>,
    user: User
  ): Promise<Diagram> {
    const now = new Date();
    const processedRootNode = this.processNode(dto.rootNode, user.id);

    // Create permissions array with user and team permissions
    const permissions = [
      {
        entityType: 'USER',
        entityId: user.id,
        level: DiagramPermissionLevel.FULL, // Full access for creator
        grandedAt: now,
        grandedBy: user.id,
        createdBy: user.id,
      },
      // Add permissions for each team the user belongs to
      ...(user.teamIds || []).map((teamId) => ({
        entityType: 'TEAM',
        entityId: teamId,
        level: DiagramPermissionLevel.VIEW, // Default team access level
        grandedAt: now,
        grandedBy: user.id,
        createdBy: user.id,
      })),
    ];

    const diagram = new this.diagramModel({
      ...dto,
      createdBy: user.id,
      updatedBy: user.id,
      status: DiagramStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
      rootNode: processedRootNode,
      permissions,
    });
    return diagram.save();
  }

  async updateOne(
    req: Request,
    dto: Partial<Diagram>,
    user: User
  ): Promise<Diagram> {
    const id = req.params?.id;
    const diagram = await this.diagramModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (!diagram) {
      throw new Error('Diagram not found');
    }

    const now = new Date();
    const processedRootNode = dto.rootNode
      ? this.processNode(dto.rootNode, user.id, true)
      : diagram.rootNode;

    Object.assign(diagram, {
      ...dto,
      updatedBy: user.id,
      updatedAt: now,
      rootNode: processedRootNode,
    });

    return diagram.save();
  }

  async deleteOne(req: Request, user: User): Promise<void> {
    const id = req.params?.id;
    const result = await this.diagramModel.deleteOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (result.deletedCount === 0) {
      throw new Error('Diagram not found');
    }
  }

  private processNode(
    node: any,
    userId: string,
    isUpdate: boolean = false
  ): any {
    const now = new Date();
    const processedNode = {
      ...node,
      createdBy: isUpdate ? node.createdBy : userId,
      updatedBy: userId,
      createdAt: isUpdate ? node.createdAt : now,
      updatedAt: now,
    };

    if (node.children && Array.isArray(node.children)) {
      processedNode.children = node.children.map((child: any) =>
        this.processNode(child, userId, isUpdate)
      );
    }

    return processedNode;
  }
}
