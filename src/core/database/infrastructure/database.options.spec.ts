import { join } from 'node:path';

import { createDatabaseOptions } from './database.options.js';
import { Environment } from '../../env/infrastructure/env.schema.js';

describe('DatabaseOptions', () => {
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

  it('should create PostgreSQL database options', () => {
    const options = createDatabaseOptions(env);

    expect(options).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'database',
      synchronize: false,
      migrationsTableName: 'migrations',
    });

    expect(options.entities).toEqual([
      expect.stringContaining(
        join('infrastructure', 'database', 'entities', '*{.js,.ts}'),
      ),
    ]);

    expect(options.migrations).toEqual([
      expect.stringContaining(
        join('infrastructure', 'database', 'migrations', '*{.js,.ts}'),
      ),
    ]);
  });
});
