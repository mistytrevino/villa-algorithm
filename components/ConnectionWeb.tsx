"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { pageEnter } from "@/lib/motion";
import { coupleState, type Islander } from "@/lib/types";
import islandersData from "@/data/islanders.json";

const islanders = islandersData as Islander[];

// Custom SVG so there are no graph dependencies. Phase 1 shows two link types:
// couples (gold) and shared home state (teal). More can layer on later.

const SIZE = 600;
const CENTER = SIZE / 2;
const RADIUS = 230;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

function stateOf(hometown: string | null): string | null {
  if (!hometown) return null;
  return hometown.split(",").pop()?.trim() ?? null;
}

type Node = Islander & { x: number; y: number; state: string | null };
type Edge = { a: string; b: string; type: "couple" | "state" };

export function ConnectionWeb() {
  const [hovered, setHovered] = useState<string | null>(null);

  const { nodes, edges, adjacency } = useMemo(() => {
    const nodes: Node[] = islanders.map((isl, i) => {
      const angle = (i / islanders.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...isl,
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
        state: stateOf(isl.hometown),
      };
    });

    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges: Edge[] = [];

    // Couples. partner is a first name, which matches the node id.
    for (const n of nodes) {
      if (!n.partner) continue;
      const partner = byId.get(n.partner.toLowerCase());
      if (partner && n.id < partner.id) {
        edges.push({ a: n.id, b: partner.id, type: "couple" });
      }
    }

    // Shared home state.
    const byState = new Map<string, Node[]>();
    for (const n of nodes) {
      if (!n.state) continue;
      (byState.get(n.state) ?? byState.set(n.state, []).get(n.state)!).push(n);
    }
    for (const group of byState.values()) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          edges.push({ a: group[i].id, b: group[j].id, type: "state" });
        }
      }
    }

    const adjacency = new Map<string, Set<string>>();
    for (const e of edges) {
      (adjacency.get(e.a) ?? adjacency.set(e.a, new Set()).get(e.a)!).add(e.b);
      (adjacency.get(e.b) ?? adjacency.set(e.b, new Set()).get(e.b)!).add(e.a);
    }

    return { nodes, edges, adjacency };
  }, []);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  function nodeActive(id: string): boolean {
    if (!hovered) return true;
    return id === hovered || (adjacency.get(hovered)?.has(id) ?? false);
  }
  function edgeActive(e: Edge): boolean {
    if (!hovered) return true;
    return e.a === hovered || e.b === hovered;
  }

  return (
    <motion.div variants={pageEnter} initial="initial" animate="animate">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="Connection web of the Season 8 cast"
      >
        {/* Edges first, under the nodes */}
        {edges.map((e, i) => {
          const a = byId.get(e.a)!;
          const b = byId.get(e.b)!;
          const active = edgeActive(e);
          const isCouple = e.type === "couple";
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isCouple ? "var(--color-gold)" : "var(--color-teal)"}
              strokeWidth={isCouple ? 2.5 : 1}
              opacity={active ? (isCouple ? 0.85 : 0.4) : 0.06}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const active = nodeActive(n.id);
          const dumped = coupleState(n) === "dumped";
          const isHover = hovered === n.id;
          return (
            <g
              key={n.id}
              opacity={active ? (dumped ? 0.5 : 1) : 0.2}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={22}
                fill="var(--color-night-2)"
                stroke={isHover ? "var(--color-gold)" : "rgba(255,255,255,0.18)"}
                strokeWidth={isHover ? 2.5 : 1.5}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="600"
                fill="var(--color-cream)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {initials(n.name)}
              </text>
              <text
                x={n.x}
                y={n.y + 36}
                textAnchor="middle"
                fontSize="12"
                fill="rgba(255,255,255,0.5)"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {firstName(n.name)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-gold" />
          <span className="font-body text-xs text-muted">Coupled up</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-teal" />
          <span className="font-body text-xs text-muted">Same home state</span>
        </span>
        <span className="font-body text-xs text-muted">Hover a name to trace its links</span>
      </div>
    </motion.div>
  );
}
