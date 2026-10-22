const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bitandbytes.net";

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteUrl}/#organization`,
    name: "Bit & Bytes LLC",
    url: siteUrl,
    logo: `${siteUrl}/brand/bnb-icon.png`,
    description:
      "Bit & Bytes LLC builds AI agents, voice AI, RAG assistants and production software for healthcare, retail, automotive and SaaS teams.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hr@bitandbytes.net",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://linkedin.com/company/bit-and-bytes-llc/",
      "https://www.instagram.com/bitandbytes_llc/",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Bit & Bytes LLC",
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType || "IT Services",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: "Worldwide",
    url: `${siteUrl}${input.path}`,
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["TechArticle", "CreativeWork"],
    headline: input.headline,
    description: input.description,
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}${input.path}`,
  };
}

export { siteUrl };
