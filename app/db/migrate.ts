import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '.';

// This script will automatically run needed migrations
async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: 'app/db/migrations',
    });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main(); 