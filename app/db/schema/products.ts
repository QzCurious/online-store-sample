import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Define the image type structure
type ProductImage = {
  url: string;
  alt?: string;
  order?: number;
};

// Custom type helper for JSON columns
const jsonText = <T>() => text().$type<string & { __brand: T }>();

// Helper for creating JSON string with proper type
const asJsonString = <T>(value: T): string & { __brand: T } => 
  JSON.stringify(value) as string & { __brand: T };

export const products = sqliteTable('products', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  price: real().notNull(),
  stockQuantity: integer().notNull().default(0),
  category: text(),
  status: text({ enum: ['active', 'inactive'] }).notNull().default('active'),
  images: jsonText<ProductImage[]>().notNull().$default(() => asJsonString<ProductImage[]>([])),
  createdAt: integer().default(sql`(unixepoch())`),
  updatedAt: integer().default(sql`(unixepoch())`),
});

// Utility functions for working with product images
export const productImages = {
  // Parse images from database
  parse: (images: string & { __brand: ProductImage[] }): ProductImage[] => 
    JSON.parse(images) as ProductImage[],

  // Create a new image entry
  create: (url: string, alt?: string, order?: number): ProductImage => ({
    url,
    ...(alt && { alt }),
    ...(order && { order })
  }),

  // Convert images array to database format
  stringify: (images: ProductImage[]): string & { __brand: ProductImage[] } =>
    asJsonString(images),

  // Sort images by order
  sort: (images: ProductImage[]): ProductImage[] =>
    [...images].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)),
}; 