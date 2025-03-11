import { Controller, Get, Post, Patch, Delete, Request } from '@nestjs/common';
import { ScenariosService } from '../services/scenario.service';
import { Scenario } from '../entities/scenario.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('scenarios')
export class ScenarioController {
  constructor(public service: ScenariosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMany(@Request() req): Promise<Scenario[]> {
    return this.service.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Request() req): Promise<Scenario> {
    return this.service.createOne(req.body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOne(@Request() req): Promise<Scenario> {
    return this.service.updateOne(req.params.id, req.body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Request() req): Promise<void> {
    return this.service.deleteOne(req.params.id, req.user);
  }
}
