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
  | "dunes"
  | "currents"
  | "climbers"
  | "traffic"
  | "shadows"
  | "surfer";
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
  currents:
    "White water curls around a small rocky island in a deep turquoise ocean.",
  climbers:
    "Three climbers prepare their ropes together against a golden sunset.",
  traffic:
    "Red and white light trails follow the curves of a highway at night.",
  shadows: "A spiral staircase and a person's shadow fall across a brick wall.",
  surfer: "A surfer follows a breaking wave beneath a pale evening sky.",
};
const heights: Record<PhotoId, number> = {
  vanes: 1280,
  glider: 900,
  velodrome: 1067,
  runner: 1067,
  observer: 1066,
  mechanism: 900,
  turbine: 1067,
  chess: 2845,
  birds: 2400,
  dunes: 900,
  currents: 2401,
  climbers: 1060,
  traffic: 2400,
  shadows: 2525,
  surfer: 1000,
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
      width={1600}
      height={heights[id]}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
