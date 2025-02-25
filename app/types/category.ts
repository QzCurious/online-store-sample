export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
}

// 模擬分類數據
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "咖啡豆",
    slug: "coffee-beans",
    description: "精選各國優質咖啡豆",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    children: [
      {
        id: "1-1",
        name: "單品咖啡",
        slug: "single-origin",
        parentId: "1",
      },
      {
        id: "1-2",
        name: "綜合咖啡",
        slug: "blends",
        parentId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "咖啡器具",
    slug: "equipment",
    description: "專業咖啡沖煮器具",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    children: [
      {
        id: "2-1",
        name: "磨豆機",
        slug: "grinders",
        parentId: "2",
      },
      {
        id: "2-2",
        name: "濾杯",
        slug: "filters",
        parentId: "2",
      },
      {
        id: "2-3",
        name: "手沖壺",
        slug: "kettles",
        parentId: "2",
      },
    ],
  },
  {
    id: "3",
    name: "咖啡周邊",
    slug: "accessories",
    description: "咖啡相關周邊商品",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    children: [
      {
        id: "3-1",
        name: "濾紙",
        slug: "filter-papers",
        parentId: "3",
      },
      {
        id: "3-2",
        name: "咖啡杯",
        slug: "cups",
        parentId: "3",
      },
    ],
  },
] 