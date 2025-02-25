import type { Product } from "~/components/products/ProductCard"

export interface Review {
  id: string
  userId: string
  productId: string
  orderId: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

// 模擬評價數據
export const mockReviews: Review[] = [
  {
    id: "review-1",
    userId: "user-1",
    productId: "1",
    orderId: "order-2",
    rating: 5,
    content: "咖啡豆品質很好，烘焙程度適中，沖泡後香氣十足，非常推薦！",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    ],
    createdAt: "2024-03-13T08:30:00Z",
    updatedAt: "2024-03-13T08:30:00Z",
  },
] 