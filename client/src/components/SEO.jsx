import { useMemo, memo } from "react";

const SEO = memo(
  ({
    title,
    description,
    image,
    url,
    type = "website",
    author,
    publishedTime,
    modifiedTime,
    category,
    keywords = [],
    noIndex = false,
  }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
    const siteName = import.meta.env.VITE_SITE_NAME || "Blog";
    const defaultImage = `${siteUrl}/og-default.svg`;
    const defaultDescription =
      "Welcome to our blog. Discover articles about various topics.";

    // Ensure absolute URLs
    const absoluteImage = image
      ? image.startsWith("http")
        ? image
        : `${siteUrl}${image}`
      : defaultImage;

    const absoluteUrl = url
      ? url.startsWith("http")
        ? url
        : `${siteUrl}${url}`
      : siteUrl;

    // Truncate description to 160 characters
    const finalDescription = description || defaultDescription;
    const metaDescription =
      finalDescription.length > 160
        ? finalDescription.substring(0, 157) + "..."
        : finalDescription;

    // Generate structured data (minimized for performance)
    const structuredData = useMemo(() => {
      if (type === "article") {
        const articleData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: metaDescription,
          image: absoluteImage,
          datePublished: publishedTime,
          author: {
            "@type": "Person",
            name: author,
          },
          mainEntityOfPage: absoluteUrl,
        };

        // Only add optional fields if they exist to minimize payload
        if (modifiedTime) {
          articleData.dateModified = modifiedTime;
        }
        if (category) {
          articleData.articleSection = category;
        }
        if (siteName) {
          articleData.publisher = {
            "@type": "Organization",
            name: siteName,
          };
        }

        return articleData;
      }

      // Minimal WebSite schema for homepage
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      };
    }, [
      type,
      title,
      metaDescription,
      absoluteImage,
      publishedTime,
      modifiedTime,
      author,
      category,
      absoluteUrl,
      siteName,
      siteUrl,
    ]);

    const pageTitle = title ? `${title} | ${siteName}` : siteName;

    return (
      <>
        {/* React 19 Native Document Metadata */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(", ")} />
        )}
        <meta
          name="robots"
          content={
            noIndex
              ? "noindex, nofollow"
              : "index, follow, max-image-preview:large"
          }
        />
        <link rel="canonical" href={absoluteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title || siteName} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:url" content={absoluteUrl} />
        <meta property="og:site_name" content={siteName} />

        {type === "article" && author && (
          <>
            <meta property="article:published_time" content={publishedTime} />
            <meta
              property="article:modified_time"
              content={modifiedTime || publishedTime}
            />
            <meta property="article:author" content={author} />
            {category && <meta property="article:section" content={category} />}
          </>
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || siteName} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={absoluteImage} />
        {author && <meta name="twitter:creator" content={`@${author}`} />}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </>
    );
  },
);

SEO.displayName = "SEO";

export default SEO;
