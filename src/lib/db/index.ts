import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DB) {
  throw new Error('DB environment variable is not set');
}

// Create the Neon HTTP client
const sql = neon(process.env.DB);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

// Export the schema for use in other files
export * from './schema';