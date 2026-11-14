import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { DataSourceOptions } from 'typeorm';

import { loadEnvironment } from '../env/env.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const env = loadEnvironment();

export const databaseOptions: DataSourceOptions = {
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
      '../../modules/**/infrastructure/database/entities/*{.js,.ts}',
    ),
  ],
  migrations: [
    join(
      currentDirectory,
      '../../modules/**/infrastructure/database/migrations/*{.js,.ts}',
    ),
  ],
  migrationsTableName: 'migrations',
};
