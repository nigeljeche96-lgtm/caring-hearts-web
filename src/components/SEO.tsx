import { Helmet } from "react-helmet-async";

const SITE_URL = "https://worldchangersmh.org";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  image?: string;
  ogType?: string;
  noindex?: boolean;
}

const SEO = ({ title, description, path, jsonLd, image, ogType = "website", noindex }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : null;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      {absoluteImage ? <meta property="og:image" content={absoluteImage} /> : null}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absoluteImage ? <meta name="twitter:image" content={absoluteImage} /> : null}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
