"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { ferasaContact } from "@/data/contact";

export function ContactSection() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitContact = (event: FormEvent) => {
    event.preventDefault();
    const body = [
      `Name: ${name || "-"}`,
      `Company: ${company || "-"}`,
      `Email: ${email || "-"}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${ferasaContact.infoEmail}?subject=${encodeURIComponent(
      subject || "Website enquiry",
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-map">
        <iframe
          title="Ferasa office in Tripoli, Libya"
          src="https://www.google.com/maps?q=Al%20Mansora%2C%20Aljomhorea%20Street%2C%20Tripoli%2C%20Libya&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="map-address">
          <p>Tripoli office</p>
          <address>Al Mansora, Aljomhorea Street<br />Building 10.12.47 · Tripoli, Libya</address>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Al%20Mansora%2C%20Aljomhorea%20Street%2C%20Tripoli%2C%20Libya"
            target="_blank"
            rel="noreferrer"
          >Open directions <Arrow /></a>
        </div>
      </div>
      <div className="contact-panel">
        <p className="eyebrow">Start a conversation</p>
        <h2>Tell us what the project needs.</h2>
        <p className="contact-lead">
          Part number, datasheet, nameplate photo or a complete material requisition—send
          what you have and our commercial team will take it from there.
        </p>
        <form onSubmit={submitContact}>
          <div>
            <label><span>Your name</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label><span>Company</span><input value={company} onChange={(event) => setCompany(event.target.value)} /></label>
          </div>
          <label><span>Business email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label><span>Subject</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Product sourcing, service or project enquiry" /></label>
          <label><span>Message</span><textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} required /></label>
          <button type="submit">Create enquiry email <Arrow /></button>
        </form>
        <div className="direct-contact">
          <a href={`mailto:${ferasaContact.commercialEmail}`}><span>RFQ & purchasing</span><b>{ferasaContact.commercialEmail}</b></a>
          <a href={`mailto:${ferasaContact.infoEmail}`}><span>General enquiries</span><b>{ferasaContact.infoEmail}</b></a>
          <a href={`tel:${ferasaContact.telephone}`}><span>Telephone</span><b>{ferasaContact.telephoneLabel}</b></a>
        </div>
      </div>
    </section>
  );
}
