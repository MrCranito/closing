import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Not } from 'typeorm';
import { Session, SessionStatus } from '../entities/session.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private repository: Repository<Session>
  ) {}

  async getMany(req, user: User): Promise<Session[]> {
    const { page = 1, size = 10, sort, filter = {} } = req.query || {};

    const where: FindOptionsWhere<Session> = {
      userId: user.id,
      ...filter,
    };

    // Don't show archived sessions by default unless explicitly requested
    if (!filter.status) {
      where.status = Not(SessionStatus.ARCHIVED);
    }

    const sessions = await this.repository.find({
      where,
      skip: (page - 1) * size,
      take: size,
      order: sort || { createdAt: 'DESC' },
      relations: ['user', 'customer'],
    });

    return sessions;
  }

  async getOne(id: string, user: User): Promise<Session> {
    const session = await this.repository.findOne({
      where: { id, userId: user.id },
      relations: ['user', 'customer'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID "${id}" not found`);
    }

    return session;
  }

  async createOne(data: Partial<Session>, user: User): Promise<Session> {
    const session = this.repository.create({
      ...data,
      userId: user.id,
      status: SessionStatus.ACTIVE,
    });

    return this.repository.save(session);
  }

  async updateOne(
    id: string,
    data: Partial<Session>,
    user: User
  ): Promise<Session> {
    const session = await this.getOne(id, user);

    // Don't allow updating certain fields
    delete data.id;
    delete data.userId;
    delete data.createdAt;

    Object.assign(session, data);

    return this.repository.save(session);
  }

  async deleteOne(id: string, user: User): Promise<void> {
    const session = await this.getOne(id, user);
    await this.repository.remove(session);
  }

  async archiveOne(id: string, user: User): Promise<Session> {
    const session = await this.getOne(id, user);

    session.status = SessionStatus.ARCHIVED;
    session.archivedAt = new Date();

    return this.repository.save(session);
  }

  async getActiveSession(user: User): Promise<Session | null> {
    return this.repository.findOne({
      where: {
        userId: user.id,
        status: SessionStatus.ACTIVE,
      },
      relations: ['user'],
    });
  }
}
