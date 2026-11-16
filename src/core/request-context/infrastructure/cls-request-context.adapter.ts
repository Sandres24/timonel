import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import {
  RequestActor,
  RequestContext,
} from '../application/ports/request-context.js';

@Injectable()
export class ClsRequestContextAdapter implements RequestContext {
  constructor(private readonly cls: ClsService) {}

  getId(): string {
    return this.cls.getId();
  }

  getIp(): string | undefined {
    return this.cls.get<string>('ip');
  }

  getActor(): RequestActor | undefined {
    return this.cls.get<RequestActor>('actor');
  }

  setActor(actor: RequestActor): void {
    this.cls.set('actor', actor);
  }
}
