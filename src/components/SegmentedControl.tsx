"use client";

import React, { useState, useRef, useEffect } from "react";
import { sound } from "@/lib/sound";

export type ControlStyle = "sheen" | "holo" | "flare" | "sparks" | "aura" | "glitch" | "embers";

interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

interface SegmentedControlProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  styleMode?: ControlStyle;
}

export function SegmentedControl({
  tabs,
  activeId,
  onChange,
  styleMode = "sheen",
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Calculate indicator position dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(`[data-tab-id="${activeId}"]`);
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeId, tabs]);

  const handleSelect = (id: string) => {
    sound.play("tab-select");
    onChange(id);
  };

  const handleMouseEnter = () => {
    sound.play("tab-hover");
  };

  // Micro-interaction visual effect styles
  const getFxClasses = () => {
    switch (styleMode) {
      case "holo":
        return "shadow-[0_0_16px_rgba(59,130,246,0.35),0_0_2px_rgba(255,255,255,0.8)] border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20";
      case "flare":
        return "shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-500/40 bg-rose-500/10";
      case "aura":
        return "shadow-[0_0_24px_rgba(16,185,129,0.3)] border border-emerald-500/30 bg-emerald-500/10";
      case "glitch":
        return "border border-neutral-600 bg-neutral-800 shadow-[2px_0_0_rgba(255,0,80,0.4),-2px_0_0_rgba(0,255,255,0.4)]";
      case "embers":
        return "shadow-[0_0_18px_rgba(249,115,22,0.35)] border border-amber-500/40 bg-gradient-to-r from-amber-600/20 to-orange-500/20";
      case "sparks":
        return "shadow-[0_0_15px_rgba(234,179,8,0.3)] border border-yellow-400/30 bg-yellow-500/10";
      case "sheen":
      default:
        return "border border-white/20 bg-neutral-800 shadow-[0_1px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center p-1 rounded-full bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-xl select-none"
    >
      {/* Spring Physics Active Tray Indicator */}
      <div
        className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ${getFxClasses()}`}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      >
        {/* Subtle diagonal ambient sheen sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[sheen_4s_infinite]" />
        </div>
      </div>

      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => handleSelect(tab.id)}
            onMouseEnter={handleMouseEnter}
            className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider tabular-nums transition-colors ${
              isActive
                ? "text-white font-medium"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
