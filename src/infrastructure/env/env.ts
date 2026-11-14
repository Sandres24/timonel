import { existsSync } from 'node:fs';

import { EnvSchema, type Environment } from './env.schema.js';

function loadDotEnvFile(): void {
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Environment {
  return EnvSchema.parse(config);
}

export function loadEnvironment(): Environment {
  loadDotEnvFile();
  return validateEnvironment(process.env);
}
