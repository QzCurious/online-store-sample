import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema/products';

// Initialize SQLite client
const client = createClient({
  url: 'file:app/db/sqlite.db',
});

// Initialize Drizzle ORM with snake_case mapping
export const db = drizzle(client, { 
  schema,
});

// Export schema for use in other files
export * from './schema/products'; 