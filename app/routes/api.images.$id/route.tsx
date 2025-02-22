import { eq } from "drizzle-orm";
import { db, images } from "~/db";
import type { Route } from "./+types/route";

export async function loader({ params }: Route.LoaderArgs) {
  const imageId = params.id;

  if (!imageId) {
    return new Response("Image ID is required", { status: 400 });
  }

  try {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, parseInt(imageId)))
      .limit(1);

    if (!image) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(image.data, {
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": image.size.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new Response("Error serving image", { status: 500 });
  }
} 