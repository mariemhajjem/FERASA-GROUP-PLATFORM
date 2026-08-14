import { Arrow } from "@/components/ui/Arrow";
import type { Product } from "@/types/product";
import { publicPath } from "@/utils/public-path";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onAddToRfq: (product: Product) => void;
};

export function ProductModal({ product, onClose, onAddToRfq }: ProductModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} product details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <div className="modal-visual">
          {product.image ? (
            <img src={publicPath(product.image)} alt={product.name} />
          ) : (
            <span className="image-placeholder"><b>FERASA</b>Image on request</span>
          )}
        </div>
        <div className="modal-copy">
          <p className="eyebrow dark">{product.category} · {product.sku}</p>
          <h2>{product.name}</h2>
          <p className="modal-description">{product.original}</p>
          <dl className="detail-list">
            <div><dt>Manufacturer</dt><dd>{product.brand || "Not specified"}</dd></div>
            <div><dt>Part number</dt><dd>{product.partNumber || "Not specified"}</dd></div>
            <div><dt>Model</dt><dd>{product.model || "Not specified"}</dd></div>
            <div><dt>Dimensions</dt><dd>{product.dimensions || "Confirm with RFQ"}</dd></div>
            <div><dt>Source</dt><dd>{product.source || "Ferasa catalogue"}{product.page ? ` · p.${product.page}` : ""}</dd></div>
          </dl>
          {product.verificationStatus && (
            <div className="verification-note">
              <b>{product.verificationStatus}</b>
              <span>{product.verificationBasis}</span>
            </div>
          )}
          <button
            className="modal-rfq"
            onClick={() => {
              onAddToRfq(product);
              onClose();
            }}
          >
            Add this item to RFQ <Arrow />
          </button>
        </div>
      </section>
    </div>
  );
}
