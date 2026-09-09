import React from 'react';
import { MARKETING_MEDIA, type MarketingMediaAsset } from '../media/mediaManifest';

interface MediaPictureProps {
  id: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  focalVariant?: 'desktop' | 'tablet' | 'mobile';
  alt?: string;
  aspectRatio?: string;
  style?: React.CSSProperties;
}

export const MediaPicture: React.FC<MediaPictureProps> = ({
  id,
  className = '',
  imgClassName = '',
  priority = false,
  sizes = '100vw',
  focalVariant = 'desktop',
  alt,
  aspectRatio,
  style,
}) => {
  const asset: MarketingMediaAsset | undefined = MARKETING_MEDIA[id];

  if (!asset) {
    return (
      <div
        className={`bg-mi-rule flex items-center justify-center text-mi-muted font-mono text-xs ${className}`}
        style={style}
      >
        [Media {id} missing]
      </div>
    );
  }

  const focalPosition = asset.focal[focalVariant] || '50% 50%';
  const finalAlt = alt ?? asset.alt;

  // Build srcset strings for AVIF and WebP
  const avifEntries = Object.entries(asset.local.avif);
  const webpEntries = Object.entries(asset.local.webp);

  const avifSrcSet = avifEntries
    .map(([w, src]) => `${src} ${w}w`)
    .join(', ');

  const webpSrcSet = webpEntries
    .map(([w, src]) => `${src} ${w}w`)
    .join(', ');

  return (
    <picture className={`block relative overflow-hidden ${className}`} style={style}>
      {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      <img
        src={asset.source.src}
        alt={finalAlt}
        width={asset.source.width}
        height={asset.source.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`w-full h-full object-cover transition-opacity duration-500 ${imgClassName}`}
        style={{
          objectPosition: focalPosition,
          aspectRatio: aspectRatio,
        }}
      />
    </picture>
  );
};
