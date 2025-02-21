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
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { isPublic } from './../.../../../../shared/decorators/ispublic.decorator';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get(':id')
  get(@Param() params: any): Promise<User> {
    return this.usersService.findOne(params.id);
  }

  @Get()
  find(@Query() query: any): Promise<User> {
    return this.usersService.findOne(query);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(params.id, body);
  }

  @isPublic()
  @Post()
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }

  @Delete(':id')
  remove(@Param() params: any): Promise<DeleteResult> {
    return this.usersService.removeUser(params.id);
  }

  @isPublic()
  @Post('confirm-email')
  confirmEmail(@Query() query: any): Promise<User> {
    return this.usersService.updateEmailIsConfirmed(query.email);
  }

  @isPublic()
  @Post('send-reset-password')
  resetPassword(@Body() body: any): Promise<boolean> {
    return this.usersService.sendPasswordResetEmail(body.email);
  }

  @isPublic()
  @Post('reset-password')
  resetPasswordWithToken(@Query() query: any, @Body() body: any): Promise<any> {
    return this.usersService.resetPasswordWithToken(query.token, body.password);
  }
}
