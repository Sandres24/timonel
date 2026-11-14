import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { type RequestContext } from '../../application/ports/request-context.js';

@Injectable()
export class ClsRequestContextAdapter implements RequestContext {
  constructor(private readonly cls: ClsService) {}

  getRequestId(): string | undefined {
    return this.cls.getId();
  }

  getIp(): string | undefined {
    return this.cls.get<string>('ip');
  }
}
