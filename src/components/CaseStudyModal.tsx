"use client";

import React, { useEffect } from "react";
import { Project } from "@/content/projects";
import { sound } from "@/lib/sound";
import { X, ExternalLink, ArrowRight, CheckCircle2, Layers, Cpu, Compass } from "lucide-react";

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sound.play("photo-close");
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleClose = () => {
    sound.play("photo-close");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-neutral-950/85 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl min-h-screen sm:min-h-0 my-auto rounded-none sm:rounded-3xl bg-neutral-900 border border-neutral-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-900/90 border-b border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${project.themeColor}22`, color: project.themeColor }}
            >
              {project.index}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              {project.category}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all active:scale-90"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 sm:px-12 py-8 sm:py-12 space-y-12">
          {/* Hero Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {project.disciplines.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 rounded-full text-xs font-mono text-neutral-400 bg-neutral-800/60 border border-neutral-700/50"
                >
                  {d}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
              {project.subtitle} — {project.summary}
            </p>
          </div>

          {/* Key Metrics Row */}
          {project.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
              {project.metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div
                    className="text-2xl sm:text-3xl font-mono font-bold"
                    style={{ color: project.themeColor }}
                  >
                    {m.value}
                  </div>
                  <div className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Challenge & Approach Section */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
                <Compass className="w-4 h-4 text-amber-400" />
                The Problem & Friction
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Strategic Approach
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {project.approach}
              </p>
            </div>
          </div>

          {/* Execution & Process Walkthrough */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-400">
              <Layers className="w-4 h-4 text-blue-400" />
              Design Architecture & Process Milestones
            </div>

            <div className="space-y-4">
              {project.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-xl bg-neutral-950/50 border border-neutral-800/70 hover:border-neutral-700 transition-colors"
                >
                  <span className="font-mono text-xs text-neutral-500 pt-0.5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes & Learnings */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-neutral-400">
              Key Outcomes
            </h3>
            <div className="space-y-2">
              {project.outcomes.map((out, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behance Link & Footer CTA */}
          <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            {project.behanceUrl ? (
              <a
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-950 font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>View Full Behance Case Study</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="text-xs font-mono text-neutral-500">
                In-house Case Study
              </div>
            )}

            <button
              onClick={handleClose}
              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              Back to 3D Showcase →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
