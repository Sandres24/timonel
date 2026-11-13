import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseOptions } from './data-source.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions),
  ],
})
export class DatabaseModule {}
