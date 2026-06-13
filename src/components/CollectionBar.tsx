"use client";

import { ThematicCollection } from "@/lib/types";

interface CollectionBarProps {
  collections: ThematicCollection[];
  activeCollection: ThematicCollection | null;
  onSelect: (collection: ThematicCollection | null) => void;
}

export default function CollectionBar({
  collections,
  activeCollection,
  onSelect,
}: CollectionBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto collection-bar pb-0.5">
      <span className="text-[10px] text-gray-400 font-medium shrink-0">Collections:</span>
      {activeCollection && (
        <button
          onClick={() => onSelect(null)}
          className="shrink-0 px-2 py-1 rounded-full text-[11px] font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      )}
      {collections.map((c) => {
        const isActive = activeCollection?.id === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(isActive ? null : c)}
            className={`
              shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-300"
                  : "bg-white/60 text-gray-600 hover:bg-white hover:shadow-sm border border-gray-200/60"
              }
            `}
          >
            <span>{c.emoji}</span>
            <span>{c.name}</span>
            <span className="text-[9px] opacity-50">{c.elements.length}</span>
          </button>
        );
      })}
    </div>
  );
}
