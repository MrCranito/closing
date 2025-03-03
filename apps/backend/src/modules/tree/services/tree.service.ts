import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Tree } from '../schemas/tree.schema';
import { CrudRequest } from '@nestjsx/crud';
import { User } from '../../users/entities/user.entity';
import { TreeStatus } from '../entities/tree.entity';

@Injectable()
export class TreeService {
  constructor(@InjectModel(Tree.name) private treeModel: Model<Tree>) {}

  async getMany(req: CrudRequest, user: User): Promise<Tree[]> {
    const { page, limit, sort, filter } = req.parsed;

    let query = this.treeModel.find({
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user }],
    });

    // Apply filters
    if (filter && filter.length > 0) {
      const filterConditions = filter.map((f) => ({
        [f.field]: f.value,
      }));
      query = query.find({ $and: filterConditions });
    }

    // Apply sorting
    if (sort && sort.length > 0) {
      const sortConditions: Record<string, SortOrder> = {};
      sort.forEach((s) => {
        sortConditions[s.field] = s.order === 'DESC' ? -1 : 1;
      });
      query = query.sort(sortConditions);
    }

    // Apply pagination
    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    return query.exec();
  }

  async getOne(req: CrudRequest, user: User): Promise<Tree> {
    const id = req.parsed.paramsFilter[0].value;
    const tree = await this.treeModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user }],
    });

    if (!tree) {
      throw new Error('Tree not found');
    }

    return tree;
  }

  async createOne(
    req: CrudRequest,
    dto: Partial<Tree>,
    user: User
  ): Promise<Tree> {
    const tree = new this.treeModel({
      ...dto,
      createdBy: user,
      updatedBy: user,
      status: TreeStatus.ACTIVE,
    });
    return tree.save();
  }

  async updateOne(
    req: CrudRequest,
    dto: Partial<Tree>,
    user: User
  ): Promise<Tree> {
    const id = req.parsed.paramsFilter[0].value;
    const tree = await this.treeModel.findOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user }],
    });

    if (!tree) {
      throw new Error('Tree not found');
    }

    Object.assign(tree, {
      ...dto,
      updatedBy: user,
    });

    return tree.save();
  }

  async deleteOne(req: CrudRequest, user: User): Promise<void> {
    const id = req.parsed.paramsFilter[0].value;
    const result = await this.treeModel.deleteOne({
      _id: id,
      $or: [{ 'permissions.entityId': user.id }, { createdBy: user }],
    });

    if (result.deletedCount === 0) {
      throw new Error('Tree not found');
    }
  }
}
