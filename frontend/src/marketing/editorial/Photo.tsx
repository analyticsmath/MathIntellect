export type PhotoId =
  | "vanes"
  | "glider"
  | "velodrome"
  | "runner"
  | "observer"
  | "mechanism"
  | "turbine"
  | "chess"
  | "birds"
  | "dunes";
const descriptions: Record<PhotoId, string> = {
  vanes:
    "A person beneath the immense curved vanes of a wind tunnel, illuminated in warm and cool light.",
  glider: "A white glider banks through a towering cloud formation.",
  velodrome: "Two cyclists lean into the curve of a velodrome.",
  runner: "A runner suspended in mid-stride over a red track.",
  observer:
    "A person stands in the illuminated doorway of an observatory beneath a night sky.",
  mechanism:
    "A watch movement and precision tools arranged on a dark work surface.",
  turbine: "A wind turbine blade rises into a pale sky.",
  chess: "Two people consider their next move in a street chess game.",
  birds:
    "A flock of birds forms a sweeping shape against blue and white clouds.",
  dunes: "An immense dune landscape meets a coastal town at sunset.",
};
export function Photo({
  id,
  className = "",
  priority = false,
  decorative = false,
  sizes = "100vw",
}: {
  id: PhotoId;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  sizes?: string;
}) {
  return (
    <img
      className={className}
      src={`/media/math-intellect/editorial/${id}-1600.webp`}
      srcSet={[480, 960, 1600, 2400]
        .map((w) => `/media/math-intellect/editorial/${id}-${w}.webp ${w}w`)
        .join(", ")}
      sizes={sizes}
      alt={decorative ? "" : descriptions[id]}
      width={id === "chess" || id === "birds" ? 960 : 1600}
      height={
        id === "chess"
          ? 1707
          : id === "birds"
            ? 1440
            : id === "vanes"
              ? 1280
              : 1067
      }
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
