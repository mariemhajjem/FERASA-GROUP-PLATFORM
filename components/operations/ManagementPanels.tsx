"use client";

import { useActionState, useState, useTransition } from "react";
import {
  saveItem,
  saveSupplier,
  saveSourcingRecord,
  setPublicProduct,
  updateRfqStatus,
  type ActionState,
} from "@/app/operations/actions";
import type {
  DbItem,
  Rfq,
  RfqItem,
  SourcingRecord,
  StockMovementHistory,
  Supplier,
} from "@/types/database";

const initialState: ActionState = { success: false, message: "" };

function ActionMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return <p className={`ops-action-message ${state.success ? "success" : "error"}`}>{state.message}</p>;
}

export function ItemManager({ items }: { items: DbItem[] }) {
  const [editing, setEditing] = useState<DbItem | null>(null);
  const [state, action, pending] = useActionState(saveItem, initialState);
  const [publishState, setPublishState] = useState<ActionState>(initialState);
  const [publishPending, startPublish] = useTransition();
  const publicItems = items.filter((item) => item.is_public).sort((a, b) => (a.public_position ?? 99) - (b.public_position ?? 99));
  const orderedItems = [...items].sort((a, b) => Number(b.is_public) - Number(a.is_public) || a.sku.localeCompare(b.sku));

  const togglePublic = (item: DbItem) => {
    setPublishState(initialState);
    startPublish(async () => setPublishState(await setPublicProduct(item.id, !item.is_public)));
  };

  return (
    <div className="ops-content">
      <div className="ops-section-head">
        <div><p className="ops-kicker">Item master & public catalogue</p><h2>Manage products.</h2></div>
        <span className="ops-badge">{publicItems.length} online</span>
      </div>

      {/* <div className="ops-public-slots">
        {[1, 2, 3, 4, 5].map((position) => {
          const item = publicItems.find((entry) => entry.public_position === position);
          return <article key={position}><span>{String(position).padStart(2, "0")}</span><b>{item?.public_name || item?.description || "Empty public slot"}</b><small>{item?.sku || "Publish an item below"}</small></article>;
        })}
      </div> */}

      <section className="ops-form-card">
        <div className="ops-form-title">
          <div><p className="ops-kicker">{editing ? "Edit item" : "New item"}</p><h3>{editing ? editing.sku : "Add an item to FERASA"}</h3></div>
          {editing && <button type="button" className="ops-secondary-button" onClick={() => setEditing(null)}>Cancel edit</button>}
        </div>
        <form action={action} key={editing?.id ?? "new"} className="ops-data-form">
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <label><span>SKU *</span><input name="sku" required defaultValue={editing?.sku ?? ""} placeholder="FER-ITEM-001" /></label>
          <label className="form-span-2"><span>Description *</span><input name="description" required defaultValue={editing?.description ?? ""} /></label>
          <label><span>Manufacturer</span><input name="manufacturer" defaultValue={editing?.manufacturer ?? ""} /></label>
          <label><span>Part number</span><input name="part_number" defaultValue={editing?.part_number ?? ""} /></label>
          <label><span>Model</span><input name="model" defaultValue={editing?.model ?? ""} /></label>
          <label><span>Category</span><input name="category" defaultValue={editing?.category ?? ""} /></label>
          <label><span>Subcategory</span><input name="subcategory" defaultValue={editing?.subcategory ?? ""} /></label>
          <label><span>Unit</span><input name="unit" defaultValue={editing?.unit ?? ""} placeholder="EA" /></label>
          <label><span>Public display name</span><input name="public_name" defaultValue={editing?.public_name ?? ""} /></label>
          <label className="form-span-2"><span>Image URL or public path</span><input name="image_url" defaultValue={editing?.image_url ?? ""} placeholder="/catalogue/products/...jpeg" /></label>
          <label><span>Source reference</span><input name="source_reference" defaultValue={editing?.source_reference ?? ""} /></label>
          <div className="form-actions"><button className="ops-primary-button" disabled={pending}>{pending ? "Saving…" : editing ? "Save changes" : "Create item"}</button></div>
          <ActionMessage state={state} />
        </form>
      </section>

      <ActionMessage state={publishState} />
      <div className="ops-table-wrap">
        <table className="ops-table ops-manage-table">
          <thead><tr><th>Item</th><th>Manufacturer</th><th>Part no.</th><th>Category</th><th>Website</th><th>Actions</th></tr></thead>
          <tbody>
            {orderedItems.slice(0, 150).map((item) => (
              <tr key={item.id}>
                <td><b>{item.description}</b><small>{item.sku}</small></td>
                <td>{item.manufacturer || "—"}</td><td className="ops-mono">{item.part_number || "—"}</td><td>{item.category || "—"}</td>
                <td>{item.is_public ? <span className="status-chip online">Online #{item.public_position}</span> : <span className="status-chip">Internal</span>}</td>
                <td><div className="ops-row-actions"><button onClick={() => { setEditing(item); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button><button disabled={publishPending} onClick={() => togglePublic(item)}>{item.is_public ? "Unpublish" : "Publish"}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MovementHistoryPanel({ movements }: { movements: StockMovementHistory[] }) {
  return (
    <section className="ops-history-section">
      <div className="ops-subhead"><div><p className="ops-kicker">Audit trail</p><h3>Recent stock movements</h3></div><span>{movements.length} records</span></div>
      <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Date</th><th>Item</th><th>Warehouse</th><th>Movement</th><th>Quantity</th></tr></thead><tbody>
        {movements.map((movement) => <tr key={movement.id}><td>{new Date(movement.created_at).toLocaleString()}</td><td><b>{movement.item_description}</b><small>{movement.sku}</small></td><td>{movement.warehouse_code} — {movement.warehouse_name}</td><td><span className={`status-chip ${movement.movement_type.toLowerCase()}`}>{movement.movement_type}</span></td><td><b>{Number(movement.quantity)}</b></td></tr>)}
        {!movements.length && <tr><td colSpan={5}>No stock movements recorded yet.</td></tr>}
      </tbody></table></div>
    </section>
  );
}

export function SuppliersPanel({ suppliers }: { suppliers: Supplier[] }) {
  const [state, action, pending] = useActionState(saveSupplier, initialState);
  return <div className="ops-content"><div className="ops-section-head"><div><p className="ops-kicker">Supplier directory</p><h2>Keep sourcing contacts reusable.</h2></div><span className="ops-badge">{suppliers.length} suppliers</span></div>
    <section className="ops-form-card"><div className="ops-form-title"><div><p className="ops-kicker">New supplier</p><h3>Add supplier</h3></div></div><form action={action} className="ops-data-form">
      <label><span>Name *</span><input name="name" required /></label><label><span>Country</span><input name="country" /></label><label><span>City</span><input name="city" /></label><label><span>Email</span><input name="email" type="email" /></label><label><span>Phone</span><input name="phone" /></label><label><span>Website</span><input name="website" /></label><label className="form-span-2"><span>Brands, comma separated</span><input name="brands" /></label><label className="form-span-2"><span>Categories, comma separated</span><input name="categories" /></label><label className="form-span-2"><span>Notes</span><textarea name="notes" rows={2} /></label><div className="form-actions"><button className="ops-primary-button" disabled={pending}>{pending ? "Saving…" : "Add supplier"}</button></div><ActionMessage state={state} />
    </form></section>
    <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Supplier</th><th>Location</th><th>Email</th><th>Website</th><th>Brands</th></tr></thead><tbody>{suppliers.map((supplier) => <tr key={supplier.id}><td><b>{supplier.name}</b></td><td>{[supplier.city, supplier.country].filter(Boolean).join(", ") || "—"}</td><td>{supplier.email || "—"}</td><td>{supplier.website ? <a href={supplier.website} target="_blank" rel="noreferrer">Open website</a> : "—"}</td><td>{supplier.brands?.join(", ") || "—"}</td></tr>)}{!suppliers.length && <tr><td colSpan={5}>No suppliers added yet.</td></tr>}</tbody></table></div>
  </div>;
}

function RfqStatusControl({ rfq }: { rfq: Rfq }) {
  const [status, setStatus] = useState(rfq.status);
  const [state, setState] = useState<ActionState>(initialState);
  const [pending, startTransition] = useTransition();
  return <div className="rfq-status-control"><select value={status} onChange={(event) => setStatus(event.target.value as Rfq["status"])}>{["new","reviewing","sourcing","waiting_supplier","ready_to_quote","quotation_sent","won","lost","cancelled"].map((value) => <option value={value} key={value}>{value.replaceAll("_", " ")}</option>)}</select><button disabled={pending || status === rfq.status} onClick={() => startTransition(async () => setState(await updateRfqStatus(rfq.id, status)))}>Save</button>{state.message && <small className={state.success ? "success-text" : "error-text"}>{state.message}</small>}</div>;
}

export function RfqsPanel({ rfqs, rfqItems }: { rfqs: Rfq[]; rfqItems: RfqItem[] }) {
  return <div className="ops-content"><div className="ops-section-head"><div><p className="ops-kicker">RFQ intake</p><h2>Website requests in one queue.</h2></div><span className="ops-badge">{rfqs.length} requests</span></div><div className="ops-rfq-list">
    {rfqs.map((rfq) => { const lines = rfqItems.filter((item) => item.rfq_id === rfq.id); return <article key={rfq.id} className="ops-rfq-card"><header><div><span className="status-chip online">{rfq.rfq_number}</span><h3>{rfq.company}</h3><p>{rfq.contact_name} · {rfq.email}</p></div><RfqStatusControl rfq={rfq} /></header><div className="rfq-meta"><span>{rfq.country || "Country not specified"}</span><span>{rfq.delivery_location || "Delivery location not specified"}</span><span>{new Date(rfq.received_at).toLocaleDateString()}</span></div><ol>{lines.map((line) => <li key={line.id}><b>{line.description}</b><span>{line.manufacturer || "Any manufacturer"} · {line.part_number || "No part number"} · Qty {Number(line.quantity)}</span></li>)}</ol>{rfq.notes && <p className="rfq-note">{rfq.notes}</p>}</article>; })}
    {!rfqs.length && <div className="ops-empty"><h3>No RFQs yet</h3><p>Requests submitted from the website will appear here.</p></div>}
  </div></div>;
}

export function SourcingPanel({ rfqs, rfqItems, suppliers, records }: { rfqs: Rfq[]; rfqItems: RfqItem[]; suppliers: Supplier[]; records: SourcingRecord[] }) {
  const [state, action, pending] = useActionState(saveSourcingRecord, initialState);
  const rfqMap = new Map(rfqs.map((rfq) => [rfq.id, rfq]));
  const itemMap = new Map(rfqItems.map((item) => [item.id, item]));
  const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  return <div className="ops-content"><div className="ops-section-head"><div><p className="ops-kicker">Per-item sourcing</p><h2>Record every supplier response.</h2></div><span className="ops-badge">{records.length} records</span></div>
    <section className="ops-form-card"><div className="ops-form-title"><div><p className="ops-kicker">New sourcing record</p><h3>Link supplier to RFQ item</h3></div></div><form action={action} className="ops-data-form">
      <label className="form-span-2"><span>RFQ item *</span><select name="rfq_item_id" required defaultValue=""><option value="" disabled>Select item</option>{rfqItems.map((item) => <option value={item.id} key={item.id}>{rfqMap.get(item.rfq_id)?.rfq_number} — {item.description}</option>)}</select></label><label className="form-span-2"><span>Supplier *</span><select name="supplier_id" required defaultValue=""><option value="" disabled>Select supplier</option>{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.name}</option>)}</select></label><label><span>Status</span><select name="status" defaultValue="identified">{["identified","contacted","waiting","quoted","declined","no_response","selected"].map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Quote reference</span><input name="supplier_quote_reference" /></label><label><span>Price</span><input name="price" type="number" min="0" step="0.01" /></label><label><span>Currency</span><input name="currency" maxLength={3} placeholder="USD" /></label><label><span>Lead time (days)</span><input name="lead_time_days" type="number" min="0" /></label><label><span>Validity date</span><input name="validity_date" type="date" /></label><label className="form-span-2"><span>Notes</span><textarea name="notes" rows={2} /></label><div className="form-actions"><button className="ops-primary-button" disabled={pending}>{pending ? "Saving…" : "Save sourcing"}</button></div><ActionMessage state={state} />
    </form></section>
    <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>RFQ item</th><th>Supplier</th><th>Status</th><th>Price</th><th>Lead time</th><th>Date</th></tr></thead><tbody>{records.map((record) => { const item = itemMap.get(record.rfq_item_id); return <tr key={record.id}><td><b>{item?.description || "RFQ item"}</b><small>{item ? rfqMap.get(item.rfq_id)?.rfq_number : ""}</small></td><td>{supplierMap.get(record.supplier_id)?.name || "Supplier"}</td><td><span className="status-chip">{record.status}</span></td><td>{record.price == null ? "—" : `${record.currency || ""} ${Number(record.price).toFixed(2)}`}</td><td>{record.lead_time_days == null ? "—" : `${record.lead_time_days} days`}</td><td>{new Date(record.created_at).toLocaleDateString()}</td></tr>; })}{!records.length && <tr><td colSpan={6}>No sourcing records yet.</td></tr>}</tbody></table></div>
  </div>;
}
