"use client";

interface SuccessiveIEChartProps {
  energies: number[];
  rgb: string;
}

export default function SuccessiveIEChart({ energies, rgb }: SuccessiveIEChartProps) {
  if (!energies || energies.length === 0) return null;

  // Find the big jump: where energy jumps dramatically (core electron removal)
  // This happens when we complete a shell
  let jumpIndex = -1;
  let maxJump = 0;

  for (let i = 1; i < energies.length; i++) {
    const jump = energies[i] / energies[i - 1];
    if (jump > maxJump) {
      maxJump = jump;
      jumpIndex = i;
    }
  }

  // Use log scale since values can range from hundreds to hundred thousands
  const maxEnergy = Math.max(...energies);
  const maxLogValue = Math.log10(maxEnergy);
  const minLogValue = Math.log10(Math.min(...energies));
  const logRange = maxLogValue - minLogValue;

  // Calculate bar heights (120px max)
  const maxHeight = 120;
  const getBarHeight = (energy: number): number => {
    const logValue = Math.log10(energy);
    const normalized = (logValue - minLogValue) / logRange;
    return Math.max(8, normalized * maxHeight);
  };

  // Colors
  const baseColor = `rgba(${rgb}, 0.7)`;
  const jumpColor = `rgba(${rgb}, 0.95)`;
  const gridColor = `rgba(${rgb}, 0.08)`;

  return (
    <div className="rounded-lg border border-gray-100 dark:border-white/10 p-4 mb-4" style={{ background: `rgba(${rgb}, 0.02)` }}>
      {/* Label */}
      <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: `rgba(${rgb}, 0.65)` }}>
        Successive Ionization Energy
      </div>

      {/* Chart container */}
      <div className="flex items-end justify-between gap-1" style={{ height: `${maxHeight + 32}px` }}>
        {energies.map((energy, index) => {
          const height = getBarHeight(energy);
          const isJump = index === jumpIndex;
          const barColor = isJump ? jumpColor : baseColor;
          const ieFactor = index + 1;

          return (
            <div key={index} className="flex flex-col items-center flex-1 group relative">
              {/* Bar */}
              <div
                className="w-full rounded-t transition-opacity group-hover:opacity-80"
                style={{
                  height: `${height}px`,
                  background: barColor,
                  boxShadow: isJump ? `inset 0 0 0 1px rgba(${rgb}, 0.3)` : 'none',
                }}
              />

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 px-2 py-1 rounded bg-gray-900 dark:bg-gray-800 text-white text-[10px] opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {energy.toLocaleString()} kJ/mol
              </div>

              {/* Bar label (IE number) */}
              <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1 w-full text-center truncate">
                {ieFactor}
                <span className="text-[8px] block">IE</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {jumpIndex >= 0 && (
        <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
          <span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ background: jumpColor }} />
          Big jump at {jumpIndex + 1}st ionization
          {jumpIndex === 0 ? " (first core electron)" : ` (core electron removed)`}
        </div>
      )}
    </div>
  );
}
