import { Link, useSearchParams } from "react-router";
import type { Product } from "~/types/product";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortField = "name" | "price" | "stock";
type SortOrder = "asc" | "desc";

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sortField = (searchParams.get("sort") as SortField) || "name";
  const sortOrder = (searchParams.get("order") as SortOrder) || "asc";

  // TODO: Replace with actual data fetching
  const products: Product[] = [];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }
    return ((a[sortField] as number) - (b[sortField] as number)) * modifier;
  });

  const handleSort = (field: SortField) => {
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

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  const SortButton = ({ field, children }: { field: SortField, children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(field)}
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
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${product.id}/edit`}>
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
    </div>
  );
} 