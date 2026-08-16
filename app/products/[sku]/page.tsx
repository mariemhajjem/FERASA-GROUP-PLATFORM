import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/catalogue/ProductGallery";
import { publicPath } from "@/utils/public-path";
import { getPublicProductBySku } from "@/utils/public-products-server";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ sku: string }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ferasa.net";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { sku } = await params;
  const product = await getPublicProductBySku(sku);

  if (!product) {
    return { title: "Product not found | FERASA" };
  }

  const description =
    `${product.original} ${product.partNumber
      ? `Part number: ${product.partNumber}.`
      : ""
      }`.slice(0, 155);

  const canonical =
    `${siteUrl}/products/${encodeURIComponent(
      product.sku.toLowerCase(),
    )}`;

  return {
    title: `${product.name} | FERASA`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} | FERASA`,
      description,
      url: canonical,
      type: "website",
      images: product.image
        ? [
          {
            url: product.image.startsWith("http")
              ? product.image
              : `${siteUrl}${product.image}`,
          },
        ]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { sku } = await params;
  const product = await getPublicProductBySku(sku);

  if (!product) notFound();

  const productUrl =
    `${siteUrl}/products/${encodeURIComponent(
      product.sku.toLowerCase(),
    )}`;

  const rfqUrl =
    `/request-quote?manufacturer=${encodeURIComponent(
      product.brand || "",
    )}&partNumber=${encodeURIComponent(
      product.partNumber || "",
    )}&description=${encodeURIComponent(product.name)}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.original,
    sku: product.sku,
    mpn: product.partNumber || undefined,
    brand: product.brand
      ? {
        "@type": "Brand",
        name: product.brand,
      }
      : undefined,
    category: product.category,
    image:
      product.images && product.images.length > 0
        ? product.images.map((image) =>
          image.url.startsWith("http")
            ? image.url
            : `${siteUrl}${image.url}`,
        )
        : product.image
          ? product.image.startsWith("http")
            ? product.image
            : `${siteUrl}${product.image}`
          : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <header className="site-header product-page-header">
        <Link className="brand-lockup" href="/">
          <img
            src={publicPath("/assets/ferasa/FerasaLogo.gif")}
            alt="FERASA"
          />
          <span>Ferasa Oil & Technical Services</span>
        </Link>

        <nav aria-label="Product navigation">
          <Link href="/#products">Products</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#contact">Contact</Link>
          <Link className="nav-product-rfq" href={rfqUrl}>
            Request quote
          </Link>
        </nav>
      </header>

      <main className="product-detail-page">
        <nav
          className="product-breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#products">Products</Link>
          <span>/</span>
          <b>{product.sku}</b>
        </nav>

        <article className="product-detail-layout">
          <ProductGallery
            productName={product.name}
            primaryImage={product.image}
            images={product.images}
          />

          <div className="product-detail-copy">
            <p className="eyebrow dark">
              {product.category} · {product.sku}
            </p>

            <h1>{product.name}</h1>

            <p className="product-detail-description">
              {product.original}
            </p>

            <dl className="detail-list">
              <div>
                <dt>Manufacturer</dt>
                <dd>{product.brand || "Not specified"}</dd>
              </div>

              <div>
                <dt>Part number</dt>
                <dd>{product.partNumber || "Not specified"}</dd>
              </div>

              <div>
                <dt>Model</dt>
                <dd>{product.model || "Not specified"}</dd>
              </div>

              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>

              <div>
                <dt>Availability</dt>
                <dd>
                  {product.available && product.available > 0
                    ? `${product.available} available`
                    : "Confirm with RFQ"}
                </dd>
              </div>
            </dl>

            <Link className="product-page-rfq" href={rfqUrl}>
              Request a quote for this product
              <span>→</span>
            </Link>

            <p className="product-rfq-note">
              FERASA confirms technical compatibility, price,
              lead time and delivery terms before quotation.
            </p>
          </div>
        </article>
      </main>
    </>
  );
}