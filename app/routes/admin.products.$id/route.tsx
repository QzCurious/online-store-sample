import { zodResolver } from "@hookform/resolvers/zod";
import { eq } from "drizzle-orm";
import { useForm } from "react-hook-form";
import { redirect, useLoaderData, useSubmit } from "react-router";
import { z } from "zod";
import Tiptap from "~/components/Tiptap";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast-context";
import { db, productImages, products, images } from "~/db";
import { IMAGE_CONFIG } from "~/routes/api.upload/const";
import type { Route } from "./+types/route";

// Helper function to extract image IDs from HTML content
function extractImageIds(html: string): number[] {
  const matches = html.match(/src="([^"]+)"/g) || [];
  return matches
    .map(match => {
      const url = match.slice(5, -1); // Remove src=" and "
      return IMAGE_CONFIG.extractIdFromUrl(url);
    })
    .filter((id): id is number => id !== null);
}

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

  // If editing an existing product, get the old description to compare images
  let oldImageIds: number[] = [];
  if (productId !== "new") {
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(productId)))
      .limit(1);
    
    if (existingProduct) {
      oldImageIds = extractImageIds(existingProduct.description ?? '');
    }
  }

  // Get new image IDs from the updated description
  const newImageIds = extractImageIds(result.data.description);

  // Find images that were removed
  const removedImageIds = oldImageIds.filter(id => !newImageIds.includes(id));

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

  // Delete removed images from the database
  if (removedImageIds.length > 0) {
    await db
      .delete(images)
      .where(eq(images.id, removedImageIds[0]));
    
    for (const imageId of removedImageIds.slice(1)) {
      await db
        .delete(images)
        .where(eq(images.id, imageId));
    }
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
