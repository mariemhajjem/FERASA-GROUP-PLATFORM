"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RfqDrawer } from "@/components/rfq/RfqDrawer";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { CatalogueSection } from "@/components/sections/CatalogueSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DownloadsSection } from "@/components/sections/DownloadsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { ServicesSection } from "@/components/sections/ServicesSection";
import type { Product } from "@/types/product";
import {
  toProduct,
  type PublicProductRow,
} from "@/types/public-product";
import { createClient } from "@/utils/supabase/client";

export function FerasaSite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [rfqItems, setRfqItems] = useState<Product[]>([]);
  const [rfqOpen, setRfqOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "get_public_products",
      );

      if (error) {
        console.error("PUBLIC PRODUCTS:", error);
        setProducts([]);
        return;
      }

      setProducts(
        ((data ?? []) as PublicProductRow[]).map(toProduct),
      );
    };

    void loadProducts();
  }, []);

  const addToRfq = (product: Product) => {
    setRfqItems((items) =>
      items.some((item) => item.sku === product.sku)
        ? items
        : [...items, product],
    );

    setRfqOpen(true);
  };

  return (
    <main>
      <SiteHeader
        rfqCount={rfqItems.length}
        onOpenRfq={() => setRfqOpen(true)}
      />

      <HeroSection
        query={query}
        productCount={products.length}
        onQueryChange={setQuery}
      />

      <CatalogueSection
        products={products}
        query={query}
        onQueryChange={setQuery}
        onAddToRfq={addToRfq}
        onOpenCustomRfq={() => setRfqOpen(true)}
      />

      <ProcessStrip />
      <ServicesSection />
      <GallerySection />
      <DownloadsSection />
      <ContactSection />

      <SiteFooter onOpenRfq={() => setRfqOpen(true)} />

      <WhatsAppButton />

      <RfqDrawer
        open={rfqOpen}
        items={rfqItems}
        onClose={() => setRfqOpen(false)}
        onRemove={(sku) =>
          setRfqItems((items) =>
            items.filter((item) => item.sku !== sku),
          )
        }
      />
    </main>
  );
}