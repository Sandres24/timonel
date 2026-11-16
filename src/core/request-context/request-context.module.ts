import { Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';
import { v4 as uuidv4, validate } from 'uuid';
import { Request } from 'express';

import { REQUEST_CONTEXT } from './application/ports/request-context.js';
import { ClsRequestContextAdapter } from './infrastructure/cls-request-context.adapter.js';

export function generateRequestId(request: Request): string {
  const requestId = request.get('X-Request-Id');
  const isValidRequestId = validate(requestId);

  if (requestId && isValidRequestId) return requestId;

  return uuidv4();
}

export function setupRequestContext(cls: ClsService, request: Request): void {
  cls.set('ip', request.ip);
  cls.set('actor', undefined);
}

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: generateRequestId,
        setup: setupRequestContext,
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
