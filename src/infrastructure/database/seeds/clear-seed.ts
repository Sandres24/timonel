import type { DataSource } from 'typeorm';
import { withDatabaseLock } from 'typeorm-extension';

import { AppDataSource } from '../data-source.js';

// Estos entrypoints se ejecutan como módulos ESM mediante tsx; usamos
// top-level await para mantener el flujo asíncrono explícito y propagar errores.

// Registrar aquí los clear-seeders de cada módulo cuando se incorporen.
type ClearSeeder = (dataSource: DataSource) => Promise<void>;

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
