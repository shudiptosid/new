// Structured data helpers for SEO
export const generateSensorSchema = (sensor: {
  name: string;
  description: string;
  image: string;
  type: string;
  shortDescription: string;
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sensor.name,
    description: sensor.shortDescription || sensor.description,
    image: sensor.image,
    category: sensor.type,
    keywords: sensor.keywords?.join(", ") || "",
    brand: {
      "@type": "Brand",
      name: "Circuit Crafters",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "89",
    },
  };
};

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Circuit Crafters",
      logo: {
        "@type": "ImageObject",
        url: "https://yourwebsite.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
};

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Circuit Crafters",
    url: "https://yourwebsite.com",
    logo: "https://yourwebsite.com/logo.png",
    description:
      "Leading IoT and Electronics education platform providing comprehensive tutorials, sensor guides, and project resources for makers, students, and professionals.",
    sameAs: [
      "https://facebook.com/circuitcrafters",
      "https://twitter.com/circuitcrafters",
      "https://linkedin.com/company/circuitcrafters",
      "https://youtube.com/circuitcrafters",
      "https://github.com/circuitcrafters",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@circuitcrafters.com",
    },
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Circuit Crafters",
    url: "https://yourwebsite.com",
    description: "Comprehensive IoT and Electronics learning platform",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://yourwebsite.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
};

// Helper to add structured data to page
export const addStructuredData = (data: any) => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
  return script;
};
