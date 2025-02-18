import { Form } from "react-router";
import type { Product } from "~/types/product";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

export default function ProductForm() {
  // TODO: Replace with actual data fetching for edit mode
  const product: Partial<Product> = {};
  const isEditMode = false;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Edit Product' : 'New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                defaultValue={product.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                step="0.01"
                defaultValue={product.price}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                defaultValue={product.stock}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {isEditMode ? 'Update' : 'Create'} Product
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 