"use client";

import React, { useState } from "react";
import { site } from "@/content/site";
import { sound } from "@/lib/sound";
import { Copy, Check, ArrowUpRight } from "lucide-react";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    sound.play("select");
    navigator.clipboard.writeText(site.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="w-full max-w-5xl px-6 py-24 border-t border-neutral-900 space-y-16">
      <div className="space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          [ CONTACT & COLLABORATION ]
        </span>
        <h2 className="text-3xl sm:text-6xl font-bold tracking-tight text-white max-w-2xl leading-tight">
          {site.contact.headline}
        </h2>
        <p className="text-neutral-400 text-base max-w-xl">
          Always open to product design opportunities, design engineering explorations, and thoughtful conversations.
        </p>

        {/* Copyable email pill */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm font-mono hover:border-neutral-600 hover:bg-neutral-850 transition-all active:scale-95"
          >
            <span>{site.contact.email}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <Check className="w-4 h-4" /> Copied
              </span>
            ) : (
              <Copy className="w-4 h-4 text-neutral-400" />
            )}
          </button>
        </div>
      </div>

      {/* Social links & Copyright */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-12 border-t border-neutral-900 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-6">
          <a
            href={site.contact.behance}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sound.play("tab-hover")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>BEHANCE</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={site.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sound.play("tab-hover")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>LINKEDIN</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div>
          © {new Date().getFullYear()} {site.name} • CRAFTED WITH WEBGL & WEB AUDIO
        </div>
      </div>
    </footer>
  );
}
