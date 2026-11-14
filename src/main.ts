import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module.js';
import type { Environment } from './infrastructure/env/env.schema.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Environment>);

  await app.listen(config.getOrThrow<number>('PORT'));
}
await bootstrap();
