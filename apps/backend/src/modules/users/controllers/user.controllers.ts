import { Controller, Get, Post, Patch, Delete, Request } from '@nestjs/common';
import { UsersService } from './../services/user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(public service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMany(@Request() req): Promise<User[]> {
    return this.service.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Request() req): Promise<User> {
    return this.service.createOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOne(@Request() req): Promise<User> {
    return this.service.updateOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Request() req): Promise<User> {
    return this.service.deleteOne(req.user);
  }
}
