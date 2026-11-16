import { NestFactory } from '@nestjs/core';
import { Mock } from 'vitest';

import { bootstrap } from './main.js';
import { AppModule } from './app.module.js';

interface MockApp {
  get: Mock;
  listen: Mock;
  setGlobalPrefix: Mock;
}

vi.mock('@nestjs/core', () => ({
  NestFactory: {
    create: vi.fn().mockResolvedValue({
      get: vi.fn().mockReturnValue({
        getOrThrow: vi.fn().mockImplementation(() => process.env.PORT),
      }),
      listen: vi.fn(),
      setGlobalPrefix: vi.fn(),
    } satisfies MockApp),
  },
}));

describe('Main', () => {
  let mockApp: MockApp;

  beforeEach(() => {
    mockApp = {
      get: vi.fn().mockReturnValue({
        getOrThrow: vi.fn().mockImplementation(() => process.env.PORT),
      }),
      listen: vi.fn(),
      setGlobalPrefix: vi.fn(),
    };

    vi.mocked(NestFactory.create, { partial: true }).mockResolvedValue(mockApp);
  });

  it('should create application', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should set global prefix', async () => {
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('should listen on env port', async () => {
    process.env.PORT = '3000';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT);
  });
});
