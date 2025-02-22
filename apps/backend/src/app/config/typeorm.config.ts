import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const runOptions: PostgresConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5434'),
  database: process.env.POSTGRES_DATABASE_NAME,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/src/db/migrations/*.js'],
};

const testOptions: PostgresConnectionOptions = {
  ...runOptions,
  entities: [__dirname + '/src/**/*.entity.ts'],
  synchronize: true,
  migrations: [__dirname + '/src/db/migrations/*.ts'],
  logging: 'all',
};

export default process.env.NODE_ENV === 'test' ? testOptions : runOptions;
