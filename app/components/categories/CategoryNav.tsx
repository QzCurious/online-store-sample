import { Link } from "react-router"
import { cn } from "~/lib/utils"
import type { Category } from "~/types/category"

interface CategoryNavProps {
  categories: Category[]
  currentCategoryId?: string
  className?: string
}

export function CategoryNav({ categories, currentCategoryId, className }: CategoryNavProps) {
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {categories.map((category) => (
        <div key={category.id}>
          <Link
            to={`/categories/${category.slug}`}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              currentCategoryId === category.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {category.name}
          </Link>
          {category.children && category.children.length > 0 && (
            <div className="ml-4 mt-1">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/categories/${category.slug}/${child.slug}`}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    currentCategoryId === child.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
} 