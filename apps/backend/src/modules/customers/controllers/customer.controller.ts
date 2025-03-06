import { Controller, Get, Post, Patch, Delete, Request } from '@nestjs/common';
import { CustomersService } from '../services/customer.service';
import { Customer } from '../entities/customer.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMany(@Request() req): Promise<Customer[]> {
    return this.customersService.getMany(req, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(@Request() req): Promise<Customer> {
    return this.customersService.createOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOne(@Request() req): Promise<Customer> {
    return this.customersService.updateOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Request() req): Promise<Customer> {
    return this.customersService.deleteOne(req.user);
  }
}
