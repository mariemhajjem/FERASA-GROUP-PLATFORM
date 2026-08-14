# FERASA Platform — Version 1 Product Requirements

## Product goal

Build FERASA as a maintainable procurement platform with a public B2B website attached to the same future data foundation. V1 prioritizes internal item knowledge, inventory and search before advanced quotation/order workflows.

## V1 priority order

1. Item Master
2. Inventory / stock movements
3. Global Search
4. Website product search
5. RFQ intake
6. Supplier directory
7. Per-item sourcing history
8. Basic client/company records
9. Basic quotation record only (no quotation engine yet)

## Public website

- Keep FERASA corporate identity, services, gallery and downloads.
- Search by product name, SKU, manufacturer, part number, model, category and subcategory.
- Do not publish guessed stock. If no verified inventory exists, show **Confirm availability**.
- Selected products can be added to the RFQ list.
- Dedicated `/request-quote/` supports repeatable line items and document selection.
- WhatsApp CTA is enabled only when `NEXT_PUBLIC_WHATSAPP_NUMBER` contains FERASA's verified WhatsApp-enabled mobile number.
- Main conversion path: Search → Product/Item → RFQ.

## Internal operations

The `/operations/` route is the V1 UI foundation for:

- Overview
- Inventory
- Search
- RFQs
- Suppliers
- Sourcing

The current GitHub Pages package is intentionally static. It must not be treated as a secure production back office. Production deployment requires authenticated server/database access.

## Item Master

Each item should preserve:

- FERASA internal SKU
- Manufacturer
- Manufacturer part number
- Name / description
- Category / subcategory
- Model
- Unit of measure
- Source/reference
- Documents/photos
- Active/inactive state

An item can exist in the Item Master even if FERASA has zero physical stock.

## Inventory

Inventory must be transaction-based, not a manually edited quantity only.

Required data:

- Warehouse
- Location/shelf/bin
- On hand
- Reserved
- Available
- Unit
- Last counted date
- Stock movement history

Movement types include receipt, issue, reserve, release, transfer, return and adjustment.

## Search

V1 must search normalized part numbers and common product fields. Later phases can add full-text document search and fuzzy cross-reference search.

Search results should eventually combine:

- Items
- Inventory
- RFQs/MRs
- Suppliers
- Sourcing history
- Client/company records
- Documents

## RFQ

Public RFQ fields:

- Company
- Contact person
- Email
- Phone
- Country
- Delivery location
- Required date
- Repeatable items: manufacturer, part number, description, quantity
- MR / datasheet / drawing / photo attachments
- Notes

Internal statuses:

New → Reviewing → Sourcing → Waiting Supplier → Ready to Quote → Quotation Sent → Won/Lost/Cancelled

Each RFQ must be split into individual RFQ items so sourcing can be managed per line.

## Suppliers & sourcing

Supplier records should include company, city/country, website, contact details, categories, manufacturers/brands and notes.

Each sourcing record should link a supplier to one RFQ item and preserve:

- Contacted / waiting / quoted / selected state
- Supplier quote reference
- Price / currency
- Lead time
- Validity
- Country of origin
- Notes and dates

This history is the foundation for later supplier suggestions and historical-price intelligence.

## Deferred from V1

Design for these modules, but do not build their full workflow yet:

- Automated client quotation calculation
- Margin/discount/approval engine
- Client portal
- PO workflow
- Shipping tracking
- Invoicing/accounting
- Advanced analytics
- AI extraction/recommendations

## Architecture guardrails

- Modular monolith first; no microservices.
- PostgreSQL as primary business database.
- Files stored in object storage, not as database blobs.
- Public site and internal operations UI separated logically.
- Role-based access, audit logs and backups from the first production release.
- Never store service keys/secrets in GitHub.
- Avoid browser localStorage for business records.

## Suggested production topology

- `ferasa.net` — public website
- `app.ferasa.net` — internal FERASA operations
- `portal.ferasa.net` — future client portal
- Shared authenticated API/database/storage underneath

