import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { User } from '../../users/entities/user.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    // Find all users by their IDs
    const members = await this.userRepository.findByIds(
      createTeamDto.memberIds
    );

    // Verify if all users were found
    if (members.length !== createTeamDto.memberIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    // Create new team instance
    const team = this.teamRepository.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
      members,
    });

    // Save the team
    return this.teamRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: ['members'],
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

    if (updateTeamDto.name) {
      team.name = updateTeamDto.name;
    }

    if (updateTeamDto.description !== undefined) {
      team.description = updateTeamDto.description;
    }

    return this.teamRepository.save(team);
  }

  async addMembers(id: string, memberIds: string[]): Promise<Team> {
    const team = await this.findOne(id);
    const newMembers = await this.userRepository.findByIds(memberIds);

    if (newMembers.length !== memberIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    // Add new members to existing ones
    team.members = [...team.members, ...newMembers];
    return this.teamRepository.save(team);
  }

  async removeMembers(id: string, memberIds: string[]): Promise<Team> {
    const team = await this.findOne(id);

    team.members = team.members.filter(
      (member) => !memberIds.includes(member.id)
    );
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }
}
