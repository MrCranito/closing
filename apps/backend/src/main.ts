/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';
import { IAppConfig } from './app/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  const appConfig = configService.get<IAppConfig>('app');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.startAllMicroservices();

  await app.listen(appConfig.port);

  Logger.log(
    `🚀 Closing Backend Application is running on (${appConfig.version})listening on port : ${appConfig.port}`
  );
}

bootstrap();
