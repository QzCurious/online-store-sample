import { db, products, productImages } from '.';
import type { InferInsertModel } from 'drizzle-orm';

type NewProduct = InferInsertModel<typeof products>;

const sampleProducts: NewProduct[] = [
  {
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile white t-shirt made from 100% cotton",
    price: 29.99,
    stockQuantity: 100,
    category: "clothing",
    status: "active" as const,
    images: productImages.stringify([
      productImages.create("/images/white-tshirt-front.jpg", "Front view", 1),
      productImages.create("/images/white-tshirt-back.jpg", "Back view", 2),
    ]),
  },
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    stockQuantity: 50,
    category: "electronics",
    status: "active" as const,
    images: productImages.stringify([
      productImages.create("/images/headphones-main.jpg", "Product front view", 1),
      productImages.create("/images/headphones-case.jpg", "With charging case", 2),
      productImages.create("/images/headphones-wearing.jpg", "Wearing example", 3),
    ]),
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather wallet with multiple card slots",
    price: 49.99,
    stockQuantity: 75,
    category: "accessories",
    status: "active" as const,
    images: productImages.stringify([
      productImages.create("/images/wallet-closed.jpg", "Closed wallet", 1),
      productImages.create("/images/wallet-open.jpg", "Open wallet showing compartments", 2),
    ]),
  }
];

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Clear existing products
    await db.delete(products);
    
    // Insert sample products
    await db.insert(products).values(sampleProducts);
    
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 