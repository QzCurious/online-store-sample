import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { products, productImages } from "./schema/products";
import { images } from "./schema/images";

// Initialize SQLite client
const client = createClient({
  url: process.env.DATABASE_URL || 'file:app/db/sqlite.db',
});

// Initialize Drizzle ORM
export const db = drizzle(client);

// Export schema for use in other files
export { products, images, productImages }; 