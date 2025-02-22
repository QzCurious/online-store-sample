import * as R from "remeda";
import { db, images } from "~/db";
import type { Route } from "./+types/route";
import { ALLOWED_TYPES, MAX_FILE_SIZE, IMAGE_CONFIG } from "./const";

export interface UploadResponse {
  url: string;
  id: string;
}

export interface UploadErrorResponse {
  error: string;
  maxSize?: string;
  allowedTypes?: string;
}

function validateImageSignature(
  buffer: Buffer,
  mimeType: (typeof ALLOWED_TYPES)[number]
): boolean {
  const isJPEG = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPNG =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isGIF = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;

  return (
    (mimeType === "image/jpeg" && isJPEG) ||
    (mimeType === "image/png" && isPNG) ||
    (mimeType === "image/gif" && isGIF)
  );
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Parse form data
  const formData = await request.formData().catch(() => {
    return Response.json({ error: "Failed to parse form data" }, { status: 400 });
  });

  if (formData instanceof Response) return formData;
  const image = formData.get("image") as File;

  if (!image) {
    return new Response("No image provided", { status: 400 });
  }

  // Validate file size
  if (image.size > MAX_FILE_SIZE) {
    return Response.json(
      {
        error: "Image too large",
        maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
      { status: 400 }
    );
  }

  // Validate file type
  if (!R.isIncludedIn(image.type, ALLOWED_TYPES)) {
    return Response.json(
      {
        error: "Invalid image type",
        allowedTypes: ALLOWED_TYPES.join(", "),
      },
      { status: 400 }
    );
  }

  // Convert to buffer
  const buffer = await image.arrayBuffer()
    .catch(() => {
      return Response.json({ error: "Failed to process image data" }, { status: 400 });
    })
    .then(arr => arr instanceof ArrayBuffer ? Buffer.from(arr) : null);

  if (!buffer) return Response.json({ error: "Failed to create buffer" }, { status: 400 });

  if (!validateImageSignature(buffer, image.type)) {
    return Response.json({ error: "Invalid image content" }, { status: 400 });
  }

  // Store in database
  const imageRecord = await db
    .insert(images)
    .values({
      filename: image.name,
      originalName: image.name,
      mimeType: image.type,
      size: image.size,
      data: buffer,
    })
    .returning()
    .then(([record]) => record)
    .catch((error) => {
      console.error("Database error:", error);
      return Response.json({ error: "Failed to save image" }, { status: 500 });
    });

  if (imageRecord instanceof Response) return imageRecord;

  // Return the URL to the image serve endpoint
  return Response.json(
    {
      url: IMAGE_CONFIG.getImageUrl(imageRecord.id),
      id: String(imageRecord.id),
    },
    { status: 200 }
  );
}
