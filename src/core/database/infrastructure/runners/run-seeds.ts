import { runSeeders, withDatabaseLock } from 'typeorm-extension';

import { AppDataSource } from '../data-source.js';

await AppDataSource.initialize();
const queryRunner = AppDataSource.createQueryRunner();

try {
  await queryRunner.connect();

  await withDatabaseLock(queryRunner, 'timonel:seeders', async () => {
    await runSeeders(AppDataSource, {
      seedTracking: true,
      seeds: ['src/*/infrastructure/database/seeds/*{.js,.ts}'],
      factories: [
        'src/*/infrastructure/database/factories/*{.js,.ts}',
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
