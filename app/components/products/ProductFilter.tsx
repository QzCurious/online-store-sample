import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Slider } from "~/components/ui/slider"

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilters) => void
  filters: ProductFilters
}

export interface ProductFilters {
  search: string
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

const sortOptions = [
  { value: "price-asc", label: "價格由低到高" },
  { value: "price-desc", label: "價格由高到低" },
  { value: "newest", label: "最新上架" },
]

export function ProductFilter({ onFilterChange, filters }: ProductFilterProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value })
  }

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value })
  }

  const handleStockChange = (value: boolean) => {
    onFilterChange({ ...filters, inStock: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>搜尋</Label>
        <Input
          type="search"
          placeholder="搜尋商品..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>價格範圍</Label>
        <div className="mt-1.5">
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            min={0}
            max={1000}
            step={10}
            minStepsBetweenThumbs={1}
            onValueChange={handlePriceChange}
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <Label>排序方式</Label>
        <Select
          value={filters.sortBy}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="選擇排序方式" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Button
          variant={filters.inStock ? "default" : "outline"}
          className="w-full"
          onClick={() => handleStockChange(!filters.inStock)}
        >
          {filters.inStock ? "只顯示有庫存" : "顯示全部商品"}
        </Button>
      </div>
    </div>
  )
} 