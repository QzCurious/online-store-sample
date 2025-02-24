import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSubmit } from "react-router";
import { z } from "zod";
import Tiptap from "~/components/Tiptap";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast-context";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stockQuantity: number;
    category: string | null;
    status: "active" | "inactive";
    images: string;
    createdAt: number | null;
    updatedAt: number | null;
  } | null;
}

export default function ProductForm({ product }: ProductFormProps) {
  const isEditMode = !!product;
  const submit = useSubmit();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stockQuantity ?? 0,
    },
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Product" : "New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (data) => {
              await submit(data, {
                method: "post",
                encType: "application/json",
              });
              toast({
                title: `Product ${
                  isEditMode ? "updated" : "created"
                } successfully`,
                description: `${data.name} has been ${
                  isEditMode ? "updated" : "created"
                }.`,
              });
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Tiptap
                content={product?.description ?? ""}
                onChange={(content) => setValue("description", content)}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                step="0.01"
                {...register("price")}
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                {...register("stock")}
                aria-invalid={!!errors.stock}
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {isEditMode ? "Update" : "Create"} Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
