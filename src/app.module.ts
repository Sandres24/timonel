import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvironment } from './infrastructure/env/env.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { RequestContextModule } from './infrastructure/request-context/request-context.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironment,
    }),
    DatabaseModule,
    RequestContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
