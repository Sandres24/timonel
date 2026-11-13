import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DataSource, type DataSourceOptions } from 'typeorm';

import { EnvValidationSchema } from '../../config/env.schema.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

if (existsSync('.env')) {
  process.loadEnvFile();
}

const env = EnvValidationSchema.parse(process.env);

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

export const AppDataSource = new DataSource(databaseOptions);
