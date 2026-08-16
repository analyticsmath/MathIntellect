import { MEDIA_REGISTRY, type MediaItem } from './mediaRegistry';

interface ResponsiveMediaProps {
  mediaKey: keyof typeof MEDIA_REGISTRY | MediaItem;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  style?: React.CSSProperties;
}

export const ResponsiveMedia: React.FC<ResponsiveMediaProps> = ({
  mediaKey,
  className = '',
  priority = false,
  aspectRatio,
  style,
}) => {
  const item = typeof mediaKey === 'string' ? MEDIA_REGISTRY[mediaKey] : mediaKey;

  if (!item) {
    return null;
  }

  return (
    <picture className={`block overflow-hidden ${className}`} style={{ aspectRatio: aspectRatio || item.aspectRatio, ...style }}>
      <source media="(max-width: 640px)" srcSet={item.mobileSrc} />
      <source media="(min-width: 641px)" srcSet={item.desktopSrc} />
      <img
        src={item.desktopSrc}
        alt={item.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className="w-full h-full object-cover object-center"
        style={{ objectPosition: item.focalPoint || 'center' }}
      />
    </picture>
  );
};
