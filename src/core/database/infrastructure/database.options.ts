import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DataSourceOptions } from 'typeorm';

import { Environment } from '../../env/infrastructure/env.schema.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export function createDatabaseOptions(env: Environment): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: false,
    entities: [
      join(
        currentDirectory,
        '../../*/infrastructure/database/entities/*{.js,.ts}',
      ),
    ],
    migrations: [
      join(
        currentDirectory,
        '../../*/infrastructure/database/migrations/*{.js,.ts}',
      ),
    ],
    migrationsTableName: 'migrations',
  };
}
