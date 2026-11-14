import type { DataSource } from 'typeorm';
import { withDatabaseLock } from 'typeorm-extension';

import { AppDataSource } from '../data-source.js';

type ClearSeeder = (dataSource: DataSource) => Promise<void>;

// Cada módulo que tenga datos sembrados debe registrar aquí su clear-seeder.
const clearSeeders: ClearSeeder[] = [];

await AppDataSource.initialize();
const queryRunner = AppDataSource.createQueryRunner();

try {
  await queryRunner.connect();

  await withDatabaseLock(queryRunner, 'timonel:seeders', async () => {
    for (const clearSeeder of clearSeeders) {
      await clearSeeder(AppDataSource);
    }

    if (await queryRunner.hasTable('seeds')) {
      await queryRunner.clearTable('seeds');
    }
  });
} finally {
  if (!queryRunner.isReleased) {
    await queryRunner.release();
  }

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
