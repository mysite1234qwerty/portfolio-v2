"use client";

import React from "react";
import { site } from "@/content/site";
import { sound } from "@/lib/sound";
import { Sparkles, Terminal, BookOpen, Layers } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="w-full max-w-5xl px-6 py-24 space-y-16">
      {/* Editorial Title */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ABOUT THE DESIGNER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl">
          Turning systemic complexity into calm, tangible interactions.
        </h2>
      </div>

      {/* Grid: Bio Paragraphs & NIFT Info */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 space-y-6 text-neutral-300 leading-relaxed text-base sm:text-lg font-light">
          {site.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="pt-4 flex flex-wrap gap-2">
            {site.about.practices.map((practice) => (
              <span
                key={practice}
                onMouseEnter={() => sound.play("tab-hover")}
                className="px-3 py-1.5 rounded-full text-xs font-mono text-neutral-300 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-600 transition-colors cursor-default"
              >
                {practice}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar Cards: Institution & Philosophy */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Academic Foundation</span>
            </div>
            <div className="font-semibold text-white">
              {site.education}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Synthesizing material crafts, design methodologies, cognitive ergonomics, and digital design engineering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Toolkit & Synthesis</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {site.about.toolkit.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded bg-neutral-950 text-[11px] font-mono text-neutral-400 border border-neutral-800"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
