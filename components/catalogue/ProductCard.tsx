import type { Product } from "@/types/product";
import { publicPath } from "@/utils/public-path";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  onAddToRfq: (product: Product) => void;
};

export function ProductCard({ product, onView, onAddToRfq }: ProductCardProps) {
  return (
    <article className="product-card">
      <button className="product-visual" onClick={() => onView(product)}>
        {product.image ? (
          <img src={publicPath(product.image)} alt={product.name} loading="lazy" />
        ) : (
          <span className="image-placeholder"><b>FERASA</b>Image on request</span>
        )}
        <span className="category-tag">{product.category}</span>
        {product.verificationStatus && <span className="verified-tag">✓ Technical data</span>}
      </button>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.brand || "Manufacturer on request"}</span>
          <span>{product.sku}</span>
        </div>
        <button className="product-title" onClick={() => onView(product)}>{product.name}</button>
        <dl>
          <div><dt>Part no.</dt><dd>{product.partNumber || "—"}</dd></div>
          <div><dt>Model</dt><dd>{product.model || product.subcategory || "—"}</dd></div>
          <div><dt>Stock</dt><dd className="availability-check">{product.available && product.available > 0 ? `${product.available} available` : "Confirm availability"}</dd></div>
        </dl>
        <div className="product-actions">
          <button onClick={() => onView(product)}>Details</button>
          <button className="add-rfq" onClick={() => onAddToRfq(product)}>+ Add to RFQ</button>
        </div>
      </div>
    </article>
  );
}
