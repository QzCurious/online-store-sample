import { useSearchParams } from "react-router"
import { ProductCard, type Product } from "~/components/products/ProductCard"
import { ProductFilter, type ProductFilters } from "~/components/products/ProductFilter"
import { useState } from "react"

// 模擬商品數據
const mockProducts: Product[] = [
  {
    id: "1",
    name: "衣索比亞 耶加雪菲",
    price: 450,
    description: "來自衣索比亞耶加雪菲產區的精選咖啡豆，具有茉莉花香和柑橘風味。",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    inStock: true,
  },
  {
    id: "2",
    name: "瓜地馬拉 安提瓜",
    price: 420,
    description: "瓜地馬拉安提瓜火山咖啡豆，帶有巧克力和焦糖的香甜。",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    inStock: true,
  },
  {
    id: "3",
    name: "肯亞 涅里 AA",
    price: 480,
    description: "肯亞 AA 等級咖啡豆，具有黑醋栗和紅茶般的風味。",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    inStock: false,
  },
  {
    id: "4",
    name: "哥倫比亞 翡翠莊園",
    price: 400,
    description: "哥倫比亞翡翠莊園的精選咖啡豆，帶有堅果和焦糖的香氣。",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    inStock: true,
  },
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [filters, setFilters] = useState<ProductFilters>({
    search: query,
    priceRange: [0, 1000],
    sortBy: "newest",
    inStock: false,
  })

  // 根據篩選條件過濾商品
  const filteredProducts = mockProducts
    .filter((product) => {
      // 搜尋過濾
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">搜尋結果</h1>
        {query && (
          <p className="mt-2 text-muted-foreground">
            「{query}」的搜尋結果，共 {filteredProducts.length} 項商品
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* 左側篩選器 */}
        <aside className="w-64 shrink-0">
          <div>
            <h2 className="mb-4 font-medium">商品篩選</h2>
            <ProductFilter filters={filters} onFilterChange={setFilters} />
          </div>
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