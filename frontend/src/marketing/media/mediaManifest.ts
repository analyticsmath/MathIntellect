export type MediaEvidence = "PRODUCT_EVIDENCE" | "CONTEXT" | "ILLUSTRATIVE";

export interface MarketingMediaAsset {
  id: string;
  unsplashId: string;
  creator: string;
  creatorHandle: string;
  canonicalUrl: string;
  evidence: MediaEvidence;
  source: {
    width: number;
    height: number;
    src: string;
  };
  local: {
    source: string;
    avif: Record<number, string>;
    webp: Record<number, string>;
  };
  focal: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  alt: string;
}

export const MARKETING_MEDIA: Record<string, MarketingMediaAsset> = {
  "MI-PH-001": {
    id: "MI-PH-001",
    unsplashId: "dKY8oiGPLYY",
    creator: "Darya Azokhava",
    creatorHandle: "@darya_cherryda",
    canonicalUrl: "https://unsplash.com/photos/dKY8oiGPLYY",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4928,
      height: 3264,
      src: "/media/math-intellect/source/mi-crossing-desktop-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-crossing-desktop-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-crossing-desktop-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-crossing-desktop-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-crossing-desktop-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-crossing-desktop-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-crossing-desktop-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-crossing-desktop-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-crossing-desktop-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-crossing-desktop-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 52%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Pedestrians moving across an open city crossing seen from above",
  },
  "MI-PH-002": {
    id: "MI-PH-002",
    unsplashId: "zj3k2rfqDns",
    creator: "Jason Ross",
    creatorHandle: "@_snid_",
    canonicalUrl: "https://unsplash.com/photos/zj3k2rfqDns",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4000,
      height: 6000,
      src: "/media/math-intellect/source/mi-crossing-mobile-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-crossing-mobile-01.jpg",
      avif: {
        640: "/media/math-intellect/optimized/avif/mi-crossing-mobile-01-640.avif",
        960: "/media/math-intellect/optimized/avif/mi-crossing-mobile-01-960.avif",
        1280: "/media/math-intellect/optimized/avif/mi-crossing-mobile-01-1280.avif",
      },
      webp: {
        640: "/media/math-intellect/optimized/webp/mi-crossing-mobile-01-640.webp",
        960: "/media/math-intellect/optimized/webp/mi-crossing-mobile-01-960.webp",
        1280: "/media/math-intellect/optimized/webp/mi-crossing-mobile-01-1280.webp",
      },
    },
    focal: {
      desktop: "50% 48%",
      tablet: "50% 48%",
      mobile: "50% 48%",
    },
    alt: "High-angle vertical view of individuals traversing a marked urban intersection",
  },
  "MI-PH-003": {
    id: "MI-PH-003",
    unsplashId: "Y1tpaNkoyYw",
    creator: "Darya Azokhava",
    creatorHandle: "@darya_cherryda",
    canonicalUrl: "https://unsplash.com/photos/Y1tpaNkoyYw",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4688,
      height: 3264,
      src: "/media/math-intellect/source/mi-crossing-shadow-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-crossing-shadow-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-crossing-shadow-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-crossing-shadow-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-crossing-shadow-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-crossing-shadow-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-crossing-shadow-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-crossing-shadow-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-crossing-shadow-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-crossing-shadow-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Pedestrians casting long shadows across pale paved pavement",
  },
  "MI-PH-004": {
    id: "MI-PH-004",
    unsplashId: "cE_bS9C01Ag",
    creator: "Zoshua Colah",
    creatorHandle: "@zoshuacolah",
    canonicalUrl: "https://unsplash.com/photos/cE_bS9C01Ag",
    evidence: "CONTEXT",
    source: {
      width: 5472,
      height: 3648,
      src: "/media/math-intellect/source/mi-intersection-overhead-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-intersection-overhead-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-intersection-overhead-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-intersection-overhead-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-intersection-overhead-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-intersection-overhead-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-intersection-overhead-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-intersection-overhead-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-intersection-overhead-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-intersection-overhead-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Direct overhead view of an intersecting urban transport network",
  },
  "MI-PH-005": {
    id: "MI-PH-005",
    unsplashId: "b7MZ6iGIoSI",
    creator: "James Wainscoat",
    creatorHandle: "@tumbao1949",
    canonicalUrl: "https://unsplash.com/photos/b7MZ6iGIoSI",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5142,
      height: 3428,
      src: "/media/math-intellect/source/mi-murmuration-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-murmuration-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-murmuration-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-murmuration-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-murmuration-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-murmuration-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-murmuration-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-murmuration-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-murmuration-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-murmuration-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 44%",
      tablet: "50% 44%",
      mobile: "50% 44%",
    },
    alt: "Flock of starlings forming a dense collective murmuration against the sky",
  },
  "MI-PH-006": {
    id: "MI-PH-006",
    unsplashId: "jKNR--HDA_A",
    creator: "Pete Godfrey",
    creatorHandle: "@octopus_photo",
    canonicalUrl: "https://unsplash.com/photos/jKNR--HDA_A",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5432,
      height: 3621,
      src: "/media/math-intellect/source/mi-murmuration-sunset-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-murmuration-sunset-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-murmuration-sunset-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-murmuration-sunset-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-murmuration-sunset-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-murmuration-sunset-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-murmuration-sunset-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-murmuration-sunset-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-murmuration-sunset-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-murmuration-sunset-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 45%",
      tablet: "50% 45%",
      mobile: "50% 45%",
    },
    alt: "Collective bird murmuration billowing over horizon at dusk",
  },
  "MI-PH-007": {
    id: "MI-PH-007",
    unsplashId: "3EB6j0KWtaM",
    creator: "Mohamed Fsili",
    creatorHandle: "@mfsili",
    canonicalUrl: "https://unsplash.com/photos/3EB6j0KWtaM",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4524,
      height: 3016,
      src: "/media/math-intellect/source/mi-murmuration-olive-03.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-murmuration-olive-03.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-murmuration-olive-03-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-murmuration-olive-03-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-murmuration-olive-03-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-murmuration-olive-03-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-murmuration-olive-03-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-murmuration-olive-03-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-murmuration-olive-03-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-murmuration-olive-03-2560.webp",
      },
    },
    focal: {
      desktop: "50% 48%",
      tablet: "50% 48%",
      mobile: "50% 48%",
    },
    alt: "Swarm pattern moving over open terrain",
  },
  "MI-PH-008": {
    id: "MI-PH-008",
    unsplashId: "GygPFmXGD1o",
    creator: "Dan Roizer",
    creatorHandle: "@danroizer",
    canonicalUrl: "https://unsplash.com/photos/GygPFmXGD1o",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5616,
      height: 3744,
      src: "/media/math-intellect/source/mi-river-branching-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-river-branching-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-river-branching-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-river-branching-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-river-branching-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-river-branching-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-river-branching-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-river-branching-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-river-branching-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-river-branching-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Aerial perspective of a branching glacial river delta spreading through sediment",
  },
  "MI-PH-009": {
    id: "MI-PH-009",
    unsplashId: "4ZCA3xukIso",
    creator: "Wynand Uys",
    creatorHandle: "@wynand_uys",
    canonicalUrl: "https://unsplash.com/photos/4ZCA3xukIso",
    evidence: "CONTEXT",
    source: {
      width: 5334,
      height: 3319,
      src: "/media/math-intellect/source/mi-river-okavango-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-river-okavango-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-river-okavango-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-river-okavango-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-river-okavango-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-river-okavango-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-river-okavango-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-river-okavango-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-river-okavango-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-river-okavango-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Extensive branching water channels navigating floodplain topography",
  },
  "MI-PH-010": {
    id: "MI-PH-010",
    unsplashId: "9v1cuPQ5hKM",
    creator: "Jakub Nawrot",
    creatorHandle: "@jacob_lens",
    canonicalUrl: "https://unsplash.com/photos/9v1cuPQ5hKM",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 3625,
      height: 2715,
      src: "/media/math-intellect/source/mi-rail-yard-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-rail-yard-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-rail-yard-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-rail-yard-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-rail-yard-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-rail-yard-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-rail-yard-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-rail-yard-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-rail-yard-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-rail-yard-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 52%",
      tablet: "50% 52%",
      mobile: "50% 52%",
    },
    alt: "High-angle view of parallel and converging tracks across an expansive rail freight yard",
  },
  "MI-PH-011": {
    id: "MI-PH-011",
    unsplashId: "ywUOMuLZovY",
    creator: "Bence Balla-Schottner",
    creatorHandle: "@ballaschottner",
    canonicalUrl: "https://unsplash.com/photos/ywUOMuLZovY",
    evidence: "CONTEXT",
    source: {
      width: 5369,
      height: 3604,
      src: "/media/math-intellect/source/mi-rail-tracks-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-rail-tracks-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-rail-tracks-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-rail-tracks-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-rail-tracks-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-rail-tracks-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-rail-tracks-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-rail-tracks-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-rail-tracks-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-rail-tracks-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Linear perspective looking down straight parallel railway tracks",
  },
  "MI-PH-012": {
    id: "MI-PH-012",
    unsplashId: "lRfjCsJOWSM",
    creator: "Patrick Federi",
    creatorHandle: "@federi",
    canonicalUrl: "https://unsplash.com/photos/lRfjCsJOWSM",
    evidence: "CONTEXT",
    source: {
      width: 4000,
      height: 2250,
      src: "/media/math-intellect/source/mi-rail-hub-03.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-rail-hub-03.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-rail-hub-03-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-rail-hub-03-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-rail-hub-03-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-rail-hub-03-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-rail-hub-03-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-rail-hub-03-768.webp",
        1920: "/media/math-intellect/optimized/webp/mi-rail-hub-03-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-rail-hub-03-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Overhead view of a major railway junction with switching points",
  },
  "MI-PH-013": {
    id: "MI-PH-013",
    unsplashId: "wiIqTWoiUQY",
    creator: "Efim Borisov",
    creatorHandle: "@efimborisov",
    canonicalUrl: "https://unsplash.com/photos/wiIqTWoiUQY",
    evidence: "CONTEXT",
    source: {
      width: 5464,
      height: 3640,
      src: "/media/math-intellect/source/mi-cargo-port-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-cargo-port-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-cargo-port-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-cargo-port-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-cargo-port-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-cargo-port-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-cargo-port-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-cargo-port-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-cargo-port-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-cargo-port-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Aerial overview of industrial container terminal and cargo shipping infrastructure",
  },
  "MI-PH-014": {
    id: "MI-PH-014",
    unsplashId: "IVG8SDczupk",
    creator: "Logan Voss",
    creatorHandle: "@loganvoss",
    canonicalUrl: "https://unsplash.com/photos/IVG8SDczupk",
    evidence: "CONTEXT",
    source: {
      width: 8064,
      height: 6048,
      src: "/media/math-intellect/source/mi-cargo-aerial-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-cargo-aerial-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-cargo-aerial-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-cargo-aerial-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-cargo-aerial-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-cargo-aerial-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-cargo-aerial-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-cargo-aerial-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-cargo-aerial-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-cargo-aerial-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "High-altitude view of container ship moving through calm water",
  },
  "MI-PH-015": {
    id: "MI-PH-015",
    unsplashId: "0A7YwYhZhWw",
    creator: "Bent Van Aeken",
    creatorHandle: "@bentje",
    canonicalUrl: "https://unsplash.com/photos/0A7YwYhZhWw",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4022,
      height: 2897,
      src: "/media/math-intellect/source/mi-container-topdown-03.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-container-topdown-03.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-container-topdown-03-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-container-topdown-03-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-container-topdown-03-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-container-topdown-03-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-container-topdown-03-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-container-topdown-03-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-container-topdown-03-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-container-topdown-03-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Top-down orthographic grid of stacked shipping containers",
  },
  "MI-PH-016": {
    id: "MI-PH-016",
    unsplashId: "FPKnAO-CF6M",
    creator: "Venti Views",
    creatorHandle: "@ventiviews",
    canonicalUrl: "https://unsplash.com/photos/FPKnAO-CF6M",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5464,
      height: 3640,
      src: "/media/math-intellect/source/mi-cargo-flow-04.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-cargo-flow-04.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-cargo-flow-04-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-cargo-flow-04-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-cargo-flow-04-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-cargo-flow-04-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-cargo-flow-04-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-cargo-flow-04-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-cargo-flow-04-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-cargo-flow-04-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Cargo vessel wake tracking linear directional flow across sea",
  },
  "MI-PH-017": {
    id: "MI-PH-017",
    unsplashId: "Q5QspluNZmM",
    creator: "Linus Nylund",
    creatorHandle: "@dreamsoftheoceans",
    canonicalUrl: "https://unsplash.com/photos/Q5QspluNZmM",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4898,
      height: 3265,
      src: "/media/math-intellect/source/mi-water-field-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-water-field-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-water-field-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-water-field-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-water-field-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-water-field-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-water-field-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-water-field-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-water-field-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-water-field-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Rippling water surface texture exhibiting propagating wave dynamics",
  },
  "MI-PH-018": {
    id: "MI-PH-018",
    unsplashId: "kKpTHqM2K-c",
    creator: "Jackson Hendry",
    creatorHandle: "@actionjackson801",
    canonicalUrl: "https://unsplash.com/photos/kKpTHqM2K-c",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5653,
      height: 3774,
      src: "/media/math-intellect/source/mi-water-rings-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-water-rings-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-water-rings-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-water-rings-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-water-rings-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-water-rings-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-water-rings-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-water-rings-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-water-rings-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-water-rings-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Concentric circular ripples propagating outward on still water",
  },
  "MI-PH-019": {
    id: "MI-PH-019",
    unsplashId: "ZpKxweXHqkc",
    creator: "Biel Morro",
    creatorHandle: "@bielmorro",
    canonicalUrl: "https://unsplash.com/photos/ZpKxweXHqkc",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5875,
      height: 3916,
      src: "/media/math-intellect/source/mi-water-dark-03.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-water-dark-03.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-water-dark-03-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-water-dark-03-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-water-dark-03-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-water-dark-03-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-water-dark-03-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-water-dark-03-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-water-dark-03-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-water-dark-03-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Dark oceanic surface texture in calm light",
  },
  "MI-PH-020": {
    id: "MI-PH-020",
    unsplashId: "fyi2-m9asWg",
    creator: "Alex Diaz",
    creatorHandle: "@memory_terra",
    canonicalUrl: "https://unsplash.com/photos/fyi2-m9asWg",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4000,
      height: 2250,
      src: "/media/math-intellect/source/mi-desert-road-01.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-desert-road-01.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-desert-road-01-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-desert-road-01-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-desert-road-01-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-desert-road-01-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-desert-road-01-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-desert-road-01-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-desert-road-01-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-desert-road-01-2560.webp",
      },
    },
    focal: {
      desktop: "50% 48%",
      tablet: "50% 48%",
      mobile: "50% 48%",
    },
    alt: "Single paved highway cutting straight across vast flat arid desert",
  },
  "MI-PH-021": {
    id: "MI-PH-021",
    unsplashId: "rbDvm1HBJqg",
    creator: "Alex Diaz",
    creatorHandle: "@memory_terra",
    canonicalUrl: "https://unsplash.com/photos/rbDvm1HBJqg",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 4000,
      height: 2250,
      src: "/media/math-intellect/source/mi-desert-road-02.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-desert-road-02.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-desert-road-02-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-desert-road-02-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-desert-road-02-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-desert-road-02-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-desert-road-02-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-desert-road-02-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-desert-road-02-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-desert-road-02-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Long desert road vanishing toward horizon under clear sky",
  },
  "MI-PH-022": {
    id: "MI-PH-022",
    unsplashId: "1BJgOSThXbw",
    creator: "naeim jafari",
    creatorHandle: "@naeimj",
    canonicalUrl: "https://unsplash.com/photos/1BJgOSThXbw",
    evidence: "ILLUSTRATIVE",
    source: {
      width: 5272,
      height: 2960,
      src: "/media/math-intellect/source/mi-desert-road-03.jpg",
    },
    local: {
      source: "/media/math-intellect/source/mi-desert-road-03.jpg",
      avif: {
        768: "/media/math-intellect/optimized/avif/mi-desert-road-03-768.avif",
        1280: "/media/math-intellect/optimized/avif/mi-desert-road-03-1280.avif",
        1920: "/media/math-intellect/optimized/avif/mi-desert-road-03-1920.avif",
        2560: "/media/math-intellect/optimized/avif/mi-desert-road-03-2560.avif",
      },
      webp: {
        768: "/media/math-intellect/optimized/webp/mi-desert-road-03-768.webp",
        1280: "/media/math-intellect/optimized/webp/mi-desert-road-03-1280.webp",
        1920: "/media/math-intellect/optimized/webp/mi-desert-road-03-1920.webp",
        2560: "/media/math-intellect/optimized/webp/mi-desert-road-03-2560.webp",
      },
    },
    focal: {
      desktop: "50% 50%",
      tablet: "50% 50%",
      mobile: "50% 50%",
    },
    alt: "Winding road snaking through open mountain landscape",
  },
};
