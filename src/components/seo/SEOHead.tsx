/**
 * Reusable SEO Head component using react-helmet-async.
 * Sets dynamic meta tags, Open Graph tags, canonical URL, and JSON-LD per page.
 */
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const BASE_URL = "https://mrmmabati.co.ke";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "MRM Mabati Rolling Mills";

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
  jsonLd,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : undefined;

  // Build JSON-LD strings for script tags
  const jsonLdStrings: string[] = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd.map((schema) => JSON.stringify({ "@context": "https://schema.org", ...schema }))
      : [JSON.stringify({ "@context": "https://schema.org", ...jsonLd })]
    : [];

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />
      <meta property="og:image" content={ogImage || DEFAULT_IMAGE} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || DEFAULT_IMAGE} />

      {/* JSON-LD structured data — rendered as inline script children (Helmet supports children for script) */}
      {jsonLdStrings.map((ld, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {ld}
        </script>
      ))}
    </Helmet>
  );
}
