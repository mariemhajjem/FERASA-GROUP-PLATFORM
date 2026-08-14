"use client";

import { useState } from "react";
import { services } from "@/data/site-content";
import { Arrow } from "@/components/ui/Arrow";
import { publicPath } from "@/utils/public-path";

export function ServicesSection() {
  const [serviceIndex, setServiceIndex] = useState(0);
  const service = services[serviceIndex];

  return (
    <section className="services-section" id="services">
      <div
        className="service-intro"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,58,96,.94), rgba(0,41,67,.98)), url("${publicPath("/assets/ferasa/field-safety.jpg")}")`,
        }}
      >
        <p className="eyebrow">Technical capability</p>
        <h2>One commercial partner. Six connected disciplines.</h2>
        <p>
          Ferasa connects product sourcing with the engineering, installation and
          after-sales support required to make equipment perform in the field.
        </p>
        <a href="#contact">Discuss your project <Arrow /></a>
      </div>
      <div className="service-carousel">
        <div className="service-progress" aria-hidden="true">
          <span style={{ width: `${((serviceIndex + 1) / services.length) * 100}%` }} />
        </div>
        <article key={service.number}>
          <p>{service.number} / 06</p>
          <h3>{service.title}</h3>
          <p className="service-text">{service.text}</p>
          <ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>
        <div className="service-controls">
          <button
            aria-label="Previous service"
            onClick={() => setServiceIndex((serviceIndex - 1 + services.length) % services.length)}
          ><Arrow direction="left" /></button>
          <div>
            {services.map((item, index) => (
              <button
                key={item.number}
                className={index === serviceIndex ? "active" : ""}
                aria-label={`Show service ${index + 1}`}
                onClick={() => setServiceIndex(index)}
              />
            ))}
          </div>
          <button
            aria-label="Next service"
            onClick={() => setServiceIndex((serviceIndex + 1) % services.length)}
          ><Arrow /></button>
        </div>
      </div>
    </section>
  );
}
