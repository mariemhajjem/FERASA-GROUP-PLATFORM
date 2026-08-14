"use client";

import { useMemo, useState } from "react";
import { StockMovementForm } from "@/components/operations/StockMovementForm";
import {
  ItemManager,
  MovementHistoryPanel,
  RfqsPanel,
  SourcingPanel,
  SuppliersPanel,
} from "@/components/operations/ManagementPanels";
import type { Product } from "@/types/product";
import type {
  DbInventory,
  DbItem,
  DbWarehouse,
  Rfq,
  RfqItem,
  SourcingRecord,
  StockMovementHistory,
  Supplier,
} from "@/types/database";
import { normalise, productHaystack } from "@/utils/catalogue";
import { publicPath } from "@/utils/public-path";

const modules = ["Overview", "Inventory", "Search", "Public Products", "RFQs", "Suppliers", "Sourcing"] as const;
type Module = (typeof modules)[number];

type InventorySummary = {
  onHand: number;
  reserved: number;
  available: number;
  locations: string[];
};

type Props = {
  dbItems: DbItem[];
  dbInventory: DbInventory[];
  dbWarehouses: DbWarehouse[];
  dbMovements: StockMovementHistory[];
  dbSuppliers: Supplier[];
  dbRfqs: Rfq[];
  dbRfqItems: RfqItem[];
  dbSourcing: SourcingRecord[];
};

function toNumber(value: number | string | null | undefined) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

function createInventoryMap(rows: DbInventory[]) {
  const inventoryMap = new Map<string, InventorySummary>();
  rows.forEach((row) => {
    const current = inventoryMap.get(row.item_id) ?? { onHand: 0, reserved: 0, available: 0, locations: [] };
    current.onHand += toNumber(row.on_hand);
    current.reserved += toNumber(row.reserved);
    current.available += toNumber(row.available);
    const location = [row.warehouse_code || row.warehouse_name, row.location_code].filter(Boolean).join(" / ");
    if (location && !current.locations.includes(location)) current.locations.push(location);
    inventoryMap.set(row.item_id, current);
  });
  return inventoryMap;
}

export function OperationsDashboard({
  dbItems,
  dbInventory,
  dbWarehouses,
  dbMovements,
  dbSuppliers,
  dbRfqs,
  dbRfqItems,
  dbSourcing,
}: Props) {
  const [active, setActive] = useState<Module>("Overview");
  const [query, setQuery] = useState("");

  const products: Product[] = useMemo(() => dbItems.map((item) => ({
    id: item.id,
    sku: item.sku,
    name: item.description,
    original: item.description,
    category: item.category ?? "Uncategorized",
    subcategory: item.subcategory ?? "",
    partNumber: item.part_number ?? "",
    brand: item.manufacturer ?? "",
    model: item.model ?? "",
    image: item.image_url ?? "",
    publicPosition: item.public_position ?? undefined,
  })), [dbItems]);

  const itemIdBySku = useMemo(() => new Map(dbItems.map((item) => [item.sku, item.id])), [dbItems]);
  const inventoryByItem = useMemo(() => createInventoryMap(dbInventory), [dbInventory]);
  const brands = new Set(products.map((item) => item.brand).filter(Boolean)).size;
  const categories = new Set(products.map((item) => item.category).filter(Boolean)).size;

  const results = useMemo(() => {
    const clean = query.trim();
    if (!clean) return products.slice(0, 100);
    const words = clean.toLowerCase().split(/\s+/).filter(Boolean);
    const compact = normalise(clean);
    return products.filter((item) => {
      const haystack = productHaystack(item);
      return words.every((word) => haystack.includes(word)) || normalise(haystack).includes(compact);
    }).slice(0, 150);
  }, [products, query]);

  return (
    <main className="ops-shell">
      <aside className="ops-sidebar">
        <a className="ops-logo" href={publicPath("/")}><img src={publicPath("/assets/ferasa/logo.jpg")} alt="FERASA" /><span>Operations V1</span></a>
        <nav>{modules.map((module) => <button key={module} className={active === module ? "active" : ""} onClick={() => setActive(module)}>{module}</button>)}</nav>
        <div className="ops-sidebar-note"><b>Live operations</b><p>Items, inventory, public products, RFQs, suppliers and sourcing use Supabase.</p></div>
      </aside>

      <section className="ops-main">
        <header className="ops-topbar"><div><p>FERASA INTERNAL</p><h1>{active}</h1></div><label className="ops-global-search"><span>Global item search</span><input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setActive("Search")} placeholder="Part no., manufacturer, model, description…" /></label></header>

        {active === "Overview" && <Overview items={products.length} brands={brands} categories={categories} stocked={inventoryByItem.size} publicCount={dbItems.filter((item) => item.is_public).length} rfqs={dbRfqs.length} suppliers={dbSuppliers.length} />}

        {active === "Inventory" && <div className="ops-content">
          <div className="ops-section-head"><div><p className="ops-kicker">Inventory & item master</p><h2>Verified warehouse inventory.</h2></div><span className="ops-badge">{inventoryByItem.size} stocked items</span></div>
          <StockMovementForm items={dbItems} warehouses={dbWarehouses} />
          <InventoryTable products={results} itemIdBySku={itemIdBySku} inventoryByItem={inventoryByItem} />
          <MovementHistoryPanel movements={dbMovements} />
        </div>}

        {active === "Search" && <SearchPanel results={results} query={query} itemIdBySku={itemIdBySku} inventoryByItem={inventoryByItem} />}
        {active === "Public Products" && <ItemManager items={dbItems} />}
        {active === "RFQs" && <RfqsPanel rfqs={dbRfqs} rfqItems={dbRfqItems} />}
        {active === "Suppliers" && <SuppliersPanel suppliers={dbSuppliers} />}
        {active === "Sourcing" && <SourcingPanel rfqs={dbRfqs} rfqItems={dbRfqItems} suppliers={dbSuppliers} records={dbSourcing} />}
      </section>
    </main>
  );
}

