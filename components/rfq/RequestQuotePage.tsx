"use client";

import { FormEvent, useMemo, useState } from "react";
import { ferasaContact } from "@/data/contact";
import { publicPath } from "@/utils/public-path";
import { createClient } from "@/utils/supabase/client";

type LineItem = {
  id: number;
  manufacturer: string;
  partNumber: string;
  description: string;
  quantity: string;
};

const blankItem = (id: number): LineItem => ({ id, manufacturer: "", partNumber: "", description: "", quantity: "1" });

type RequestQuotePageProps = {
  initialItem?: Pick<
    LineItem,
    "manufacturer" | "partNumber" | "description"
  >;
};

export function RequestQuotePage({
  initialItem,
}: RequestQuotePageProps) {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [items, setItems] = useState<LineItem[]>([
    initialItem
      ? {
        id: 1,
        ...initialItem,
        quantity: "1",
      }
      : blankItem(1),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{ success: boolean; message: string }>({ success: false, message: "" });

  const validItems = useMemo(
    () => items.filter((item) => item.manufacturer || item.partNumber || item.description),
    [items],
  );

  const updateItem = (id: number, field: keyof Omit<LineItem, "id">, value: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((current) => [...current, blankItem(Math.max(...current.map((item) => item.id), 0) + 1)]);
  const removeItem = (id: number) => setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validItems.length) {
      setSubmitState({ success: false, message: "Add at least one item description, manufacturer or part number." });
      return;
    }

    setSubmitting(true);
    setSubmitState({ success: false, message: "" });
    const supabase = createClient();
    const combinedNotes = [notes, files.length ? `Documents to follow by email: ${files.join(", ")}` : ""].filter(Boolean).join("\n");
    const { data, error } = await supabase.rpc("submit_public_rfq", {
      p_company: company,
      p_contact_name: contact,
      p_email: email,
      p_phone: phone || null,
      p_country: country || null,
      p_delivery_location: deliveryLocation || null,
      p_required_date: requiredDate || null,
      p_notes: combinedNotes || null,
      p_items: validItems.map((item) => ({
        manufacturer: item.manufacturer,
        part_number: item.partNumber,
        description: item.description || item.partNumber || "Item requirement",
        quantity: Number(item.quantity || 1),
        unit: "EA",
      })),
    });
    setSubmitting(false);

    if (error) {
      setSubmitState({ success: false, message: error.message });
      return;
    }

    setSubmitState({ success: true, message: `RFQ submitted successfully. Reference: ${String(data)}` });
  };

  return (
    <main className="rfq-page-shell">
      <header className="rfq-page-header">
        <a href={publicPath("/")} className="rfq-page-brand"><img src={publicPath("/assets/ferasa/logo.jpg")} alt="FERASA" /><span>Oil & Technical Services</span></a>
        <a href={publicPath("/")}>← Back to website</a>
      </header>

      <section className="rfq-page-intro">
        <div><p className="eyebrow dark">Request for quotation</p><h1>Send the requirement you have.</h1></div>
        <p>Part number, manufacturer, description or complete MR—FERASA can start from whatever information is available.</p>
      </section>

      <form className="rfq-page-form" onSubmit={submit}>
        <section className="rfq-form-card">
          <div className="rfq-card-head"><span>01</span><div><h2>Company & contact</h2><p>Who should our commercial team reply to?</p></div></div>
          <div className="rfq-field-grid">
            <label><span>Company *</span><input required value={company} onChange={(e) => setCompany(e.target.value)} /></label>
            <label><span>Contact person *</span><input required value={contact} onChange={(e) => setContact(e.target.value)} /></label>
            <label><span>Business email *</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label><span>Country</span><input value={country} onChange={(e) => setCountry(e.target.value)} /></label>
            <label><span>Delivery location</span><input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} /></label>
          </div>
        </section>

        <section className="rfq-form-card">
          <div className="rfq-card-head"><span>02</span><div><h2>Items required</h2><p>Add one line or a complete multi-item request.</p></div></div>
          <div className="rfq-line-list">
            {items.map((item, index) => (
              <div className="rfq-line" key={item.id}>
                <div className="rfq-line-number">{String(index + 1).padStart(2, "0")}</div>
                <label><span>Manufacturer</span><input value={item.manufacturer} onChange={(e) => updateItem(item.id, "manufacturer", e.target.value)} placeholder="ABB, Atlas Copco, Honeywell…" /></label>
                <label><span>Part number</span><input value={item.partNumber} onChange={(e) => updateItem(item.id, "partNumber", e.target.value)} /></label>
                <label className="rfq-description"><span>Description</span><input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} /></label>
                <label className="rfq-qty"><span>Qty</span><input min="1" type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} /></label>
                <button type="button" className="rfq-remove-line" onClick={() => removeItem(item.id)} aria-label="Remove item">×</button>
              </div>
            ))}
          </div>
          <button type="button" className="rfq-add-line" onClick={addItem}>+ Add another item</button>
        </section>

        <section className="rfq-form-card">
          <div className="rfq-card-head"><span>03</span><div><h2>Documents & delivery</h2><p>MRs, datasheets, drawings and nameplate photos help us identify the correct item.</p></div></div>
          <div className="rfq-field-grid">
            <label><span>Required delivery date</span><input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} /></label>
            <label className="rfq-file-field"><span>MR / datasheet / drawing / photos</span><input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((file) => file.name))} /></label>
          </div>
          <label className="rfq-notes"><span>Additional requirements</span><textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferred origin, Incoterm, certificates, technical notes…" /></label>
          {files.length > 0 && <p className="rfq-file-note">Selected: {files.join(", ")}. After submission, email these files to {ferasaContact.commercialEmail} and include the RFQ reference shown below.</p>}
        </section>

        <div className="rfq-submit-row">
          <div><b>Commercial team</b><span>{ferasaContact.commercialEmail}</span></div>
          <button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit RFQ"} <span>→</span></button>
        </div>
        {submitState.message && <p className={`rfq-submit-message ${submitState.success ? "success" : "error"}`}>{submitState.message}</p>}
      </form>
    </main>
  );
}
