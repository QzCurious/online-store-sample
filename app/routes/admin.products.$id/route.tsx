import { eq } from "drizzle-orm";
import { redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { db, productImages, products, images } from "~/db";
import { IMAGE_CONFIG } from "~/routes/api.upload/const";
import type { Route } from "./+types/route";
import ProductForm, { type ProductFormData } from "~/routes/admin.products/ProductForm";

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

export default function ProductFormPage() {
  const { product } = useLoaderData<typeof loader>();
  return <ProductForm product={product} />;
}
