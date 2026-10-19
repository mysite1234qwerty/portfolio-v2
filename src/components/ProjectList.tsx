"use client";

import React from "react";
import { Project } from "@/content/projects";
import { sound } from "@/lib/sound";
import { ArrowUpRight } from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
}

export function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  return (
    <section id="archive" className="w-full max-w-5xl px-6 py-24 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            [ ARCHIVE & INVENTORY ]
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selected Works Index
          </h2>
        </div>
        <div className="text-xs font-mono text-neutral-400">
          SHOWING {projects.length} PROJECTS • 2024
        </div>
      </div>

      <div className="divide-y divide-neutral-900 border-t border-b border-neutral-900">
        {projects.map((p) => (
          <div
            key={p.slug}
            onClick={() => {
              sound.play("select");
              onSelectProject(p);
            }}
            onMouseEnter={() => sound.play("tab-hover")}
            className="group py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/40 px-4 rounded-xl transition-all"
          >
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-neutral-500 tabular-nums">
                {p.index}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  {p.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px]">
                {p.category}
              </span>
              <span className="tabular-nums text-neutral-500">{p.year}</span>
              <div className="p-2 rounded-full bg-neutral-900 text-neutral-400 group-hover:text-white group-hover:bg-neutral-800 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
