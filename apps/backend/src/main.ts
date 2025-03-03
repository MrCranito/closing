import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { AppModule } from './app/app.module';
import { IAppConfig } from './app/config/app.config';

async function bootstrap() {
  console.log('🚀 Starting NestJS application...');

  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('✅ NestJS instance created.');

  const configService = app.get(ConfigService);
  console.log('✅ ConfigService retrieved.');

  const appConfig = configService.get<IAppConfig>('app');
  console.log(`✅ Retrieved app config: ${JSON.stringify(appConfig)}`);

  // Run migrations
  const dataSource = app.get(DataSource);
  try {
    console.log('🔄 Running database migrations...');
    await dataSource.runMigrations();
    console.log('✅ Database migrations completed successfully.');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  console.log(`✅ Global prefix set: ${globalPrefix}`);

  await app.startAllMicroservices();
  console.log('✅ Microservices started.');

  await app.listen(appConfig.port || 8080, '0.0.0.0');
  console.log(`✅ Listening on port: ${appConfig.port || 8080}`);
}
bootstrap();
