import { DataSource } from 'typeorm';

import { databaseOptions } from './database.options.js';

export const AppDataSource = new DataSource(databaseOptions);
