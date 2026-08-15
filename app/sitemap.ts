import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/utils/public-products-server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ferasa.net";

  const products = await getPublicProducts();

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/request-quote`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${encodeURIComponent(
        product.sku.toLowerCase(),
      )}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}