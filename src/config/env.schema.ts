import { z } from 'zod';

const portSchema = z.coerce
  .number()
  .int('must be an integer')
  .min(1, 'must be between 1 and 65535')
  .max(65535, 'must be between 1 and 65535');

export const EnvValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: portSchema,
  DB_PASSWORD: z.string().nonempty(),
  DB_USER: z.string().nonempty(),
  DB_NAME: z.string().nonempty(),
  DB_PORT: portSchema,
  REDIS_PORT: portSchema,
});
