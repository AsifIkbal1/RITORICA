import { clientLogos, clientLogosTitle } from "@/content/clients";
import { useT } from "@/i18n/language";

/** Slowly scrolling strip of client logos (left → right). Pure CSS; pauses on hover; static under reduced motion. */
export function ClientLogos() {
  const t = useT();
  return (
    <section className="container-site pt-8" aria-labelledby="client-logos-title">
      <div className="surface-card overflow-hidden py-10 sm:py-12">
        <h2 id="client-logos-title" className="heading-brand px-6 text-center text-2xl sm:text-3xl">
          {t(clientLogosTitle)}
        </h2>
        <div className="logo-marquee mt-8">
          <div className="logo-marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="logo-marquee-group" aria-hidden={copy === 1 || undefined}>
                {clientLogos.map((logo) => (
                  <li key={logo.name} className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-card px-4 sm:w-52">
                    <img
                      src={logo.src}
                      alt={copy === 0 ? logo.name : ""}
                      className="max-h-14 max-w-full object-contain"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
