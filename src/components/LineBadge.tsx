import type { Line } from "@/content/network";

/** A project's code in a neutral pill. Colour lives only on the map. */
export function LineBadge({ line, size = "md" }: { line: Line; size?: "md" | "lg" }) {
  return <span className={`badge badge-${size}`}>{line.code}</span>;
}
