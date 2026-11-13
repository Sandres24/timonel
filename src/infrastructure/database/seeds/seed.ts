import { runSeeders, withDatabaseLock } from 'typeorm-extension';

import { AppDataSource } from '../data-source.js';

// Estos entrypoints se ejecutan como módulos ESM mediante tsx; usamos
// top-level await para mantener el flujo asíncrono explícito y propagar errores.
await AppDataSource.initialize();
const queryRunner = AppDataSource.createQueryRunner();

try {
  await queryRunner.connect();

  await withDatabaseLock(queryRunner, 'timonel:seeders', async () => {
    await runSeeders(AppDataSource, {
      seedTracking: true,
      seeds: ['src/modules/**/infrastructure/database/seeds/*{.js,.ts}'],
      factories: [
        'src/modules/**/infrastructure/database/factories/*{.js,.ts}',
      ],
    });
  });
} finally {
  if (!queryRunner.isReleased) {
    await queryRunner.release();
  }

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}
