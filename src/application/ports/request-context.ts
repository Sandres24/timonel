export interface RequestContext {
  getRequestId(): string | undefined;
  getIp(): string | undefined;
}

export const REQUEST_CONTEXT = Symbol('REQUEST_CONTEXT');
