import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import typeormConfig from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
