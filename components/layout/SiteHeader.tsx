import { publicPath } from "@/utils/public-path";

type SiteHeaderProps = {
  rfqCount: number;
  onOpenRfq: () => void;
};

export function SiteHeader({ rfqCount, onOpenRfq }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="Ferasa home">
        <img src={publicPath("/assets/ferasa/FerasaLogo.gif")} alt="Ferasa" />
        <span>Ferasa Oil & Technical Services</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#products">Products</a>
        <a href="#services">Services</a>
        <a href="#gallery">Projects</a>
        <a href="#downloads">Downloads</a>
        <a href="#contact">Contact</a>
        <a className="nav-full-rfq" href={publicPath("/request-quote/")}>Request quote</a>
        <button className="nav-rfq" onClick={onOpenRfq}>
          RFQ list <span>{rfqCount}</span>
        </button>
      </nav>
    </header>
  );
}
