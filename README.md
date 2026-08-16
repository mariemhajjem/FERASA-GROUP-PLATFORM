# FERASA Platform — Version 1

FERASA Oil & Technical Services public website for item master, inventory, global search, RFQs, suppliers and sourcing.

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


## Production architecture direction

V1 is designed to move to:

- Next.js + TypeScript front end
- PostgreSQL as the primary business database
- Authenticated internal app on `app.ferasa.net`
- Object storage for MRs, quotations, datasheets and photos
- Role-based permissions and audit logs
- Public website on `ferasa.net`
- Future client portal on `portal.ferasa.net`


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