import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseOptions } from './database.options.js';

@Module({
  imports: [TypeOrmModule.forRoot(databaseOptions)],
})
export class DatabaseModule {}
