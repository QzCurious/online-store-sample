export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  categoryId: string;
  isActive: boolean;
} 