-- SQL Snippet 15
-- Name: 15 - Complete FERASA V1 Operations and Public Catalogue
-- Run once in Supabase SQL Editor after the existing inventory core.

begin;

alter table public.items add column if not exists public_name text;
alter table public.items add column if not exists image_url text;
alter table public.items add column if not exists is_public boolean not null default false;
alter table public.items add column if not exists public_position smallint;
alter table public.items add column if not exists unit text;
alter table public.items add column if not exists source_reference text;
alter table public.items add column if not exists updated_at timestamptz not null default now();

alter table public.items drop constraint if exists items_public_position_check;
alter table public.items
  add constraint items_public_position_check
  check (public_position is null or public_position between 1 and 5);

create unique index if not exists items_public_position_unique
  on public.items (public_position)
  where is_public = true and public_position is not null;

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  website text,
  email text,
  phone text,
  brands text[] not null default '{}',
  categories text[] not null default '{}',
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_number text not null unique,
  company text not null,
  contact_name text not null,
  email text not null,
  phone text,
  country text,
  delivery_location text,
  required_date date,
  status text not null default 'new'
    check (status in ('new','reviewing','sourcing','waiting_supplier','ready_to_quote','quotation_sent','won','lost','cancelled')),
  notes text,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  line_number integer not null,
  item_id uuid references public.items(id) on delete set null,
  manufacturer text,
  part_number text,
  description text not null,
  quantity numeric(18,4) not null default 1 check (quantity > 0),
  unit text,
  notes text,
  unique (rfq_id, line_number)
);

create table if not exists public.sourcing_records (
  id uuid primary key default gen_random_uuid(),
  rfq_item_id uuid not null references public.rfq_items(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  status text not null default 'identified'
    check (status in ('identified','contacted','waiting','quoted','declined','no_response','selected')),
  supplier_quote_reference text,
  price numeric(18,4),
  currency text,
  lead_time_days integer,
  validity_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rfqs_status_received_idx
  on public.rfqs (status, received_at desc);
create index if not exists rfq_items_rfq_idx
  on public.rfq_items (rfq_id, line_number);
create index if not exists sourcing_records_rfq_item_idx
  on public.sourcing_records (rfq_item_id, created_at desc);
create index if not exists sourcing_records_supplier_idx
  on public.sourcing_records (supplier_id, created_at desc);

alter table public.suppliers enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.sourcing_records enable row level security;

drop policy if exists "Authenticated users manage suppliers" on public.suppliers;
create policy "Authenticated users manage suppliers"
  on public.suppliers for all to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users manage rfqs" on public.rfqs;
create policy "Authenticated users manage rfqs"
  on public.rfqs for all to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users manage rfq items" on public.rfq_items;
create policy "Authenticated users manage rfq items"
  on public.rfq_items for all to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users manage sourcing" on public.sourcing_records;
create policy "Authenticated users manage sourcing"
  on public.sourcing_records for all to authenticated
  using (true) with check (true);

create or replace view public.stock_movement_history
with (security_invoker = true)
as
select
  sm.id,
  sm.item_id,
  i.sku,
  i.description as item_description,
  sm.warehouse_id,
  w.code as warehouse_code,
  w.name as warehouse_name,
  sm.movement_type,
  sm.quantity,
  sm.created_at
from public.stock_movements sm
join public.items i on i.id = sm.item_id
join public.warehouses w on w.id = sm.warehouse_id;

grant select on public.stock_movement_history to authenticated;

create or replace function public.set_item_public(
  p_item_id uuid,
  p_is_public boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_position smallint;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not p_is_public then
    update public.items
    set is_public = false, public_position = null, updated_at = now()
    where id = p_item_id;
    return;
  end if;

  if (select count(*) from public.items where is_public and id <> p_item_id) >= 5 then
    raise exception 'Maximum 5 public products allowed';
  end if;

  select slot::smallint into v_position
  from generate_series(1, 5) slot
  where not exists (
    select 1 from public.items
    where is_public and public_position = slot and id <> p_item_id
  )
  order by slot
  limit 1;

  update public.items
  set is_public = true,
      public_position = coalesce(public_position, v_position),
      updated_at = now()
  where id = p_item_id;
end;
$$;

revoke all on function public.set_item_public(uuid, boolean) from public;
grant execute on function public.set_item_public(uuid, boolean) to authenticated;

create or replace function public.get_public_products()
returns table (
  id uuid,
  sku text,
  public_name text,
  description text,
  manufacturer text,
  part_number text,
  category text,
  subcategory text,
  model text,
  image_url text,
  public_position smallint,
  available numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.id,
    i.sku,
    coalesce(nullif(i.public_name, ''), i.description) as public_name,
    i.description,
    i.manufacturer,
    i.part_number,
    i.category,
    i.subcategory,
    i.model,
    i.image_url,
    i.public_position,
    coalesce(sum(s.available), 0)::numeric as available
  from public.items i
  left join public.inventory_status s on s.item_id = i.id
  where i.is_public = true
  group by i.id
  order by i.public_position nulls last, i.description
  limit 5;
$$;

revoke all on function public.get_public_products() from public;
grant execute on function public.get_public_products() to anon, authenticated;

create or replace function public.submit_public_rfq(
  p_company text,
  p_contact_name text,
  p_email text,
  p_phone text default null,
  p_country text default null,
  p_delivery_location text default null,
  p_required_date date default null,
  p_notes text default null,
  p_items jsonb default '[]'::jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfq_id uuid;
  v_rfq_number text;
  v_item jsonb;
  v_line integer := 0;
begin
  if trim(coalesce(p_company, '')) = ''
     or trim(coalesce(p_contact_name, '')) = ''
     or trim(coalesce(p_email, '')) = '' then
    raise exception 'Company, contact and email are required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one RFQ item is required';
  end if;

  v_rfq_number := 'FRS-RFQ-' || to_char(clock_timestamp(), 'YYYYMMDD-HH24MISS') || '-' || upper(substr(gen_random_uuid()::text, 1, 4));

  insert into public.rfqs (
    rfq_number, company, contact_name, email, phone, country,
    delivery_location, required_date, notes
  ) values (
    v_rfq_number, trim(p_company), trim(p_contact_name), lower(trim(p_email)),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_country, '')), ''),
    nullif(trim(coalesce(p_delivery_location, '')), ''),
    p_required_date,
    nullif(trim(coalesce(p_notes, '')), '')
  ) returning id into v_rfq_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_line := v_line + 1;
    insert into public.rfq_items (
      rfq_id, line_number, manufacturer, part_number,
      description, quantity, unit
    ) values (
      v_rfq_id,
      v_line,
      nullif(trim(coalesce(v_item->>'manufacturer', '')), ''),
      nullif(trim(coalesce(v_item->>'part_number', '')), ''),
      coalesce(nullif(trim(v_item->>'description'), ''), 'Item requirement'),
      greatest(coalesce((v_item->>'quantity')::numeric, 1), 0.0001),
      nullif(trim(coalesce(v_item->>'unit', '')), '')
    );
  end loop;

  return v_rfq_number;
end;
$$;

revoke all on function public.submit_public_rfq(text,text,text,text,text,text,date,text,jsonb) from public;
grant execute on function public.submit_public_rfq(text,text,text,text,text,text,date,text,jsonb) to anon, authenticated;

commit;
