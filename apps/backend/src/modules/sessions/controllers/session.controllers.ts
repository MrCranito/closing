import { Controller, Get, Post, Patch, Delete, Request } from '@nestjs/common';
import { SessionsService } from '../services/session.service';
import { Session } from '../entities/session.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('sessions')
export class SessionController {
  constructor(public service: SessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMany(@Request() req): Promise<Session[]> {
    return this.service.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Request() req): Promise<Session> {
    return this.service.createOne(req.body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOne(@Request() req): Promise<Session> {
    return this.service.updateOne(req.params.id, req.body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Request() req): Promise<void> {
    return this.service.deleteOne(req.params.id, req.user);
  }
}
