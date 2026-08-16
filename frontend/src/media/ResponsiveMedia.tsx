import { PHOTO_MEDIA, type MediaItem } from './mediaRegistry';

interface ResponsiveMediaProps {
  mediaKey: keyof typeof PHOTO_MEDIA | MediaItem;
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
  const item = typeof mediaKey === 'string' ? PHOTO_MEDIA[mediaKey] : mediaKey;

  if (!item) {
    return null;
  }

  return (
    <picture className={`block overflow-hidden ${className}`} style={{ aspectRatio: aspectRatio || item.aspectRatio, ...style }}>
      <img
        src={item.src}
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
