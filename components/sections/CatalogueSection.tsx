"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductModal } from "@/components/catalogue/ProductModal";
import type { Product } from "@/types/product";
import { normalise, productHaystack } from "@/utils/catalogue";

type CatalogueSectionProps = {
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
  onAddToRfq: (product: Product) => void;
  onOpenCustomRfq: () => void;
};

export function CatalogueSection({
  products,
  query,
  onQueryChange,
  onAddToRfq,
  onOpenCustomRfq,
}: CatalogueSectionProps) {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [imagesOnly, setImagesOnly] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const brands = useMemo(
    () =>
      [...new Set(products.map((product) => product.brand).filter(Boolean) as string[])]
        .sort()
        .slice(0, 45),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const compactQuery = normalise(query);

    return products
      .filter((product) => {
        const haystack = productHaystack(product);
        const compact = normalise(haystack);
        return (
          (!words.length ||
            words.every((word) => haystack.includes(word)) ||
            compact.includes(compactQuery)) &&
          (!category || product.category === category) &&
          (!brand || product.brand === brand) &&
          (!imagesOnly || Boolean(product.image))
        );
      })
      .sort((a, b) => {
        if (!compactQuery) return Number(Boolean(b.image)) - Number(Boolean(a.image));
        const aPart = normalise(a.partNumber || a.sku);
        const bPart = normalise(b.partNumber || b.sku);
        const aScore = aPart === compactQuery ? 0 : aPart.startsWith(compactQuery) ? 1 : 2;
        const bScore = bPart === compactQuery ? 0 : bPart.startsWith(compactQuery) ? 1 : 2;
        return aScore - bScore;
      });
  }, [brand, category, imagesOnly, products, query]);

  const resetSearch = () => {
    onQueryChange("");
    setCategory("");
    setBrand("");
    setImagesOnly(false);
  };

  return (
    <section className="catalogue-section" id="products">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Items & catalogue</p>
          <h2>Search what FERASA already knows.</h2>
        </div>
        <p>
          Search by part numbers, manufacturers, models and descriptions. {/* Public stock
          is shown only when FERASA has a verified warehouse balance; otherwise availability is confirmed by RFQ. */}
        </p>
      </div>

      <div className="filter-panel" role="search">
        <label className="main-filter">
          <span>Search all fields</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, part no., model, manufacturer…"
          />
        </label>
        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Manufacturer</span>
          <select value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">Any manufacturer</option>
            {brands.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="check-filter">
          <input
            type="checkbox"
            checked={imagesOnly}
            onChange={(event) => setImagesOnly(event.target.checked)}
          />
          <span>With product image</span>
        </label>
      </div>

      <div className="result-bar">
        <p><b>{filteredProducts.length}</b> matching item records</p>
        {(query || category || brand || imagesOnly) && (
          <button onClick={resetSearch}>Clear all filters ×</button>
        )}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.sku}
            product={product}
            onView={setActiveProduct}
            onAddToRfq={onAddToRfq}
          />
        ))}
      </div>

      {!filteredProducts.length && (
        <div className="empty-state">
          <p className="eyebrow dark">No direct match</p>
          <h3>Let Ferasa source it for you.</h3>
          <p>Send the manufacturer, part number, datasheet or a clear product photo.</p>
          <button onClick={onOpenCustomRfq}>Start a custom RFQ</button>
        </div>
      )}

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToRfq={onAddToRfq}
        />
      )}
    </section>
  );
}
