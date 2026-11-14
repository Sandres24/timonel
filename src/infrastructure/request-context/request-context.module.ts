import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v7 as uuidv7 } from 'uuid';
import type { Request } from 'express';

import { REQUEST_CONTEXT } from '../../application/ports/request-context.js';
import { ClsRequestContextAdapter } from './cls-request-context.adapter.js';

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (request: Request): string =>
          request.get('X-Request-Id') ?? uuidv7(),
        setup: (cls, request: Request) => {
          cls.set('ip', request.ip);
        },
      },
    }),
  ],
  providers: [
    {
      provide: REQUEST_CONTEXT,
      useClass: ClsRequestContextAdapter,
    },
  ],
  exports: [REQUEST_CONTEXT],
})
export class RequestContextModule {}
