"use client";

import { useState } from "react";

// Islander avatar. Hotlinks the person's public Instagram avatar via unavatar.io,
// and falls back to initials on a brand-colored gradient when there is no handle
// or the image fails to load. No image is hosted or copied.

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

// Brand-palette gradient pairs (coral, gold, teal blends).
const GRADIENTS = [
  ["#FF5757", "#FFD166"],
  ["#06D6A0", "#FFD166"],
  ["#FF5757", "#06D6A0"],
  ["#FFD166", "#06D6A0"],
  ["#06D6A0", "#111827"],
  ["#FF5757", "#111827"],
];

function gradientFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % 9973;
  const [a, b] = GRADIENTS[hash % GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function Avatar({
  name,
  handle,
  size = 52,
}: {
  name: string;
  handle: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = handle && !failed;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 overflow-hidden rounded-full border border-white/10"
    >
      {showPhoto ? (
        // unavatar with fallback=false so a missing handle 404s and triggers onError.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://unavatar.io/instagram/${handle}?fallback=false`}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          style={{ background: gradientFor(name), fontSize: size * 0.36 }}
          className="flex h-full w-full items-center justify-center font-display font-semibold text-night"
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}
