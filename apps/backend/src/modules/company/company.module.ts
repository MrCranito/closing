import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { CompanyController } from './controllers/company.controllers';
import { CompanyService } from './services/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
