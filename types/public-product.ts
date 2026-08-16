import type {
  Product,
  ProductImage,
} from "@/types/product";

export type PublicProductImageRow = {
  id: string;
  url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
};

export type PublicProductRow = {
  id: string;
  sku: string;
  public_name: string;
  description: string;
  manufacturer: string | null;
  part_number: string | null;
  category: string | null;
  subcategory: string | null;
  model: string | null;
  image_url: string | null;
  public_position: number | null;
  available: number | string | null;
  images: PublicProductImageRow[] | null;
};

export function toProduct(item: PublicProductRow): Product {
  const images: ProductImage[] = (item.images ?? []).map(
    (image) => ({
      id: image.id,
      url: image.url,
      altText: image.alt_text || undefined,
      position: image.position,
      isPrimary: image.is_primary,
    }),
  );

  return {
    id: item.id,
    sku: item.sku,
    name: item.public_name || item.description,
    original: item.description,
    category: item.category || "Industrial Equipment",
    subcategory: item.subcategory || "",
    partNumber: item.part_number || "",
    brand: item.manufacturer || "",
    model: item.model || "",
    image: item.image_url || images[0]?.url || "",
    images,
    publicPosition: item.public_position ?? undefined,
    available: Number(item.available ?? 0),
  };
}