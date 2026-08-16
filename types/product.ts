export type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
};

export type Product = {
  id?: string;
  sku: string;
  name: string;
  original: string;
  category: string;
  subcategory: string;
  dimensions?: string;
  partNumber?: string;
  brand?: string;
  model?: string;
  image?: string;
  images?: ProductImage[];
  confidence?: string;
  needsReview?: boolean;
  verificationStatus?: string;
  verificationBasis?: string;
  source?: string;
  page?: string;
  available?: number;
  publicPosition?: number;
};