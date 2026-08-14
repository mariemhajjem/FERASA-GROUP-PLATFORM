import { downloads } from "@/data/site-content";
import { Arrow } from "@/components/ui/Arrow";

export function DownloadsSection() {
  return (
    <section className="downloads-section" id="downloads">
      <div className="downloads-copy">
        <p className="eyebrow">Company literature</p>
        <h2>Capabilities, ready to share.</h2>
        <p>
          Download Ferasa&apos;s original service brochures for project files,
          vendor registration and technical review.
        </p>
      </div>
      <div className="download-list">
        {downloads.map((download) => (
          <a key={download.number} href={download.href} target="_blank" rel="noreferrer">
            <span>{download.number}</span>
            <div><b>{download.title}</b><small>{download.description}</small></div>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}
