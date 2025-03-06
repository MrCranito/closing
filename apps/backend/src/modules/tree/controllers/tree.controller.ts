import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TreeService } from '../services/tree.service';
import { Tree } from '../schemas/tree.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Tree,
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
  },
})
@Controller('tree')
@UseGuards(JwtAuthGuard)
export class TreeController {
  constructor(private readonly service: TreeService) {}

  @Get()
  async getMany(@Request() req): Promise<Tree[]> {
    return this.service.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req): Promise<Tree> {
    return this.service.getOne(req, req.user);
  }

  @Post()
  async createOne(
    @Body() createTreeDto: Partial<Tree>,
    @Request() req
  ): Promise<Tree> {
    return this.service.createOne(req, createTreeDto, req.user);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTreeDto: Partial<Tree>,
    @Request() req
  ): Promise<Tree> {
    return this.service.updateOne(req, updateTreeDto, req.user);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Request() req): Promise<void> {
    return this.service.deleteOne(req, req.user);
  }
}
