import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvSchema } from './infrastructure/env.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: EnvSchema,
    }),
  ],
  exports: [ConfigModule],
})
export class EnvModule {}
