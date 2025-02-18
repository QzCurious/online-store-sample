import { and, asc, between, desc, eq, like, sql } from "drizzle-orm";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db, products } from "~/db";
import type { Route } from "./+types/route";

// Types
type SortField = "name" | "price" | "stockQuantity";
type SortOrder = "asc" | "desc";

interface Category {
  id: string;
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface LoaderData {
  products: Array<typeof products.$inferSelect>;
  categories: Category[];
  totalItems: number;
  itemsPerPage: number;
}

// Loader function to fetch products with filters
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const sortField = (url.searchParams.get("sort") as SortField) || "name";
  const sortOrder = (url.searchParams.get("order") as SortOrder) || "asc";
  const currentPage = Number(url.searchParams.get("page")) || 1;
  const selectedCategory = url.searchParams.get("category") || "";
  const minPrice = Number(url.searchParams.get("minPrice")) || 0;
  const maxPrice = Number(url.searchParams.get("maxPrice")) || 1000;
  const itemsPerPage = 10;

  // Build where conditions
  const whereConditions = [];

  if (search) {
    whereConditions.push(like(products.name, `%${search}%`));
  }

  if (selectedCategory) {
    whereConditions.push(eq(products.category, selectedCategory));
  }

  whereConditions.push(between(products.price, minPrice, maxPrice));

  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(...whereConditions));

  // Get products with pagination and sorting
  const productsList = await db
    .select()
    .from(products)
    .where(and(...whereConditions))
    .orderBy(
      sortOrder === "asc" ? asc(products[sortField]) : desc(products[sortField])
    )
    .limit(itemsPerPage)
    .offset((currentPage - 1) * itemsPerPage);

  // Get unique categories
  const categories = await db
    .select({
      id: products.category,
      name: products.category,
    })
    .from(products)
    .where(sql`${products.category} IS NOT NULL`)
    .groupBy(products.category)
    .then((cats) =>
      cats
        .filter((cat) => cat.id !== null)
        .map((cat) => ({
          id: cat.id || "",
          name: cat.name || "",
        }))
    );

  return {
    products: productsList,
    categories,
    totalItems: count,
    itemsPerPage,
  };
}

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}

const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  searchParams,
  setSearchParams,
}: PriceRangeFilterProps) => {
  const [localValue, setLocalValue] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price Range</label>
      <Slider
        value={localValue}
        min={0}
        max={1000}
        step={1}
        onValueChange={(value) => setLocalValue([value[0], value[1]])}
        onValueCommit={(value) => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("minPrice", value[0].toString());
          newSearchParams.set("maxPrice", value[1].toString());
          newSearchParams.set("page", "1");
          setSearchParams(newSearchParams);
        }}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${localValue[0]}</span>
        <span>${localValue[1]}</span>
      </div>
    </div>
  );
};

export default function PageComponent({ loaderData }: Route.ComponentProps) {
  const {
    products: productsList,
    categories,
    totalItems,
    itemsPerPage,
  } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sortField = (searchParams.get("sort") as SortField) || "name";
  const sortOrder = (searchParams.get("order") as SortOrder) || "asc";
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedCategory = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 1000;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
              value={selectedCategory || "all"}
              onValueChange={(category) => {
                setSearchParams((prev) => {
                  if (category === "all") {
                    prev.delete("category");
                  } else {
                    prev.set("category", category);
                  }
                  prev.set("page", "1");
                  return prev;
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>

        {/* Main content */}
        <div className="space-y-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearchParams((prev) => {
                if (e.target.value) {
                  prev.set("search", e.target.value);
                } else {
                  prev.delete("search");
                }
                prev.set("page", "1");
                return prev;
              });
            }}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    { field: "name" as const, label: "Name" },
                    {
                      field: "price" as const,
                      label: "Price",
                      className: "text-end",
                    },
                    {
                      field: "stockQuantity" as const,
                      label: "Stock",
                      className: "text-end",
                    },
                  ].map(({ field, label, className }) => (
                    <TableHead key={field} className={className}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOrder =
                            field === sortField
                              ? sortOrder === "asc"
                                ? "desc"
                                : "asc"
                              : "asc";
                          setSearchParams((prev) => {
                            prev.set("sort", field);
                            prev.set("order", newOrder);
                            return prev;
                          });
                        }}
                        className="hover:bg-transparent px-0"
                      >
                        {label}
                        {sortField === field ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowDown className="ml-2 h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-end">${product.price}</TableCell>
                    <TableCell className="text-end">
                      {product.stockQuantity}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                      >
                        {product.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            /* TODO: Implement delete */
                          }}
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
                onClick={() => {
                  setSearchParams((prev) => {
                    prev.set("page", page.toString());
                    return prev;
                  });
                }}
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
