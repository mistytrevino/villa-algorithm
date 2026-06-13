"use client";

import { useMemo, useState } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { motion } from "framer-motion";
import { pageEnter } from "@/lib/motion";
import { coupleState, type Islander } from "@/lib/types";
import islandersData from "@/data/islanders.json";
// us-atlas ships raw lng/lat topojson; geoAlbersUsa projects it (and our markers).
import statesTopo from "us-atlas/states-10m.json";

const islanders = islandersData as Islander[];
const W = 900;
const H = 560;

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

export function HometownMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const { statePaths, markers, abroad } = useMemo(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const topo = statesTopo as any;
    const fc = feature(topo, topo.objects.states) as any;
    const projection = geoAlbersUsa().fitSize([W, H], fc);
    const pathGen = geoPath(projection);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const statePaths: string[] = fc.features
      .map((f: unknown) => pathGen(f as Parameters<typeof pathGen>[0]))
      .filter((d: string | null): d is string => d !== null);

    const markers: { id: string; name: string; x: number; y: number; dumped: boolean }[] = [];
    const abroad: Islander[] = [];

    for (const isl of islanders) {
      if (isl.lat === null || isl.lng === null) continue;
      const xy = projection([isl.lng, isl.lat]); // null for non-US coordinates
      if (xy) {
        markers.push({
          id: isl.id,
          name: isl.name,
          x: xy[0],
          y: xy[1],
          dumped: coupleState(isl) === "dumped",
        });
      } else {
        abroad.push(isl);
      }
    }

    return { statePaths, markers, abroad };
  }, []);

  return (
    <motion.div variants={pageEnter} initial="initial" animate="animate">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Map of Season 8 islander hometowns"
      >
        {statePaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="var(--color-night-2)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.6}
          />
        ))}

        {markers.map((m) => {
          const active = hovered === m.id;
          return (
            <g
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={m.x}
                cy={m.y}
                r={active ? 8 : 6}
                fill={m.dumped ? "var(--color-coral)" : "var(--color-gold)"}
                fillOpacity={m.dumped ? 0.5 : 0.9}
                stroke="var(--color-night)"
                strokeWidth={1.5}
              />
              {active && (
                <text
                  x={m.x}
                  y={m.y - 12}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="var(--color-cream)"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {firstName(m.name)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className="mt-1 text-center font-body text-xs text-muted">
        Hover a dot for the name. Gold is in the villa, coral is dumped.
      </p>

      {abroad.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="label">Abroad</span>
          {abroad.map((isl) => (
            <span
              key={isl.id}
              className="rounded-full border border-white/15 px-3 py-1 font-body text-xs text-muted"
            >
              {firstName(isl.name)} · {isl.hometown}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
