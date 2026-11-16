import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { EnvModule } from '../env/env.module.js';
import { Environment } from '../env/infrastructure/env.schema.js';
import { DatabaseModule } from './database.module.js';
import { createDatabaseOptions } from './infrastructure/database.options.js';

vi.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRootAsync: vi.fn().mockReturnValue({
      module: class TypeOrmRootModule {},
    }),
  },
}));

const forRootAsyncMock = vi.mocked(TypeOrmModule.forRootAsync);

const getConfiguration = () =>
  forRootAsyncMock.mock.calls[0][0] as {
    imports: unknown[];
    inject: unknown[];
    useFactory: (config: ConfigService<Environment>) => DataSourceOptions;
  };

describe('DatabaseModule', () => {
  it('should register TypeORM configuration', () => {
    expect(DatabaseModule).toBeDefined();
    expect(forRootAsyncMock).toHaveBeenCalledOnce();

    const configuration = getConfiguration();

    expect(configuration.imports).toEqual([EnvModule]);
    expect(configuration.inject).toEqual([ConfigService]);
    expect(configuration.useFactory).toEqual(expect.any(Function));
  });

  it('should create TypeORM options from ConfigService', () => {
    const configuration = getConfiguration();

    const env: Environment = {
      NODE_ENV: 'test',
      PORT: 3000,
      DB_PASSWORD: 'password',
      DB_USER: 'user',
      DB_NAME: 'database',
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      REDIS_PORT: 6379,
    };

    const configService = {
      getOrThrow: vi.fn((key: keyof Environment) => env[key]),
    } as unknown as ConfigService<Environment>;

    const options = configuration.useFactory(configService);

    expect(options).toEqual(createDatabaseOptions(env));
    expect(configService.getOrThrow).toHaveBeenCalledTimes(8);
  });
});
