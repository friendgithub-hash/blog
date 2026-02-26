import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  // FIXED: Check if src is an external URL (like Clerk user images)
  // External URLs (starting with http:// or https://) should use regular img tag
  const isExternalUrl =
    src?.startsWith("http://") || src?.startsWith("https://");

  // If external URL, use regular img tag instead of ImageKit
  if (isExternalUrl) {
    // FIXED: For external URLs, don't use className if w/h are provided
    // This prevents Tailwind size classes from conflicting with inline dimensions
    const imgClassName =
      w && h ? className?.replace(/\b(w-\d+|h-\d+)\b/g, "").trim() : className;

    return (
      <img
        src={src}
        alt={alt || ""}
        className={imgClassName}
        width={w}
        height={h}
        style={{
          objectFit: "cover",
        }}
        loading="lazy"
      />
    );
  }

  // For ImageKit paths, use IKImage component
  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
