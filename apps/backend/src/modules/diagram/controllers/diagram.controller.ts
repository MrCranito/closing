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
import { DiagramService } from '../services/diagram.service';
import { Diagram } from '../schemas/diagram.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Diagram,
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
@Controller('diagram')
@UseGuards(JwtAuthGuard)
export class DiagramController {
  constructor(private readonly service: DiagramService) {}

  @Get()
  async getMany(@Request() req): Promise<Diagram[]> {
    return this.service.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req): Promise<Diagram> {
    return this.service.getOne(req, req.user);
  }

  @Post()
  async createOne(
    @Body() createDiagramDto: Partial<Diagram>,
    @Request() req
  ): Promise<Diagram> {
    return this.service.createOne(req, createDiagramDto, req.user);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateDiagramDto: Partial<Diagram>,
    @Request() req
  ): Promise<Diagram> {
    return this.service.updateOne(req, updateDiagramDto, req.user);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Request() req): Promise<void> {
    return this.service.deleteOne(req, req.user);
  }
}
