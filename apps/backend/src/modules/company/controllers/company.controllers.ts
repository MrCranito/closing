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
import { Company } from '../entities/company.entity';
import { DeleteResult } from 'typeorm';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { CompanyService } from '../services/company.service';

@Controller('company')
export class CompanyController {
  constructor(private service: CompanyService) {}

  @Post()
  createOne(@Body() body: CreateCompanyDto): Promise<Company> {
    return this.service.createOne(body);
  }

  @Get()
  find(@Query() query: any): Promise<Company[]> {
    return this.service.find(query);
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<Company> {
    return this.service.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: any,
    @Body() body: UpdateCompanyDto
  ): Promise<Company> {
    return this.service.updateOne(params.id, body);
  }

  @Delete(':id')
  remove(@Param() params: any): Promise<DeleteResult> {
    return this.service.deleteOne(params.id);
  }
}
