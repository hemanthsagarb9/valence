"use client";

import { useTheme } from "@/lib/theme";

export default function Logo({ size = 28 }: { size?: number }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Monochrome: dark bg + white cells in light mode, light bg + dark cells in dark mode
  const bgFill = isDark ? "#e8e8e8" : "#1a1a1e";
  const cellFill = isDark ? "#1a1a1e" : "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Rounded background */}
      <rect width="32" height="32" rx="8" fill={bgFill} />

      {/* Periodic table grid — simplified iconic shape */}
      {/* Row 1: 2 cells */}
      <rect x="5" y="5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />
      <rect x="23.5" y="5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />

      {/* Row 2: 2 + 6 */}
      <rect x="5" y="9.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />
      <rect x="9.5" y="9.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />
      <rect x="14.5" y="9.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />
      <rect x="19" y="9.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />
      <rect x="23.5" y="9.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />

      {/* Row 3: full width, 6 cells */}
      <rect x="5" y="14" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.9" />
      <rect x="9.5" y="14" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />
      <rect x="14.5" y="14" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.5" />
      <rect x="19" y="14" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.5" />
      <rect x="23.5" y="14" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />

      {/* Row 4: full width */}
      <rect x="5" y="18.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />
      <rect x="9.5" y="18.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.5" />
      <rect x="14.5" y="18.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.5" />
      <rect x="19" y="18.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.5" />
      <rect x="23.5" y="18.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.7" />

      {/* Row 5: lanthanide/actinide strip */}
      <rect x="9.5" y="23.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.35" />
      <rect x="14.5" y="23.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.35" />
      <rect x="19" y="23.5" width="3.5" height="3.5" rx="0.75" fill={cellFill} fillOpacity="0.35" />
    </svg>
  );
}
