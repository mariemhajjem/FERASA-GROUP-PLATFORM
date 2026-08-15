import Link from "next/link";
import type { Product } from "@/types/product";
import { publicPath } from "@/utils/public-path";

type ProductCardProps = {
  product: Product;
  onAddToRfq: (product: Product) => void;
};

export function ProductCard({
  product,
  onAddToRfq,
}: ProductCardProps) {
  const productUrl =
    `/products/${encodeURIComponent(product.sku.toLowerCase())}`;

  return (
    <article className="product-card">
      <Link
        className="product-visual"
        href={productUrl}
        aria-label={`View ${product.name}`}
      >
        {product.image ? (
          <img
            src={publicPath(product.image)}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <span className="image-placeholder">
            <b>FERASA</b>
            Image on request
          </span>
        )}

        <span className="category-tag">{product.category}</span>

        {product.verificationStatus && (
          <span className="verified-tag">✓ Technical data</span>
        )}
      </Link>

      <div className="product-info">
        <div className="product-meta">
          <span>
            {product.brand || "Manufacturer on request"}
          </span>
          <span>{product.sku}</span>
        </div>

        <Link className="product-title" href={productUrl}>
          {product.name}
        </Link>

        <dl>
          <div>
            <dt>Part no.</dt>
            <dd>{product.partNumber || "—"}</dd>
          </div>

          <div>
            <dt>Model</dt>
            <dd>
              {product.model || product.subcategory || "—"}
            </dd>
          </div>

          <div>
            <dt>Stock</dt>
            <dd className="availability-check">
              {product.available && product.available > 0
                ? `${product.available} available`
                : "Confirm availability"}
            </dd>
          </div>
        </dl>

        <div className="product-actions">
          <Link href={productUrl}>Details</Link>

          <button
            className="add-rfq"
            onClick={() => onAddToRfq(product)}
          >
            + Add to RFQ
          </button>
        </div>
      </div>
    </article>
  );
}