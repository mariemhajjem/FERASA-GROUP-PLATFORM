import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.env.FERASA_SOURCE_ROOT;
if (!sourceRoot) {
  throw new Error("FERASA_SOURCE_ROOT must point to the conversation workspace.");
}

const siteRoot = process.cwd();
const oldCatalogue = path.join(
  sourceRoot,
  "tmp/awss/AWSS-Complete-Portable-Catalogue",
);
const uploadRoot = path.join(sourceRoot, "upload");
const publicRoot = path.join(siteRoot, "public");

fs.mkdirSync(path.join(publicRoot, "data"), { recursive: true });
fs.mkdirSync(path.join(publicRoot, "assets", "ferasa"), { recursive: true });
fs.mkdirSync(path.join(publicRoot, "downloads"), { recursive: true });
fs.mkdirSync(path.join(publicRoot, "catalogue"), { recursive: true });

fs.cpSync(
  path.join(oldCatalogue, "products"),
  path.join(publicRoot, "catalogue", "products"),
  { recursive: true },
);

const productSource = fs.readFileSync(
  path.join(oldCatalogue, "data", "products.js"),
  "utf8",
);
const jsonText = productSource
  .replace(/^\s*window\.AWSS_PRODUCTS\s*=\s*/, "")
  .replace(/;\s*$/, "");

const sourceNames = {
  "المخزن 2026 - 01": "Inventory Catalogue 01",
  "جرد المخزن 2026 - 01": "Inventory Catalogue 01",
  "المخزن 2026 - 02": "Inventory Catalogue 02",
  "جرد المخزن 2026 - 02": "Inventory Catalogue 02",
  "قطع غيار مرسيدس 2026": "Mercedes-Benz Spare Parts Catalogue",
  "قطع غيار تويوتا 2026": "Toyota Spare Parts Catalogue",
};

const products = JSON.parse(jsonText).map((product) => ({
  ...product,
  sku: product.sku.replace(/^AWSS-/, "FER-"),
  image: product.image ? `/catalogue/${product.image}` : "",
  source: sourceNames[product.source] ?? product.source,
}));

const proAirProducts = [
  {
    sku: "FER-EXMU-PA1",
    name: "EXMÜ Pro-Air I Mobile Welding, Generator & Air Unit",
    original:
      "Mobile combination unit with Deutz F4 M 2011 four-cylinder oil-cooled engine, 25 kVA generator, 20-350 A welding range and 2.5 m³/min compressed-air output at 7 bar.",
    category: "Welding Equipment",
    subcategory: "Combination Units",
    dimensions: "Mobile: 4090 × 1610 × 1310 mm · 1090 kg",
    partNumber: "",
    brand: "EXMÜ",
    model: "Pro-Air I",
    image: "/assets/ferasa/pro-air-product.jpg",
    confidence: "High",
    needsReview: false,
    verificationStatus: "Technical brochure supplied",
    verificationBasis: "Specifications transcribed from the supplied EXMÜ brochure.",
    source: "EXMÜ Pro-Air Technical Brochure",
    page: "1-2",
  },
  {
    sku: "FER-EXMU-PA2",
    name: "EXMÜ Pro-Air II Mobile Welding, Generator & Air Unit",
    original:
      "Mobile combination unit with Deutz F3 M 2011 three-cylinder oil-cooled engine, 15 kVA generator, 20-230 A welding range and 1.8 m³/min compressed-air output at 7 bar.",
    category: "Welding Equipment",
    subcategory: "Combination Units",
    dimensions: "Mobile: 3500 × 1430 × 1240 mm · 840 kg",
    partNumber: "",
    brand: "EXMÜ",
    model: "Pro-Air II",
    image: "/assets/ferasa/pro-air-data.jpg",
    confidence: "High",
    needsReview: false,
    verificationStatus: "Technical brochure supplied",
    verificationBasis: "Specifications transcribed from the supplied EXMÜ brochure.",
    source: "EXMÜ Pro-Air Technical Brochure",
    page: "1-2",
  },
];

fs.writeFileSync(
  path.join(publicRoot, "data", "products.json"),
  JSON.stringify([...proAirProducts, ...products]),
);

const assets = [
  ["Image1(1).jpg", "logo.jpg"],
  ["1779461476901.jpg", "field-supply.jpg"],
  ["1779461479912.jpg", "field-logistics.jpg"],
  ["1779461479918.jpg", "field-safety.jpg"],
  ["1779461479966.jpg", "field-maintenance.jpg"],
  ["PHOTO-2026-08-04-11-55-17.jpg", "pro-air-product.jpg"],
  ["PHOTO-2026-08-04-11-55-17 2.jpg", "pro-air-data.jpg"],
];

for (const [source, destination] of assets) {
  fs.copyFileSync(
    path.join(uploadRoot, source),
    path.join(publicRoot, "assets", "ferasa", destination),
  );
}

const downloads = [
  ["Oilfield-Technical-Services.pdf", "ferasa-oilfield-technical-services.pdf"],
  [
    "Stationary-Extinguishing-Systems.pdf",
    "ferasa-stationary-extinguishing-systems.pdf",
  ],
  [
    "Technology-Security-Services.pdf",
    "ferasa-technology-security-services.pdf",
  ],
];

for (const [source, destination] of downloads) {
  fs.copyFileSync(
    path.join(uploadRoot, source),
    path.join(publicRoot, "downloads", destination),
  );
}

console.log(`Prepared ${products.length + proAirProducts.length} Ferasa products.`);
