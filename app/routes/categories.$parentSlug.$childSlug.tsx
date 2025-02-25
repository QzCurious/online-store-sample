import { useParams } from "react-router"
import { CategoryNav } from "~/components/categories/CategoryNav"
import { ProductCard, type Product } from "~/components/products/ProductCard"
import { ProductFilter, type ProductFilters } from "~/components/products/ProductFilter"
import { mockCategories } from "~/types/category"
import { useState } from "react"

// 模擬商品數據
const mockProducts: Product[] = [
  {
    id: "1",
    name: "專業磨豆機",
    price: 3500,
    description: "專業級磨豆機，可調節研磨粗細度，適合各種沖煮方式。",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    inStock: true,
  },
  {
    id: "2",
    name: "手搖磨豆機",
    price: 1200,
    description: "便攜式手搖磨豆機，適合外出或露營使用。",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    inStock: true,
  },
]

export default function SubCategoryPage() {
  const { parentSlug, childSlug } = useParams()
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    priceRange: [0, 5000],
    sortBy: "newest",
    inStock: false,
  })

  // 找到當前分類和子分類
  const currentCategory = mockCategories.find((category) => category.slug === parentSlug)
  const currentSubCategory = currentCategory?.children?.find((child) => child.slug === childSlug)

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{currentSubCategory?.name}</h1>
        {currentCategory?.description && (
          <p className="mt-2 text-muted-foreground">{currentCategory.description}</p>
        )}
      </div>

      <div className="flex gap-8">
        {/* 左側分類和篩選器 */}
        <aside className="w-64 shrink-0 space-y-8">
          <div>
            <h2 className="mb-4 font-medium">商品分類</h2>
            <CategoryNav
              categories={mockCategories}
              currentCategoryId={currentSubCategory?.id}
            />
          </div>

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