import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  async getMany(req, user: User): Promise<User[]> {
    const { page, size, sort, filter } = req.query || {};

    const query = this.repository.find({
      skip: (page - 1) * size,
      take: size,
      order: sort,
      where: {
        ...filter,
        companyId: user.companyId,
      },
      relations: ['teams'],
    });

    return query;
  }

  async createOne(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async updateOne(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async deleteOne(user: User): Promise<User> {
    return this.repository.remove(user);
  }

  async getOne(user: User): Promise<User> {
    return this.repository.findOne({ where: { id: user.id } });
  }
}
