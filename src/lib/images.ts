// src/lib/images.ts
import { BACKEND_URL } from './config';

export const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';

type ImageLike = string | { url?: string; absoluteUrl?: string; isPrimary?: boolean } | null | undefined;

/**
 * Turn whatever the API returns for an image into a URL the browser can load.
 * - Absolute URLs (Cloudinary, blob previews, data URIs) are used as-is
 * - Backend-relative paths (/uploads/...) are served from the backend origin
 * - Local public assets (/images/...) stay on the frontend
 */
export const resolveImageUrl = (image: ImageLike, fallback = PLACEHOLDER_IMAGE): string => {
    const raw = typeof image === 'string' ? image : image?.url || image?.absoluteUrl;
    if (!raw) return fallback;
    if (/^(https?:|blob:|data:)/i.test(raw)) return raw;
    if (raw.startsWith('/images/')) return raw;
    if (raw.startsWith('/uploads/') || raw.startsWith('uploads/')) {
        return `${BACKEND_URL}/${raw.replace(/^\/+/, '')}`;
    }
    return raw.startsWith('/') ? raw : `${BACKEND_URL}/${raw}`;
};

type ProductLike = {
    images?: ImageLike[];
    primaryImage?: string | null;
    image?: string;
} | null | undefined;

/** The product's primary image, falling back to the first one */
export const productImageUrl = (product: ProductLike, fallback = PLACEHOLDER_IMAGE) => {
    if (!product) return fallback;
    if (product.primaryImage) return resolveImageUrl(product.primaryImage, fallback);
    const images = (product.images || []).filter(Boolean);
    const primary = images.find((img) => typeof img === 'object' && img?.isPrimary) || images[0];
    return resolveImageUrl(primary || product.image, fallback);
};

/** onError handler that swaps a broken image for the placeholder once */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
        img.src = PLACEHOLDER_IMAGE;
    }
};
