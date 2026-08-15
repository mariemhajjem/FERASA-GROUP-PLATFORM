import type { Product } from "@/types/product";

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
};

export function toProduct(item: PublicProductRow): Product {
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
    image: item.image_url || "",
    publicPosition: item.public_position ?? undefined,
    available: Number(item.available ?? 0),
  };
}