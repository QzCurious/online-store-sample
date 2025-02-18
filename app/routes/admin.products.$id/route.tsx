import { zodResolver } from "@hookform/resolvers/zod";
import { eq } from "drizzle-orm";
import { useForm } from "react-hook-form";
import { redirect, useLoaderData, useSubmit } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/toast-context";
import { db, productImages, products } from "~/db";
import type { Route } from "./+types/route";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer"),
});

type ProductFormData = z.infer<typeof productSchema>;

export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.id;

  if (!productId || productId === "new") {
    return { product: null };
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, parseInt(productId)))
    .limit(1);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  return { product };
}

export async function action({ request, params }: Route.ActionArgs) {
  const data = await request.json();
  const productId = params.id;

  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  const productData = {
    ...result.data,
    stockQuantity: result.data.stock,
    status: "active" as const,
    images: productImages.stringify([]),
  };

  if (productId === "new") {
    await db.insert(products).values(productData);
  } else {
    await db
      .update(products)
      .set(productData)
      .where(eq(products.id, parseInt(productId)));
  }

  return redirect("/admin/products");
}

export default function ProductForm() {
  const { product } = useLoaderData<typeof loader>();
  const isEditMode = !!product;
  const submit = useSubmit();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
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
                encType: "application/json"
              });
              toast({ 
                title: `Product ${isEditMode ? "updated" : "created"} successfully`,
                description: `${data.name} has been ${isEditMode ? "updated" : "created"}.`
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
              <Textarea
                id="description"
                {...register("description")}
                aria-invalid={!!errors.description}
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
