"use client";

import { ferasaContact } from "@/data/contact";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hello FERASA, I would like to discuss an industrial product or request a quotation.",
  );

  if (!ferasaContact.whatsappNumber) return null;

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${ferasaContact.whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with FERASA on WhatsApp"
    >
      <span aria-hidden="true">WA</span>
      <b>Chat with us</b>
    </a>
  );
}
