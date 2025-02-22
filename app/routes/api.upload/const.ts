export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"] as const;

// Configuration for image paths and URLs
export const IMAGE_CONFIG = {
  // The base path for serving images through the API
  API_PATH: '/api/images/',
  // Optional CDN URL - if set, images will be served through this URL
  CDN_URL: process.env.IMAGE_CDN_URL || '',
  // Function to get the full URL for an image
  getImageUrl: (id: number | string) => {
    const cdnUrl = process.env.IMAGE_CDN_URL;
    return cdnUrl ? `${cdnUrl}${id}` : `/api/images/${id}`;
  },
  // Function to extract ID from an image URL
  extractIdFromUrl: (url: string): number | null => {
    // Handle CDN URL if present
    if (process.env.IMAGE_CDN_URL && url.startsWith(process.env.IMAGE_CDN_URL)) {
      const id = url.slice(process.env.IMAGE_CDN_URL.length);
      return parseInt(id) || null;
    }
    // Handle API path
    if (url.includes('/api/images/')) {
      const match = url.match(/\/api\/images\/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    return null;
  }
} as const;
