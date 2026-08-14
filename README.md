# FERASA Platform — Version 1

> Final setup: see [`docs/SETUP_V1.md`](docs/SETUP_V1.md). Run the single named Supabase migration `15 - Complete FERASA V1 Operations and Public Catalogue` before using the completed management modules.

FERASA Oil & Technical Services public website plus the V1 operational foundation for item master, inventory, global search, RFQs, suppliers and sourcing.

This package is based on the previous FERASA GitHub Pages website and keeps its catalogue, corporate sections, project imagery, downloads and responsive visual system.

## What changed in V1

### Public website

- Existing FERASA design retained.
- Product catalogue repositioned as the **FERASA Item Master / catalogue**.
- Stronger part-number / manufacturer search language.
- Public cards show **Confirm availability** until verified inventory is connected; no stock is guessed.
- Existing selected-item RFQ drawer retained.
- New dedicated `/request-quote/` page with repeatable item lines, quantity, company/contact/delivery fields and document selection.
- Optional direct WhatsApp CTA through `NEXT_PUBLIC_WHATSAPP_NUMBER`.

### Internal operations foundation

Preview route: `/operations/`

Modules:

- Overview
- Inventory
- Global Search
- RFQs
- Suppliers
- Sourcing

The current 535-record product catalogue is reused as the initial searchable Item Master. Inventory quantities are intentionally blank until FERASA imports verified warehouse balances.

> Important: GitHub Pages is static hosting. The `/operations/` route in this package is a UI/data-model preview, not a secure production back office. Do not store live FERASA business records in browser localStorage or expose real internal data through the static site.

## Production architecture direction

V1 is designed to move to:

- Next.js + TypeScript front end
- PostgreSQL as the primary business database
- Authenticated internal app on `app.ferasa.net`
- Object storage for MRs, quotations, datasheets and photos
- Role-based permissions and audit logs
- Public website on `ferasa.net`
- Future client portal on `portal.ferasa.net`

A PostgreSQL foundation schema is included in:

```text
database/v1-schema.sql
```

Business/product requirements are documented in:

```text
docs/V1_REQUIREMENTS.md
```

## Requirements

- Node.js 22.13 or newer
- npm

## Run locally

```bash
npm ci
npm run dev
```

Then open the local address shown in the terminal.

Useful routes:

```text
/                 Public FERASA website
/request-quote/   Full RFQ form
/operations/      Internal operations V1 preview
```

## Production check

```bash
npm run build
```

## Publish the public/static preview with GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and publishes the static site whenever `main` is updated.

In GitHub: **Settings → Pages → Source → GitHub Actions**.

## WhatsApp configuration

Do not guess or reuse a landline number as WhatsApp.

Set FERASA's verified WhatsApp-enabled mobile number in international format, digits only:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=2189XXXXXXXX
```

When the variable is empty, the WhatsApp floating button is hidden.

For GitHub Pages, add this variable to the workflow `env:` block only after the correct business WhatsApp number is confirmed.

## Main structure

```text
app/
  page.tsx
  request-quote/page.tsx
  operations/page.tsx
  globals.css
components/
  FerasaSite.tsx
  catalogue/
  contact/WhatsAppButton.tsx
  layout/
  operations/OperationsDashboard.tsx
  rfq/
  sections/
data/
  contact.ts
  site-content.ts
database/
  v1-schema.sql
docs/
  V1_REQUIREMENTS.md
public/
  data/products.json
  catalogue/products/
  assets/ferasa/
  downloads/
types/
  business.ts
  product.ts
utils/
```

## V1 data model

Core future relationships:

```text
Company → Contact → RFQ → RFQ Item
                        ↓
Item Master ← Inventory / Stock Movements
    ↓
Supplier Item ← Supplier
    ↓
Sourcing Record
```

Later quotation, order, shipping and client-portal modules attach to these records rather than replacing them.

## Deferred intentionally

V1 does **not** implement a full quotation engine, client portal, PO workflow, shipping workflow or accounting. Their data boundaries are reserved so they can be added later without rebuilding the core platform.
