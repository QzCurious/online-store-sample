import type { Product } from "~/components/products/ProductCard"

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
  variants?: {
    [key: string]: string
  }
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "credit-card" | "atm"
  shippingMethod: "home-delivery" | "convenience-store"
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export const orderStatusMap = {
  pending: {
    label: "待處理",
    variant: "secondary" as const,
  },
  processing: {
    label: "處理中",
    variant: "default" as const,
  },
  shipped: {
    label: "已出貨",
    variant: "default" as const,
  },
  delivered: {
    label: "已送達",
    variant: "default" as const,
  },
  cancelled: {
    label: "已取消",
    variant: "destructive" as const,
  },
}

// 模擬訂單數據
export const mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      {
        id: "item-1",
        product: {
          id: "1",
          name: "衣索比亞 耶加雪菲",
          price: 450,
          description: "來自衣索比亞耶加雪菲產區的精選咖啡豆，具有茉莉花香和柑橘風味。",
          image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
          inStock: true,
        },
        quantity: 2,
        price: 450,
        variants: {
          roast: "中焙",
          grind: "中粒",
        },
      },
      {
        id: "item-2",
        product: {
          id: "2",
          name: "瓜地馬拉 安提瓜",
          price: 420,
          description: "瓜地馬拉安提瓜火山咖啡豆，帶有巧克力和焦糖的香甜。",
          image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
          inStock: true,
        },
        quantity: 1,
        price: 420,
        variants: {
          roast: "深焙",
          grind: "咖啡豆",
        },
      },
    ],
    total: 1320,
    status: "processing",
    paymentMethod: "credit-card",
    shippingMethod: "home-delivery",
    shippingAddress: "台北市大安區信義路三段 1 號",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [
      {
        id: "item-3",
        product: {
          id: "3",
          name: "肯亞 涅里 AA",
          price: 480,
          description: "肯亞 AA 等級咖啡豆，具有黑醋栗和紅茶般的風味。",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
          inStock: true,
        },
        quantity: 1,
        price: 480,
        variants: {
          roast: "淺焙",
          grind: "細粒",
        },
      },
    ],
    total: 480,
    status: "delivered",
    paymentMethod: "atm",
    shippingMethod: "convenience-store",
    shippingAddress: "全家便利商店 大安店",
    createdAt: "2024-03-10T14:20:00Z",
    updatedAt: "2024-03-12T09:15:00Z",
  },
] 