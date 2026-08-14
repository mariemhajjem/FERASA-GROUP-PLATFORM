import type { Product } from "@/types/product";
import { ferasaContact } from "@/data/contact";

export const normalise = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

export const productHaystack = (product: Product) =>
  [
    product.name,
    product.sku,
    product.partNumber,
    product.brand,
    product.model,
    product.category,
    product.subcategory,
    product.original,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const makeRfqEmail = (
  items: Product[],
  details: { company: string; name: string; email: string; note: string },
) => {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} | Ref: ${item.sku}${
        item.partNumber ? ` | Part No.: ${item.partNumber}` : ""
      }${item.brand ? ` | Mfr: ${item.brand}` : ""}`,
  );
  const body = [
    "Dear Ferasa Commercial Team,",
    "",
    "Please provide your quotation for the following item(s):",
    ...lines,
    "",
    `Company: ${details.company || "-"}`,
    `Contact: ${details.name || "-"}`,
    `Email: ${details.email || "-"}`,
    `Notes: ${details.note || "Please advise availability, lead time and delivery terms."}`,
    "",
    "Kind regards,",
  ].join("\n");

  return `mailto:${ferasaContact.commercialEmail}?subject=${encodeURIComponent(
    `RFQ — ${items.length} item${items.length === 1 ? "" : "s"}`,
  )}&body=${encodeURIComponent(body)}`;
};