function Overview({ items, brands, categories, stocked, publicCount, rfqs, suppliers }: { items: number; brands: number; categories: number; stocked: number; publicCount: number; rfqs: number; suppliers: number }) {
  return <div className="ops-content"><div className="ops-metrics ops-metrics-7"><Metric label="Item master" value={items} note="Supabase items" /><Metric label="Stocked" value={stocked} note="Items with balances" /><Metric label="Online" value={`${publicCount}/5`} note="Public products" /><Metric label="RFQs" value={rfqs} note="Website requests" /><Metric label="Suppliers" value={suppliers} note="Reusable contacts" /><Metric label="Manufacturers" value={brands} note="Distinct brands" /><Metric label="Categories" value={categories} note="Product groups" /></div><div className="ops-grid-2"><article className="ops-panel"><p className="ops-kicker">Daily workflow</p><h2>From requirement to supplier response.</h2><ol className="ops-steps"><li>Search the item master before creating a duplicate.</li><li>Check verified stock and recent movements.</li><li>Review new website RFQs line by line.</li><li>Reuse suppliers and record every response.</li><li>Publish up to five selected products online.</li></ol></article><article className="ops-panel ops-panel-dark"><p className="ops-kicker">Control rule</p><h2>One reliable source of truth.</h2><p>Public products, item details, inventory, RFQs and sourcing records are managed here and stored in Supabase.</p><div className="ops-rule-tags"><span>Authenticated</span><span>Auditable</span><span>Supabase</span></div></article></div></div>;
}

function Metric({ label, value, note }: { label: string; value: string | number; note: string }) {
  return <article className="ops-metric"><span>{label}</span><strong>{value}</strong><p>{note}</p></article>;
}

function InventoryTable({ products, itemIdBySku, inventoryByItem }: { products: Product[]; itemIdBySku: Map<string, string>; inventoryByItem: Map<string, InventorySummary> }) {
  return <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Item</th><th>Manufacturer</th><th>Part no.</th><th>Category</th><th>On hand</th><th>Reserved</th><th>Available</th><th>Location</th><th>Status</th></tr></thead><tbody>{products.map((item) => { const id = itemIdBySku.get(item.sku); const stock = id ? inventoryByItem.get(id) : undefined; return <tr key={item.sku}><td><b>{item.name}</b><small>{item.sku}</small></td><td>{item.brand || "—"}</td><td className="ops-mono">{item.partNumber || "—"}</td><td>{item.category}</td><td>{stock?.onHand ?? 0}</td><td>{stock?.reserved ?? 0}</td><td>{stock?.available ?? 0}</td><td>{stock?.locations.join(", ") || "—"}</td><td><span className={`status-chip ${stock && stock.available > 0 ? "online" : ""}`}>{stock ? "Recorded" : "No stock"}</span></td></tr>; })}</tbody></table></div>;
}

function SearchPanel({ results, query, itemIdBySku, inventoryByItem }: { results: Product[]; query: string; itemIdBySku: Map<string, string>; inventoryByItem: Map<string, InventorySummary> }) {
  return <div className="ops-content"><div className="ops-section-head"><div><p className="ops-kicker">Global item search</p><h2>{query ? `${results.length} matching items` : "Search the full item master."}</h2></div><p>Search SKU, part number, manufacturer, model, category and description.</p></div><div className="ops-search-results">{results.map((item) => { const id = itemIdBySku.get(item.sku); const stock = id ? inventoryByItem.get(id) : undefined; return <article key={item.sku}><small>{item.brand || "Manufacturer not recorded"}</small><h3>{item.name}</h3><dl><div><dt>Part no.</dt><dd>{item.partNumber || "—"}</dd></div><div><dt>SKU</dt><dd>{item.sku}</dd></div><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Available</dt><dd>{stock?.available ?? 0}</dd></div></dl></article>; })}{!results.length && <div className="ops-empty"><h3>No matching items</h3><p>Create a new item from Public Products / Item Master.</p></div>}</div></div>;
}
