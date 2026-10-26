"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import VenomButton from "@/components/VenomButton";

export default function Home() {
  useEffect(() => {
    // Add 'home' class to body to match gahan.earth styles
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/styles.css" />

      {/* Header */}
      <header className="site-header">
        <a className="logomark" href="./" aria-label="Aditi Sharma — home">
          <img src="/assets/logomark.svg" alt="" width="24" height="24" />
          <span className="logomark-name">ADITI SHARMA</span>
        </a>

        <div className="intro">
          <p className="who-i-am">
            I design and build things that make complex systems feel intuitive, tactile, and visually effortless.
          </p>

          <div className="what-i-do">
            <p>
              Studying Product & UX Design at{" "}
              <span className="nowrap">
                <a className="accent" href="https://nift.ac.in/bengaluru/" target="_blank" rel="noopener noreferrer">
                  NIFT Bengaluru
                </a>
                .
              </span>{" "}
              Bridging deep UX research, information architecture, and front-end engineering.
            </p>

            <nav className="links" aria-label="Elsewhere">
              <a href="https://www.behance.net/gallery/256956757/Canteen-20" target="_blank" rel="noopener noreferrer">
                Behance
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a
                href="mailto:aditi.sharma.design@gmail.com"
                className="email-link"
                data-email="aditi.sharma.design@gmail.com"
              >
                Email
              </a>
            </nav>

            <div style={{ marginTop: "10px", pointerEvents: "auto" }}>
              <VenomButton 
                label="let’s collaborate"
                style={{ height: "96px", maxWidth: "300px", margin: "0" }}
                onActivate={() => {
                  window.location.href = "mailto:aditi.sharma.design@gmail.com?subject=Collaboration%20Inquiry";
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Center 3D Stage */}
      <main className="stage">
        <div className="carousel-frame" aria-hidden="true" />
        {/* @ts-expect-error Custom Web Component */}
        <card-carousel
          id="work-carousel"
          style={{ position: "absolute" }}
          effect="stretch"
          bg="#f2f2f2"
          radius="0"
          images="assets/projects/web/card-canteen-2.png, assets/projects/web/card-breez.png, assets/projects/web/card-evaara.png, assets/projects/web/card-lumina.png, assets/projects/web/card-chronos.png, assets/projects/web/card-circles.webp, assets/projects/web/card-arkade.webp, assets/projects/web/card-polls.webp, assets/projects/web/card-audioviz.webp"
          aria-label="Projects — drag, scroll or use arrow keys; click the centre card to open it"
        />

        <div className="effect-switch">
          {/* @ts-expect-error Custom Web Component */}
          <segmented-control
            id="effect-control"
            appearance="light"
            options="Stretch, Bulge, Drum, Shatter, Dust"
            selected="Stretch"
            size="36"
            pad="4.5"
            roundness="1"
            surface="#FFFFFF"
            indicator="#282B32"
            ink="#FFFFFF"
            ink-2="#82849A"
          />
        </div>
      </main>

      {/* Case Study Drawer */}
      <div id="drawer-backdrop" className="drawer-backdrop" aria-hidden="true" />
      <aside id="project-drawer" className="project-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header">
          <span id="drawer-category" className="drawer-tag">Product & Service Design</span>
          <button id="drawer-close" className="drawer-close" aria-label="Close Case Study">×</button>
        </div>

        <div>
          <h2 id="drawer-title" className="drawer-title">Canteen 2.0</h2>
          <p id="drawer-subtitle" className="drawer-subtitle">Campus Dining & Pickup Ecosystem</p>
          <p id="drawer-role" className="drawer-meta" style={{ marginTop: "8px" }} />
        </div>

        <div id="drawer-metrics" className="drawer-metrics" />

        <div className="drawer-section">
          <h3>Problem Statement</h3>
          <p id="drawer-challenge" />
        </div>

        <div className="drawer-section">
          <h3>Strategic Approach</h3>
          <p id="drawer-approach" />
        </div>

        <div className="drawer-section">
          <h3>Process & Milestones</h3>
          <div id="drawer-steps" className="drawer-steps" />
        </div>

        <div style={{ paddingTop: "16px" }}>
          <a id="drawer-behance" href="#" target="_blank" rel="noopener noreferrer" className="drawer-behance-btn">
            View Full Behance Case Study →
          </a>
        </div>
      </aside>

      {/* Scripts */}
      <Script src="/vendor/card-carousel.js" strategy="afterInteractive" />
      <Script src="/vendor/segmented-control.js" strategy="afterInteractive" />
      <Script src="/js/sound.js" strategy="afterInteractive" />
      <Script src="/js/home.js" strategy="lazyOnload" />
      <Script src="/js/chat.js" strategy="lazyOnload" />
    </>
  );
}
