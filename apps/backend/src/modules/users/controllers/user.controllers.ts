import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './../services/user.service';
import { User } from '../entities/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post()
  createOne(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createOne(body);
  }

  @Get()
  find(@Query() query: any): Promise<User[]> {
    return this.usersService.find(query);
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<User> {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(params.id, body);
  }

  @Delete(':id')
  remove(@Param() params: any): Promise<DeleteResult> {
    return this.usersService.deleteOne(params.id);
  }
}
