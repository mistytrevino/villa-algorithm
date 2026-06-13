import { Check, X, Clock } from "lucide-react";
import type { PredictionOutcome } from "@/lib/types";

const CONFIG: Record<
  PredictionOutcome,
  { label: string; className: string; icon: typeof Check }
> = {
  pending: {
    label: "Pending",
    className: "bg-gold text-night",
    icon: Clock,
  },
  correct: {
    label: "Oracle was right",
    className: "bg-teal text-night",
    icon: Check,
  },
  wrong: {
    label: "Oracle was wrong",
    className: "bg-coral text-night",
    icon: X,
  },
};

export function PredictionBadge({ outcome }: { outcome: PredictionOutcome }) {
  const { label, className, icon: Icon } = CONFIG[outcome];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium ${className}`}
    >
      <Icon size={13} strokeWidth={2.5} />
      {label}
    </span>
  );
}
