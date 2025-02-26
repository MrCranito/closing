import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import typeormConfig from '../../typeorm.config';
import { AuthModule } from '../modules/auth/auth.module';
import { CompanyModule } from '../modules/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    AuthModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
