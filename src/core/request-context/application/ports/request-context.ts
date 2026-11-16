export interface RequestActor {
  id: string;
  role: string;
}

export interface RequestContext {
  getId(): string;
  getIp(): string | undefined;
  getActor(): RequestActor | undefined;
  setActor(actor: RequestActor): void;
}

export const REQUEST_CONTEXT = Symbol('REQUEST_CONTEXT');
