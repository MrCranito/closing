import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AddUserToCompanyDto } from '../dto/add-user-to-company.dto';
import { Company } from '../entities/company.entity';
import { User } from '../../users/entities/user.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(
    @Request() req,
    @Body() createCompanyDto: CreateCompanyDto
  ): Promise<Company> {
    return this.companyService.createCompany(req.user.id, createCompanyDto);
  }

  @Get('my-company')
  async getMyCompany(@Request() req): Promise<Company> {
    return this.companyService.getCompanyByOwner(req.user.id);
  }

  @Put(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<Company> {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Post(':id/users')
  async addUserToCompany(
    @Param('id') id: string,
    @Body() addUserDto: AddUserToCompanyDto
  ): Promise<User> {
    return this.companyService.addUserToCompany(id, addUserDto);
  }

  @Delete(':companyId/users/:userId')
  async removeUserFromCompany(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string
  ): Promise<void> {
    return this.companyService.removeUserFromCompany(companyId, userId);
  }

  @Get(':id/users')
  async getCompanyUsers(@Param('id') id: string): Promise<User[]> {
    return this.companyService.getCompanyUsers(id);
  }

  @Post(':id/upgrade-subscription')
  async upgradeSubscription(@Param('id') id: string): Promise<Company> {
    return this.companyService.upgradeCompanySubscription(id);
  }
}
