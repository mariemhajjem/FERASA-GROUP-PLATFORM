"use client";

import { useState } from "react";
import type { ProductImage } from "@/types/product";
import { publicPath } from "@/utils/public-path";

type ProductGalleryProps = {
  productName: string;
  primaryImage?: string;
  images?: ProductImage[];
};

export function ProductGallery({
  productName,
  primaryImage,
  images = [],
}: ProductGalleryProps) {
  const gallery =
    images.length > 0
      ? images
      : primaryImage
        ? [
            {
              id: "primary",
              url: primaryImage,
              altText: productName,
              position: 1,
              isPrimary: true,
            },
          ]
        : [];

  const [activeImage, setActiveImage] = useState(
    gallery[0]?.url || "",
  );

  const selected =
    gallery.find((image) => image.url === activeImage) ??
    gallery[0];

  return (
    <div className="product-gallery">
      <div className="product-detail-visual">
        {selected ? (
          <img
            src={publicPath(selected.url)}
            alt={selected.altText || productName}
          />
        ) : (
          <span className="image-placeholder">
            <b>FERASA</b>
            Image on request
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="product-thumbnails">
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={
                image.url === selected?.url ? "active" : ""
              }
              onClick={() => setActiveImage(image.url)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={publicPath(image.url)}
                alt={image.altText || `${productName} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}