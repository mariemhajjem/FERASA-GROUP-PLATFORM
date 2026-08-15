import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ferasa.net";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/operations", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}