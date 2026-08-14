-- FERASA V1 relational foundation (PostgreSQL)
-- Intended for a production deployment such as Supabase/Postgres.
-- The current GitHub Pages build is a static front-end preview and does not apply this schema.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  website text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  full_name text not null,
  job_title text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  manufacturer text,
  manufacturer_part_number text,
  name text not null,
  description text,
  category text,
  subcategory text,
  model text,
  unit text,
  source_reference text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_part_number_idx on items (manufacturer_part_number);
create index if not exists items_manufacturer_idx on items (manufacturer);
create index if not exists items_name_trgm_idx on items using gin (name gin_trgm_ops);
create index if not exists items_part_trgm_idx on items using gin (manufacturer_part_number gin_trgm_ops);

create table if not exists warehouses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  country text,
  city text,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inventory_balances (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  warehouse_id uuid not null references warehouses(id) on delete cascade,
  location_code text not null default '',
  on_hand numeric(18,4) not null default 0,
  reserved numeric(18,4) not null default 0,
  available numeric(18,4) generated always as (on_hand - reserved) stored,
  last_counted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (item_id, warehouse_id, location_code)
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id),
  warehouse_id uuid not null references warehouses(id),
  movement_type text not null check (movement_type in ('receipt','issue','reserve','release','transfer_in','transfer_out','adjustment','return')),
  quantity numeric(18,4) not null,
  reference_type text,
  reference_id uuid,
  note text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists stock_movements_item_date_idx on stock_movements (item_id, created_at desc);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  website text,
  email text,
  phone text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists supplier_items (
  supplier_id uuid not null references suppliers(id) on delete cascade,
  item_id uuid not null references items(id) on delete cascade,
  supplier_part_number text,
  last_price numeric(18,4),
  currency char(3),
  last_lead_time_days integer,
  last_quoted_at timestamptz,
  notes text,
  primary key (supplier_id, item_id)
);

create table if not exists rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_number text not null unique,
  company_id uuid references companies(id),
  contact_id uuid references contacts(id),
  source text not null default 'website',
  client_reference text,
  status text not null default 'new' check (status in ('new','reviewing','sourcing','waiting_supplier','ready_to_quote','quotation_sent','won','lost','cancelled')),
  delivery_location text,
  required_date date,
  assigned_to uuid,
  notes text,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rfqs_status_idx on rfqs (status, received_at desc);

create table if not exists rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references rfqs(id) on delete cascade,
  item_id uuid references items(id),
  line_number integer not null,
  manufacturer text,
  manufacturer_part_number text,
  description text not null,
  quantity numeric(18,4) not null default 1,
  unit text,
  sourcing_status text not null default 'not_started',
  assigned_to uuid,
  notes text,
  unique (rfq_id, line_number)
);

create table if not exists sourcing_records (
  id uuid primary key default gen_random_uuid(),
  rfq_item_id uuid not null references rfq_items(id) on delete cascade,
  supplier_id uuid not null references suppliers(id),
  status text not null default 'identified' check (status in ('identified','contacted','waiting','quoted','declined','no_response','selected')),
  supplier_quote_reference text,
  price numeric(18,4),
  currency char(3),
  lead_time_days integer,
  validity_date date,
  origin_country text,
  notes text,
  contacted_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sourcing_rfq_item_idx on sourcing_records (rfq_item_id);
create index if not exists sourcing_supplier_idx on sourcing_records (supplier_id, created_at desc);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null,
  owner_id uuid not null,
  file_name text not null,
  storage_key text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists documents_owner_idx on documents (owner_type, owner_id);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on audit_logs (entity_type, entity_id, created_at desc);
