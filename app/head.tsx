export default function Head() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const title = "Spartans Muay Thai Bratislava | Deti, Dospelí, VIP & Súkromné tréningy";
  const description =
    "Train Muay Thai in Bratislava with Headcoach Vincent Kolek (30+ years). VIP mornings, kids classes, club sessions and private coaching. Free parking, modern gym, and supportive community.";
  const ogImage = siteUrl ? `${siteUrl}/vincent.png` : "/vincent.png";
  const logo = siteUrl ? `${siteUrl}/logo.svg` : "/logo.svg";
  const telephone = "+421 911 712 109";
  const email = "spartans@spartans.sk";
  const address = {
    streetAddress: "Mlynské nivy 54",
    postalCode: "821 09",
    addressLocality: "Ružinov, Bratislava",
    addressCountry: "SK",
  };
  const sameAs = [
    "https://instagram.com/spartansclubbratislava",
    "https://facebook.com/spartansclub.sk",
    "https://www.tiktok.com/@spartansclubbratislava",
  ];
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Spartans Club Bratislava",
    url: siteUrl || undefined,
    image: ogImage,
    telephone,
    email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      postalCode: address.postalCode,
      addressLocality: address.addressLocality,
      addressCountry: address.addressCountry,
    },
    sameAs,
    areaServed: "Bratislava",
  };
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spartans Club Bratislava",
    url: siteUrl || undefined,
    logo,
    sameAs,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Potrebujem predchádzajúce skúsenosti?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Skúsenosti nie sú potrebné. Začiatočníci sú vítaní. Tréningy prispôsobujeme vašej úrovni a zameriavame sa najskôr na základy.",
        },
      },
      {
        "@type": "Question",
        name: "Ako často by som mal tréningy absolvovať?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2–3 tréningy týždenne sú ideálne na začiatok. Ako sa vaša technika a kondícia zlepšujú, niektorí športovci trénujú 4–5× týždenne.",
        },
      },
      {
        "@type": "Question",
        name: "Je Muay Thai bezpečné?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bezpečnosť je prioritou. Dbáme na správnu techniku, kontrolované cvičenia, vhodné ochranné pomôcky a postupné zvyšovanie intenzity.",
        },
      },
    ],
  };
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="theme-color" content="#000000" />
      {/* Canonical and hreflang (only render canonical when a site URL is provided) */}
      {siteUrl ? <link rel="canonical" href={siteUrl} /> : null}
      {/* Favicons */}
      <link rel="icon" href="/logo.svg" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      {/* Social meta */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Spartans Muay Thai Bratislava" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {siteUrl ? <meta property="og:url" content={siteUrl} /> : null}
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {/* Preconnects and preloads to improve LCP */}
      <link rel="preload" as="image" href="/vincent.png" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://maps.google.com" />
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}


