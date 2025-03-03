import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './../services/user.service';
import { User } from '../entities/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { Crud, CrudController, CrudRequest } from '@nestjsx/crud';

@Crud({
  model: {
    type: User,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 100,
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
    filter: {
      email: { $ne: null },
    },
  },
})
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(public service: UsersService) {}

  @Post()
  createOne(
    @Body() body: CreateUserDto,
    @Req() req: CrudRequest
  ): Promise<User> {
    return this.service.createOne(req, body);
  }

  @Patch(':id')
  update(@Param() params: any, @Body() body: UpdateUserDto): Promise<User> {
    return this.service.updateOne(params.id, body);
  }

  @Delete(':id')
  remove(@Param() params: any): Promise<void> {
    return this.service.deleteOne(params.id);
  }
}
