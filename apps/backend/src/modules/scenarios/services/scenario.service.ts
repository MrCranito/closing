import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Not } from 'typeorm';
import { Scenario, ScenarioStatus } from '../entities/scenario.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ScenariosService {
  constructor(
    @InjectRepository(Scenario)
    private repository: Repository<Scenario>
  ) {}

  async getMany(req, user: User): Promise<Scenario[]> {
    const { page = 1, size = 10, sort, filter = {} } = req.query || {};

    const where: FindOptionsWhere<Scenario> = {
      userId: user.id,
      ...filter,
    };

    // Don't show archived scenarios by default unless explicitly requested
    if (!filter.status) {
      where.status = Not(ScenarioStatus.ARCHIVED);
    }

    const scenarios = await this.repository.find({
      where,
      skip: (page - 1) * size,
      take: size,
      order: sort || { createdAt: 'DESC' },
      relations: ['user', 'customer'],
    });

    return scenarios;
  }

  async getOne(id: string, user: User): Promise<Scenario> {
    const scenario = await this.repository.findOne({
      where: { id, userId: user.id },
      relations: ['user', 'customer'],
    });

    if (!scenario) {
      throw new NotFoundException(`Scenario with ID "${id}" not found`);
    }

    return scenario;
  }

  async createOne(data: Partial<Scenario>, user: User): Promise<Scenario> {
    const scenario = this.repository.create({
      ...data,
      userId: user.id,
      status: ScenarioStatus.ACTIVE,
    });

    return this.repository.save(scenario);
  }

  async updateOne(
    id: string,
    data: Partial<Scenario>,
    user: User
  ): Promise<Scenario> {
    const scenario = await this.getOne(id, user);

    // Don't allow updating certain fields
    delete data.id;
    delete data.userId;
    delete data.createdAt;

    Object.assign(scenario, data);

    return this.repository.save(scenario);
  }

  async deleteOne(id: string, user: User): Promise<void> {
    const scenario = await this.getOne(id, user);
    await this.repository.remove(scenario);
  }

  async archiveOne(id: string, user: User): Promise<Scenario> {
    const scenario = await this.getOne(id, user);

    scenario.status = ScenarioStatus.ARCHIVED;
    scenario.archivedAt = new Date();

    return this.repository.save(scenario);
  }

  async getActiveScenario(user: User): Promise<Scenario | null> {
    return this.repository.findOne({
      where: {
        userId: user.id,
        status: ScenarioStatus.ACTIVE,
      },
      relations: ['user'],
    });
  }
}
