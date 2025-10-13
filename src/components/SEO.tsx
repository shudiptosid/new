import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/default-og-image.jpg",
  url = "https://yourwebsite.com",
  type = "website",
  author = "Circuit Crafters",
  publishedTime,
  modifiedTime,
  category = "Electronics & IoT",
}) => {
  const fullTitle = `${title} | Circuit Crafters - IoT & Electronics Resources`;
  const canonicalUrl = `${url}${window.location.pathname}`;

  // Create JSON-LD structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fullTitle,
    description: description,
    url: canonicalUrl,
    author: {
      "@type": "Organization",
      name: author,
    },
    keywords: keywords.join(", "),
    inLanguage: "en-US",
    image: image,
    datePublished: publishedTime || new Date().toISOString(),
    dateModified: modifiedTime || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Circuit Crafters",
      logo: {
        "@type": "ImageObject",
        url: `${url}/logo.png`,
      },
    },
  };

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Primary Meta Tags
    setMetaTag("title", fullTitle);
    setMetaTag("description", description);
    setMetaTag("keywords", keywords.join(", "));
    setMetaTag("author", author);
    setMetaTag("robots", "index, follow");
    setMetaTag("language", "English");
    setMetaTag("revisit-after", "7 days");
    setMetaTag("category", category);

    // Open Graph
    setMetaTag("og:type", type, true);
    setMetaTag("og:url", canonicalUrl, true);
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:site_name", "Circuit Crafters", true);
    setMetaTag("og:locale", "en_US", true);

    if (publishedTime) {
      setMetaTag("article:published_time", publishedTime, true);
    }
    if (modifiedTime) {
      setMetaTag("article:modified_time", modifiedTime, true);
    }

    // Twitter
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:url", canonicalUrl);
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);

    // Additional SEO Tags
    setMetaTag("theme-color", "#3b82f6");
    setMetaTag("apple-mobile-web-app-capable", "yes");
    setMetaTag("apple-mobile-web-app-status-bar-style", "black");
    setMetaTag("format-detection", "telephone=no");

    // Add JSON-LD structured data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [
    fullTitle,
    description,
    keywords,
    canonicalUrl,
    image,
    type,
    author,
    publishedTime,
    modifiedTime,
    category,
    structuredData,
  ]);

  return null;
};

export default SEO;
