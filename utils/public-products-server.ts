import { cookies } from "next/headers";
import type { Product } from "@/types/product";
import { toProduct, type PublicProductRow } from "@/types/public-product";
import { createClient } from "@/utils/supabase/server";

export async function getPublicProducts(): Promise<Product[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.rpc("get_public_products");

  if (error) {
    console.error("PUBLIC PRODUCTS:", error);
    return [];
  }

  return ((data ?? []) as PublicProductRow[]).map(toProduct);
}

export async function getPublicProductBySku(
  sku: string,
): Promise<Product | null> {
  const products = await getPublicProducts();

  return (
    products.find(
      (product) => product.sku.toLowerCase() === sku.toLowerCase(),
    ) ?? null
  );
}