import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from './config/app.config';
import { AuthModule } from '../modules/auth/auth.module';
import { CompanyModule } from '../modules/company/company.module';
import { DiagramModule } from '../modules/diagram/diagram.module';
import { CustomersModule } from '../modules/customers/customer.module';
import { ScenariosModule } from '../modules/scenarios/scenarios.module';

const typeOrmModuleConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'api_closing_pg',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE_NAME || 'postgres',
  username: process.env.POSTGRES_USERNAME || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  entities:
    process.env.NODE_ENV === 'build'
      ? ['dist/**/*.entity.js']
      : [__dirname + '/src/**/*.entity.ts'],
  migrations:
    process.env.NODE_ENV === 'build'
      ? ['dist/apps/backend/src/migrations/*.js']
      : [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: true,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRoot(typeOrmModuleConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get(
          'MONGO_INITDB_ROOT_USERNAME'
        )}:${configService.get(
          'MONGO_INITDB_ROOT_PASSWORD'
        )}@${configService.get('MONGO_HOST')}:${configService.get(
          'MONGO_PORT'
        )}/${configService.get(
          'MONGO_INITDB_DATABASE'
        )}?authSource=admin&directConnection=true`,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CompanyModule,
    DiagramModule,
    CustomersModule,
    ScenariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
