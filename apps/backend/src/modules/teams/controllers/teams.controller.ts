import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { TeamMembersDto } from '../dto/team-members.dto';
import { Team } from '../entities/team.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Post(':id/members')
  async addMembers(
    @Param('id') id: string,
    @Body() teamMembersDto: TeamMembersDto
  ): Promise<Team> {
    return this.teamsService.addMembers(id, teamMembersDto.memberIds);
  }

  @Delete(':id/members')
  async removeMembers(
    @Param('id') id: string,
    @Body() teamMembersDto: TeamMembersDto
  ): Promise<Team> {
    return this.teamsService.removeMembers(id, teamMembersDto.memberIds);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.teamsService.remove(id);
  }
}
