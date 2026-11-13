import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvValidationSchema } from './config/env.schema.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: EnvValidationSchema,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
