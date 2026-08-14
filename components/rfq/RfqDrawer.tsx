"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import type { Product } from "@/types/product";
import { makeRfqEmail } from "@/utils/catalogue";
import { publicPath } from "@/utils/public-path";

type RfqDrawerProps = {
  open: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (sku: string) => void;
};

export function RfqDrawer({ open, items, onClose, onRemove }: RfqDrawerProps) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const submitRfq = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = makeRfqEmail(items, { company, name, email, note });
  };

  return (
    <>
      <aside className={`rfq-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-head">
          <div><p>Request for quotation</p><h2>Your RFQ list</h2></div>
          <button onClick={onClose} aria-label="Close RFQ list">×</button>
        </div>
        <div className="rfq-items">
          {!items.length && (
            <div className="rfq-empty">
              <b>No products selected yet.</b>
              <span>Add products from the catalogue or send a custom sourcing request.</span>
            </div>
          )}
          {items.map((item) => (
            <div className="rfq-item" key={item.sku}>
              {item.image ? <img src={item.image} alt="" /> : <span />}
              <div><b>{item.name}</b><small>{item.partNumber || item.sku}</small></div>
              <button onClick={() => onRemove(item.sku)} aria-label={`Remove ${item.name}`}>×</button>
            </div>
          ))}
        </div>
        <form className="rfq-form" onSubmit={submitRfq}>
          <div className="form-row">
            <label><span>Company</span><input value={company} onChange={(event) => setCompany(event.target.value)} /></label>
            <label><span>Your name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          </div>
          <label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span>Quantity, delivery location or notes</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} /></label>
          <button className="send-rfq" type="submit">
            {items.length ? "Create RFQ email" : "Send custom sourcing request"} <Arrow />
          </button>
          <a className="drawer-full-rfq" href={publicPath("/request-quote/")}>Need multiple custom items or documents? Open the full RFQ form →</a>
          <p>Your email app opens with a formatted request addressed to commercial@ferasa.net.</p>
        </form>
      </aside>
      {open && <button className="drawer-backdrop" onClick={onClose} aria-label="Close RFQ list" />}
    </>
  );
}
