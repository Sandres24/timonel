import { ClsService } from 'nestjs-cls';

import { RequestActor } from '../application/ports/request-context.js';
import { ClsRequestContextAdapter } from './cls-request-context.adapter.js';

describe('ClsRequestContextAdapter', () => {
  let clsRequestContextAdapter: ClsRequestContextAdapter;
  let cls: ClsService;

  beforeEach(async () => {
    cls = {
      getId: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
    } as unknown as ClsService;

    clsRequestContextAdapter = new ClsRequestContextAdapter(cls);
  });

  it('should return the request id', () => {
    vi.spyOn(clsRequestContextAdapter, 'getId');

    clsRequestContextAdapter.getId();

    expect(clsRequestContextAdapter.getId).toHaveBeenCalledOnce();
    expect(cls.getId).toHaveBeenCalledOnce();
  });

  it('should return the user IP', () => {
    vi.spyOn(clsRequestContextAdapter, 'getIp');

    clsRequestContextAdapter.getIp();

    expect(clsRequestContextAdapter.getIp).toHaveBeenCalledOnce();
    expect(cls.get).toHaveBeenCalledOnce();
  });

  it('should return the actor', () => {
    vi.spyOn(clsRequestContextAdapter, 'getActor');

    clsRequestContextAdapter.getActor();

    expect(clsRequestContextAdapter.getActor).toHaveBeenCalledOnce();
    expect(cls.get).toHaveBeenCalledOnce();
  });

  it('should set the actor', () => {
    const actor: RequestActor = { id: '1', role: 'supervisor' };

    vi.spyOn(clsRequestContextAdapter, 'setActor');

    clsRequestContextAdapter.setActor(actor);

    expect(clsRequestContextAdapter.setActor).toHaveBeenCalledOnce();
    expect(cls.set).toHaveBeenCalledOnce();
  });
});
