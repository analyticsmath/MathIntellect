import { useState } from "react";
import { POSSIBILITY_MEDIA, type MediaRole } from "./mediaManifest";
export function MediaPlane({
  role,
  alt,
  className = "",
}: {
  role: MediaRole;
  alt: string;
  className?: string;
}) {
  const asset = POSSIBILITY_MEDIA[role];
  const [failures, setFailures] = useState(0);
  return (
    <picture className={"pe-media " + className}>
      {failures === 0 && (
        <>
          <source
            media="(max-width: 600px)"
            type="image/avif"
            srcSet={asset.base + "-portrait.avif"}
          />
          <source
            media="(max-width: 600px)"
            type="image/webp"
            srcSet={asset.portraitSrc}
          />
          <source
            media="(max-width: 1000px)"
            type="image/avif"
            srcSet={asset.base + "-tablet.avif"}
          />
          <source type="image/avif" srcSet={asset.base + "-wide.avif"} />
        </>
      )}
      {failures < 2 && (
        <img
          src={asset.wideSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="1920"
          height="1080"
          onError={() => setFailures((value) => Math.min(2, value + 1))}
        />
      )}
    </picture>
  );
}
