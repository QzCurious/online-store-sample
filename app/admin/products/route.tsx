import { Link, useSearchParams } from "react-router";
import type { Product } from "./types";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Slider
} from "~/components/ui/slider";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "~/components/ui/badge";

type SortField = "name" | "price" | "stock";
type SortOrder = "asc" | "desc";

// Move to a separate types file if needed by other components
interface Category {
  id: string;
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

function SortButton({ field, children }: { field: SortField, children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortField = (searchParams.get("sort") as SortField) || "name";
  const sortOrder = (searchParams.get("order") as SortOrder) || "asc";
  const isActive = sortField === field;

  const handleSort = () => {
    const newOrder = 
      field === sortField 
        ? sortOrder === "asc" ? "desc" : "asc"
        : "asc";
    
    setSearchParams((prev) => {
      prev.set("sort", field);
      prev.set("order", newOrder);
      return prev;
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSort}
      className="hover:bg-transparent"
    >
      {children}
      {isActive ? (
        sortOrder === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

function PriceRangeFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 1000;

  const handlePriceChange = (value: number[]) => {
    setSearchParams((prev) => {
      prev.set("minPrice", value[0].toString());
      prev.set("maxPrice", value[1].toString());
      return prev;
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price Range</label>
      <Slider
        defaultValue={[minPrice, maxPrice]}
        max={1000}
        step={1}
        onValueChange={handlePriceChange}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${minPrice}</span>
        <span>${maxPrice}</span>
      </div>
    </div>
  );
}

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sortField = (searchParams.get("sort") as SortField) || "name";
  const sortOrder = (searchParams.get("order") as SortOrder) || "asc";
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedCategory = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 1000;

  // TODO: Replace with actual data fetching
  const products: Product[] = [];
  const categories: Category[] = [];
  const itemsPerPage = 10;
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || product.categoryId === selectedCategory;
    
    const matchesPrice = 
      product.price >= minPrice && product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }
    return ((a[sortField] as number) - (b[sortField] as number)) * modifier;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  const handleCategoryChange = (category: string) => {
    setSearchParams((prev) => {
      if (category) {
        prev.set("category", category);
      } else {
        prev.delete("category");
      }
      prev.set("page", "1"); // Reset to first page
      return prev;
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-[200px_1fr]">
        {/* Filters sidebar */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PriceRangeFilter />
        </div>

        {/* Main content */}
        <div className="space-y-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="name">Name</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="price">Price</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="stock">Stock</SortButton>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {/* TODO: Implement delete */}}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 