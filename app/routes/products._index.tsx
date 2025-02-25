import { useState } from "react"
import { ProductCard, type Product } from "~/components/products/ProductCard"
import { ProductFilter, type ProductFilters } from "~/components/products/ProductFilter"

// 模擬商品數據
const mockProducts: Product[] = [
  {
    id: "1",
    name: "精選咖啡豆",
    price: 450,
    description: "來自衣索比亞的精選咖啡豆，具有獨特的花香和水果香氣。",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    inStock: true,
  },
  {
    id: "2",
    name: "手沖咖啡組合",
    price: 1200,
    description: "包含手沖壺、濾杯、濾紙和咖啡豆的完整組合。",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    inStock: true,
  },
  {
    id: "3",
    name: "冷萃咖啡壺",
    price: 880,
    description: "專業冷萃咖啡壺，可製作濃郁滑順的冷萃咖啡。",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    inStock: false,
  },
]

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    priceRange: [0, 1000],
    sortBy: "newest",
    inStock: false,
  })

  // 根據篩選條件過濾商品
  const filteredProducts = mockProducts
    .filter((product) => {
      // 搜尋過濾
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      // 價格範圍過濾
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }
      // 庫存過濾
      if (filters.inStock && !product.inStock) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // 排序
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        {/* 左側篩選器 */}
        <aside className="w-64 shrink-0">
          <ProductFilter
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        {/* 右側商品列表 */}
        <main className="flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded-lg border-2 border-dashed p-8 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                沒有找到符合條件的商品
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 