"use client";

import * as React from "react";

import "../exp1.css";

/**
 * Scroll parallax transform. `factor` is negative so layers rise as the
 * page scrolls, bounded to `maxDown` px so nothing drifts off-screen.
 * Factors are intentionally strong so the depth is actually noticeable.
 */
function parallaxY(factor: number, maxDown: number) {
  return `translate3d(0, clamp(${-maxDown}px, calc(var(--sy, 0px) * ${factor}), 0px), 0)`;
}

type Blob = {
  left: string;
  top: string;
  w: number;
  h: number;
  o: number;
};

/** One fluffy cloud = three overlapping blurred blobs. */
function cloud(x: string, y: string, w: number, o: number): Blob[] {
  return [
    { left: x, top: y, w, h: Math.round(w * 0.34), o },
    {
      left: `calc(${x} + ${Math.round(w * 0.16)}px)`,
      top: `calc(${y} - ${Math.round(w * 0.11)}px)`,
      w: Math.round(w * 0.55),
      h: Math.round(w * 0.3),
      o,
    },
    {
      left: `calc(${x} + ${Math.round(w * 0.44)}px)`,
      top: y,
      w: Math.round(w * 0.62),
      h: Math.round(w * 0.26),
      o,
    },
  ];
}

/* Far layer — small, hazy clouds high in the sky */
const CLOUDS_FAR: Blob[] = [
  ...cloud("4%", "42%", 130, 0.5),
  ...cloud("30%", "28%", 100, 0.42),
  ...cloud("58%", "48%", 150, 0.55),
  ...cloud("82%", "32%", 110, 0.45),
];

/* Mid layer — normal clouds */
const CLOUDS_MID: Blob[] = [
  ...cloud("8%", "46%", 210, 0.75),
  ...cloud("42%", "30%", 170, 0.68),
  ...cloud("72%", "52%", 230, 0.8),
];

/* Near layer — big, bright clouds in the foreground */
const CLOUDS_NEAR: Blob[] = [
  ...cloud("2%", "40%", 320, 0.95),
  ...cloud("38%", "24%", 270, 0.9),
  ...cloud("66%", "46%", 350, 0.95),
];

type CloudRowProps = {
  blobs: Blob[];
  drift: string;
  reverse?: boolean;
  style: React.CSSProperties;
};

function CloudRow({ blobs, drift, reverse = false, style }: CloudRowProps) {
  const driftStyle = {
    "--drift": drift,
    animationDirection: reverse ? "reverse" : "normal",
  } as React.CSSProperties;
  return (
    <div className="parallax-layer" style={style}>
      <div className="parallax-drift" style={driftStyle}>
        {[0, 1].map((half) => (
          <div key={half} className="relative" aria-hidden="true">
            {blobs.map((blob, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white blur-[16px]"
                style={{
                  left: blob.left,
                  top: blob.top,
                  width: blob.w,
                  height: blob.h,
                  opacity: blob.o,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BirdRow({
  drift,
  style,
}: {
  drift: string;
  style: React.CSSProperties;
}) {
  const driftStyle = {
    "--drift": drift,
    animationDirection: "reverse",
  } as React.CSSProperties;
  return (
    <div className="parallax-layer" style={style}>
      <div className="parallax-drift" style={driftStyle}>
        {[0, 1].map((half) => (
          <svg
            key={half}
            viewBox="0 0 720 160"
            preserveAspectRatio="none"
            aria-hidden="true"
            fill="none"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path
              d="M110,70 q13,-15 26,0 q13,-15 26,0"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M330,44 q11,-13 22,0 q11,-13 22,0"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M540,86 q12,-14 24,0 q12,-14 24,0"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

/**
 * Fixed, full-viewport blue-sky backdrop with strong scroll parallax.
 * Pure CSS/SVG — no image assets. Renders behind all page content.
 */
export function SkyParallax() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      root.style.setProperty("--sy", `${window.scrollY}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Layer 0 · deep blue sky */}
      <div className="sky-gradient absolute inset-0" />

      {/* Layer 1 · sun */}
      <div
        className="sky-sun absolute rounded-full"
        style={{
          top: "7%",
          right: "13%",
          width: "min(34vw, 280px)",
          aspectRatio: "1 / 1",
          transform: parallaxY(-0.06, 160),
        }}
      />

      {/* Layer 2 · far clouds (slowest rise) */}
      <CloudRow
        blobs={CLOUDS_FAR}
        drift="170s"
        style={{ top: "3%", height: "20vh", transform: parallaxY(-0.12, 260) }}
      />

      {/* Layer 3 · birds */}
      <BirdRow
        drift="90s"
        style={{ top: "20%", height: "16vh", transform: parallaxY(-0.18, 340) }}
      />

      {/* Layer 4 · mid clouds (drift the other way) */}
      <CloudRow
        blobs={CLOUDS_MID}
        drift="110s"
        reverse
        style={{ top: "22%", height: "30vh", transform: parallaxY(-0.24, 460) }}
      />

      {/* Layer 5 · horizon haze */}
      <div className="sky-horizon" />

      {/* Layer 6 · near clouds (fastest rise, foreground) */}
      <CloudRow
        blobs={CLOUDS_NEAR}
        drift="75s"
        style={{ top: "54%", height: "42vh", transform: parallaxY(-0.38, 640) }}
      />
    </div>
  );
}
