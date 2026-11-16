import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'uuid';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';

import {
  REQUEST_CONTEXT,
  RequestContext,
} from './application/ports/request-context.js';
import { ClsRequestContextAdapter } from './infrastructure/cls-request-context.adapter.js';
import {
  generateRequestId,
  RequestContextModule,
  setupRequestContext,
} from './request-context.module.js';

describe('RequestContextModule', () => {
  let requestContext: RequestContext;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [RequestContextModule],
    }).compile();

    requestContext = moduleRef.get<RequestContext>(REQUEST_CONTEXT);
  });

  it('should provide a RequestContext adapter', () => {
    expect(requestContext).toBeDefined();
    expect(requestContext).toBeInstanceOf(ClsRequestContextAdapter);
  });

  it('should preserve a valid request id', () => {
    const requestId = 'd214981e-d735-4789-87c9-24c6ca74e04c';
    const request = {
      get: vi.fn().mockReturnValue(requestId),
    } as unknown as Request;

    expect(generateRequestId(request)).toBe(requestId);
  });

  it('should generate an id when the request id is invalid', () => {
    const request = {
      get: vi.fn().mockReturnValue('invalid-id'),
    } as unknown as Request;

    const result = generateRequestId(request);

    expect(result).not.toBe('invalid-id');
    expect(validate(result)).toBe(true);
  });

  it('should generate an id when no request id exists', () => {
    const request = {
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as Request;

    expect(validate(generateRequestId(request))).toBe(true);
  });

  it('should configure the request context', () => {
    const cls = {
      set: vi.fn(),
    } as unknown as ClsService;

    const request = {
      ip: '127.0.0.0',
    } as Request;

    setupRequestContext(cls, request);

    expect(cls.set).toHaveBeenNthCalledWith(1, 'ip', '127.0.0.0');
    expect(cls.set).toHaveBeenNthCalledWith(2, 'actor', undefined);
  });
});
