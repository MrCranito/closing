import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controllers';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { HashServiceHelper } from './../../shared/helpers/hash.helper';
import { JwtAppModule } from '../jwt/jwt.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtAppModule, EmailModule],
  providers: [
    UserService,
    HashServiceHelper,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
