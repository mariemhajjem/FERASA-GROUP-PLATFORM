import { publicPath } from "@/utils/public-path";

export function GallerySection() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow dark">From supply to site</p>
          <h2>Work you can see.</h2>
        </div>
        <p>
          Real Ferasa teams supporting equipment delivery, heavy logistics,
          safety operations and technical maintenance.
        </p>
      </div>
      <div className="gallery-grid">
        <figure className="gallery-main">
          <img src={publicPath("/assets/ferasa/field-logistics.jpg")} alt="Ferasa heavy equipment delivery at port" loading="lazy" />
          <figcaption><b>Heavy logistics</b><span>Port handling · Libya</span></figcaption>
        </figure>
        <figure>
          <img src={publicPath("/assets/ferasa/field-supply.jpg")} alt="Ferasa field team receiving technical equipment" loading="lazy" />
          <figcaption><b>Equipment supply</b><span>Field delivery</span></figcaption>
        </figure>
        <figure>
          <img src={publicPath("/assets/ferasa/field-safety.jpg")} alt="Ferasa team handling industrial gas cylinders" loading="lazy" />
          <figcaption><b>Safety operations</b><span>Industrial site</span></figcaption>
        </figure>
        <figure>
          <img src={publicPath("/assets/ferasa/field-maintenance.jpg")} alt="Ferasa technicians maintaining electrical control systems" loading="lazy" />
          <figcaption><b>Technical maintenance</b><span>Control systems</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
