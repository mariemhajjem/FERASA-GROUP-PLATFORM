# FERASA V1 — Final Setup

## One database step

Open Supabase **SQL Editor**, create a new snippet named:

```text
15 - Complete FERASA V1 Operations and Public Catalogue
```

Paste and run the complete file:

```text
database/15-ferasa-v1-complete.sql
```

This single migration adds:

- Public-product fields and a database-enforced maximum of five products.
- Safe public product retrieval.
- Website RFQ submission.
- Suppliers, RFQs, RFQ items and sourcing records.
- Stock movement history.
- Authenticated access policies.

## Local environment

Copy `.env.example` to `.env.local`, then add the existing Supabase URL and publishable key.

```bash
npm install
npm run dev
```

Open:

- `/` — public FERASA website.
- `/request-quote` — public RFQ submission.
- `/login` — internal sign-in.
- `/operations` — internal operations dashboard.

## Manage the five online products

1. Open **Operations → Public Products**.
2. Create an item or click **Edit** to add its public name and image path.
3. Click **Publish**. The database assigns the first available position from 1 to 5.
4. Click **Unpublish** to remove it from the public website without deleting the item or its inventory.

The database rejects a sixth public product. The public website reads only the selected products.

## RFQ workflow

1. A customer submits `/request-quote`.
2. The request appears in **Operations → RFQs**.
3. Update its status as work progresses.
4. Add suppliers in **Suppliers**.
5. Link supplier responses to individual RFQ items in **Sourcing**.

## Deployment note

The complete authenticated application requires a Next.js server host such as Vercel. GitHub Pages can host only the public static portion and cannot run login, server actions or the protected operations dashboard.

For GitHub Actions, add these repository secrets:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never commit `.env.local` or Supabase service-role keys.
