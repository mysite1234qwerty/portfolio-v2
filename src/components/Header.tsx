"use client";

import React from "react";
import { site } from "@/content/site";
import { sound } from "@/lib/sound";

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const navItems = [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "archive", label: "Index" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-neutral-950/70 border-b border-neutral-800/50">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sound.play("select");
            onNavigate("work");
          }}
          className="group flex items-center gap-2"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
          <span className="font-semibold text-sm tracking-tight text-white">
            {site.name}
          </span>
        </a>
        <span className="hidden sm:inline-block text-xs font-mono text-neutral-500 border-l border-neutral-800 pl-3">
          {site.roles[0]}
        </span>
      </div>

      {/* Center Segmented Nav */}
      <nav className="flex items-center p-1 rounded-full bg-neutral-900/90 border border-neutral-800 backdrop-blur-lg">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.play("tab-select");
                onNavigate(item.id);
              }}
              onMouseEnter={() => sound.play("tab-hover")}
              className={`px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-neutral-800 text-white font-medium shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Location / Status badge */}
      <div className="hidden md:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono text-neutral-400">
          NIFT BLR • AVAILABLE
        </span>
      </div>
    </header>
  );
}
