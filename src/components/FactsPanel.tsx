"use client";

import { factChapters } from "@/data/facts";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FactsPanelProps {
  onClose: () => void;
}

export default function FactsPanel({ onClose }: FactsPanelProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const chapter = factChapters[activeChapter];

  const toggleSection = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Quick Revision</h3>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {factChapters.length} chapters — tap through before the exam
        </p>
      </div>

      {/* Chapter nav */}
      <div className="px-5 pb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {factChapters.map((ch, i) => (
          <button
            key={ch.title}
            onClick={() => { setActiveChapter(i); setCollapsed(new Set()); }}
            className={`
              shrink-0 px-2.5 py-1.5 rounded-md text-[10px] font-semibold transition-all
              ${i === activeChapter
                ? "bg-gray-800 text-white dark:bg-white/15 dark:text-gray-100"
                : "bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Chapter title */}
      <div className="px-5 pb-3">
        <h4 className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{chapter.title}</h4>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
        {chapter.sections.map((section, si) => {
          const key = `${activeChapter}-${si}`;
          const isCollapsed = collapsed.has(key);

          return (
            <div key={key}>
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-start gap-2 text-left group"
              >
                <span className="mt-1 shrink-0 text-gray-300 dark:text-gray-600">
                  {isCollapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
                </span>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {section.title}
                  </span>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                    {section.lead}
                  </p>
                </div>
              </button>

              {!isCollapsed && (
                <ul className="mt-2 ml-5 space-y-1.5">
                  {section.points.map((point, pi) => (
                    <li key={pi} className="flex gap-2 text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed">
                      <span className="text-gray-300 dark:text-gray-600 mt-px shrink-0">-</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        {/* Chapter nav bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
          <button
            onClick={() => { setActiveChapter(Math.max(0, activeChapter - 1)); setCollapsed(new Set()); }}
            disabled={activeChapter === 0}
            className="text-[11px] font-medium text-gray-400 dark:text-gray-500 disabled:opacity-30 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Previous
          </button>
          <span className="text-[10px] text-gray-300 dark:text-gray-600">
            {activeChapter + 1} / {factChapters.length}
          </span>
          <button
            onClick={() => { setActiveChapter(Math.min(factChapters.length - 1, activeChapter + 1)); setCollapsed(new Set()); }}
            disabled={activeChapter === factChapters.length - 1}
            className="text-[11px] font-medium text-gray-400 dark:text-gray-500 disabled:opacity-30 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
