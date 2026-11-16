import { DataSource } from 'typeorm';

import { loadEnvironment } from '../../env/infrastructure/env.js';
import { createDatabaseOptions } from './database.options.js';

const env = loadEnvironment();

export const AppDataSource = new DataSource(createDatabaseOptions(env));
