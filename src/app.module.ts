import { Module } from '@nestjs/common';

import { EnvModule } from './core/env/env.module.js';
import { DatabaseModule } from './core/database/database.module.js';
import { RequestContextModule } from './core/request-context/request-context.module.js';

@Module({
  imports: [EnvModule, DatabaseModule, RequestContextModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
