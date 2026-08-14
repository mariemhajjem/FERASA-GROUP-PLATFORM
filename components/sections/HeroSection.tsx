"use client";

import { FormEvent, useEffect, useState } from "react";
import { heroSlides } from "@/data/site-content";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { Arrow } from "@/components/ui/Arrow";

type HeroSectionProps = {
  query: string;
  productCount: number;
  onQueryChange: (value: string) => void;
};

export function HeroSection({ query, productCount, onQueryChange }: HeroSectionProps) {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(
      () => setHeroIndex((current) => (current + 1) % heroSlides.length),
      5600,
    );
    return () => window.clearInterval(interval);
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  };

  const slide = heroSlides[heroIndex];

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        {/* <AnimatedLogo /> */}
        <h1>
          Search FERASA first.
          <em> Find the part faster.</em>
        </h1>
        <p className="hero-intro">
          Search by keywords, tech specs, or part number then turn selected items into a ready-to-send RFQ.
        </p>
        <form className="hero-search" onSubmit={submitSearch}>
          <label htmlFor="hero-query">Item, part number or manufacturer</label>
          <div>
            <input
              id="hero-query"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Type keyword or part number…"
            />
            <button type="submit">Search item <Arrow /></button>
          </div>
        </form>
        <div className="hero-stats" aria-label="Catalogue statistics">
         {/*  <span><b>{productCount || "535"}</b> item-master records</span> 
          <span><b>Search</b> by part no. or manufacturer</span>
          <span><b>RFQ</b> in a few clicks</span> */}
        </div>
      </div>

      <div className="hero-media" aria-live="polite">
        {heroSlides.map((item, index) => (
          <img
            key={item.image}
            className={index === heroIndex ? "active" : ""}
            src={item.image}
            alt={item.title}
          />
        ))}
        <div className="hero-media-overlay">
          <p>{slide.kicker}</p>
          <h2>{slide.title}</h2>
          <div className="carousel-controls">
            <button
              aria-label="Previous project image"
              onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)}
            ><Arrow direction="left" /></button>
            <span>{String(heroIndex + 1).padStart(2, "0")} / 03</span>
            <button
              aria-label="Next project image"
              onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)}
            ><Arrow /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
