import { useRef } from "react";
import { FILM_PHOTOS, type PhotoId } from "./filmMedia";

export function Photo({
  id,
  className = "",
  priority = false,
  actor = true,
}: {
  id: PhotoId;
  className?: string;
  priority?: boolean;
  actor?: boolean;
}) {
  const p = FILM_PHOTOS[id];
  const captionRef = useRef<HTMLSpanElement>(null);
  return (
    <div
      className={`mi-photo mi-photo--${id} ${className}`}
      data-mi-actor={actor ? id : undefined}
      onPointerMove={(event) => {
        if (!captionRef.current || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        captionRef.current.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px)`;
      }}
    >
      <div className="mi-photo-crop">
        <img
          src={p.src}
          srcSet={p.srcSet}
          sizes="(max-width: 767px) 100vw, 75vw"
          alt={p.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: p.position }}
        />
      </div>
      <span ref={captionRef} className="mi-photo-pointer" aria-hidden="true">
        Explore ↗
      </span>
    </div>
  );
}
