import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './controllers/customer.controller';
import { CustomersService } from './services/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomersService],
  controllers: [CustomerController],
  exports: [CustomersService],
})
export class CustomersModule {}
