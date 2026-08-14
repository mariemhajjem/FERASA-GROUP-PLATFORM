import { publicPath } from "@/utils/public-path";

type SiteFooterProps = { onOpenRfq: () => void };

export function SiteFooter({ onOpenRfq }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={publicPath("/assets/ferasa/logo.jpg")} alt="Ferasa Oil & Technical Services" />
        <p>Industrial supply, oilfield services and project support across Libya.</p>
      </div>
      <div className="footer-links">
        <div>
          <b>Explore</b>
          <a href="#products">Product catalogue</a>
          <a href="#services">Services</a>
          <a href="#gallery">Project gallery</a>
        </div>
        <div>
          <b>Resources</b>
          <a href="#downloads">Downloads</a>
          <a href={publicPath("/request-quote/")}>Full RFQ form</a>
          <button onClick={onOpenRfq}>Selected-item RFQ</button>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div className="footer-end">
        <p>© {new Date().getFullYear()} Ferasa Oil & Technical Services</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
