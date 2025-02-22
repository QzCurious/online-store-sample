import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type UploadImageError = {
  error: string;
  maxSize?: string;
  allowedTypes?: string;
};

export type UploadImageSuccess = {
  url: string;
  id: string;
};

export async function uploadImage(file: File): Promise<UploadImageSuccess | UploadImageError> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return data as UploadImageError;
    }

    return data as UploadImageSuccess;
  } catch (error) {
    return {
      error: 'Failed to upload image',
    };
  }
}
