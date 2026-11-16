import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { EnvModule } from '../env/env.module.js';
import { Environment } from '../env/infrastructure/env.schema.js';
import { createDatabaseOptions } from './infrastructure/database.options.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      useFactory: (config: ConfigService<Environment>) => {
        return createDatabaseOptions({
          NODE_ENV: config.getOrThrow('NODE_ENV'),
          PORT: config.getOrThrow('PORT'),
          DB_PASSWORD: config.getOrThrow('DB_PASSWORD'),
          DB_USER: config.getOrThrow('DB_USER'),
          DB_NAME: config.getOrThrow('DB_NAME'),
          DB_HOST: config.getOrThrow('DB_HOST'),
          DB_PORT: config.getOrThrow('DB_PORT'),
          REDIS_PORT: config.getOrThrow('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
