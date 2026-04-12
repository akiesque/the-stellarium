import type { CSSProperties } from "react";

/** Matches portfolio silhouette accent (`PORTFOLIO_SILHOUETTE_COLOR`). */
const ACCENT = "#0d9488";
const ACCENT_DIM = "rgba(13, 148, 136, 0.22)";

const wrap: CSSProperties = {
  width: 32,
  height: 32,
  lineHeight: 0,
  flexShrink: 0,
  display: "block",
  contain: "strict",
  overflow: "hidden",
};

/**
 * Tiny SVG spinner for drei `Html`.
 * Uses SMIL `animateTransform` instead of CSS `transform` so it does not interact
 * badly with drei's `Html transform` / `preserve-3d` stack (which can blow up size).
 */
const Loader = () => (
  <div role="status" aria-label="Loading" style={wrap}>
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden focusable="false">
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke={ACCENT_DIM}
        strokeWidth="2.5"
      />
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="18 58"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 16 16"
          to="360 16 16"
          dur="0.75s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default Loader;
