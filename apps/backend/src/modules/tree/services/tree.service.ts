import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, FilterQuery } from 'mongoose';
import { Tree } from '../schemas/tree.schema';
import { User } from '../../users/entities/user.entity';
import { TreeStatus, TreePermissionLevel } from '../entities/tree.entity';
import { Request } from 'express';

@Injectable()
export class TreeService {
  constructor(@InjectModel(Tree.name) private treeModel: Model<Tree>) {}

  async getMany(req: Request, user: User): Promise<Tree[]> {
    const { page, limit, sort, filter } = req.query || {};

    let query = this.treeModel.find({
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
      query = query.find(filter as FilterQuery<Tree>);
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

  async getOne(req: Request, user: User): Promise<Tree> {
    const id = req.params?.id;
    const tree = await this.treeModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (!tree) {
      throw new Error('Tree not found');
    }

    return tree;
  }

  async createOne(req: Request, dto: Partial<Tree>, user: User): Promise<Tree> {
    const now = new Date();
    const processedRootNode = this.processNode(dto.rootNode, user.id);

    // Create permissions array with user and team permissions
    const permissions = [
      {
        entityType: 'USER',
        entityId: user.id,
        level: TreePermissionLevel.FULL, // Full access for creator
        grandedAt: now,
        grandedBy: user.id,
        createdBy: user.id,
      },
      // Add permissions for each team the user belongs to
      ...(user.teamIds || []).map((teamId) => ({
        entityType: 'TEAM',
        entityId: teamId,
        level: TreePermissionLevel.VIEW, // Default team access level
        grandedAt: now,
        grandedBy: user.id,
        createdBy: user.id,
      })),
    ];

    const tree = new this.treeModel({
      ...dto,
      createdBy: user.id,
      updatedBy: user.id,
      status: TreeStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
      rootNode: processedRootNode,
      permissions,
    });
    return tree.save();
  }

  async updateOne(req: Request, dto: Partial<Tree>, user: User): Promise<Tree> {
    const id = req.params?.id;
    const tree = await this.treeModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (!tree) {
      throw new Error('Tree not found');
    }

    const now = new Date();
    const processedRootNode = dto.rootNode
      ? this.processNode(dto.rootNode, user.id, true)
      : tree.rootNode;

    Object.assign(tree, {
      ...dto,
      updatedBy: user.id,
      updatedAt: now,
      rootNode: processedRootNode,
    });

    return tree.save();
  }

  async deleteOne(req: Request, user: User): Promise<void> {
    const id = req.params?.id;
    const result = await this.treeModel.deleteOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user.id }],
    });

    if (result.deletedCount === 0) {
      throw new Error('Tree not found');
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
