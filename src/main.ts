import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';

import { Environment } from './core/env/infrastructure/env.schema.js';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Environment>);

  app.setGlobalPrefix('api');

  await app.listen(config.getOrThrow<number>('PORT'));
}

await bootstrap();
