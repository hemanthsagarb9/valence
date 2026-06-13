"use client";

import { TrendType, LearningLevel } from "@/lib/types";
import { trends } from "@/data/trends";
import { useTheme } from "@/lib/theme";

interface TrendSelectorProps {
  activeTrend: TrendType | null;
  onTrendChange: (trend: TrendType) => void;
  level: LearningLevel;
}

export default function TrendSelector({ activeTrend, onTrendChange, level }: TrendSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const activeTrendData = trends.find(t => t.id === activeTrend);

  return (
    <div>
      {/* Trend list — compact, vertical, like the family legend */}
      <div className="space-y-0.5 mb-4">
        {trends.map((trend) => {
          const isActive = activeTrend === trend.id;
          return (
            <button
              key={trend.id}
              onClick={() => onTrendChange(trend.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                ${isActive
                  ? "bg-gray-800 dark:bg-white/15 text-white font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                }
              `}
            >
              {trend.name}
            </button>
          );
        })}
      </div>

      {/* Active trend info */}
      {activeTrendData && (
        <div>
          {/* Heatmap scale */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[9px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1.5">
              <span>Low</span>
              <span>High</span>
            </div>
            <div
              className="h-2 rounded-full"
              style={{
                background: isDark
                  ? "linear-gradient(to right, hsl(174, 40%, 15%), hsl(174, 50%, 28%), hsl(174, 60%, 38%), hsl(174, 80%, 50%))"
                  : "linear-gradient(to right, hsl(174, 30%, 95%), hsl(174, 50%, 75%), hsl(174, 65%, 58%), hsl(174, 80%, 45%))",
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-2 rounded-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 opacity-40" />
              <span className="text-[9px] text-gray-400 dark:text-gray-500">No data</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {level === "beginner" ? activeTrendData.beginnerExplanation : activeTrendData.description}
          </p>

          {/* Direction arrows */}
          <div className="space-y-1.5 text-[12px] text-gray-500 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 dark:text-gray-500 mt-px">→</span>
              <span>{activeTrendData.directionAcross}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 dark:text-gray-500 mt-px">↓</span>
              <span>{activeTrendData.directionDown}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
