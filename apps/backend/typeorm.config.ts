import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const typeOrmConfig: DataSourceOptions = {
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

export default new DataSource(typeOrmConfig);
