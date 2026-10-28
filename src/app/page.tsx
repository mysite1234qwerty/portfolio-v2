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
          <img src="/assets/logo.png" alt="Aditi Sharma" width="38" height="38" />
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
              <a href="https://www.linkedin.com/in/aditi-sharma-982093304/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a
                href="mailto:aditi.sharma@nift.ac.in"
                className="email-link"
                data-email="aditi.sharma@nift.ac.in"
              >
                Email
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a
                href="/assets/Aditi_Sharma_Resume.pdf"
                download="Aditi_Sharma_Resume.pdf"
                className="resume-link"
                aria-label="Download Aditi Sharma Resume PDF"
              >
                Resume
              </a>
            </nav>
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
          radius="0.03"
          startcard="4"
          hfrac="0.40"
          wfrac="0.35"
          wfractall="0.68"
          gap="0.12"
          lift="0.02"
          images="/assets/projects/web/card-myjio.webp, /assets/projects/web/card-breez.webp, /assets/projects/web/card-canteen-2.webp, /assets/projects/web/card-foodmate.webp, /assets/projects/web/card-what-scene.webp, /assets/projects/web/card-gigverse.webp"
          aria-label="Projects — drag, scroll or use arrow keys; click any card to view on Behance"
        />

        {/* Bottom Centre: Glossy Black Venom Collaboration Button */}
        <div className="venom-dock">
          <VenomButton 
            label="SAY HI."
            onActivate={() => {
              window.location.href = "mailto:aditi.sharma@nift.ac.in?subject=Collaboration%20Inquiry";
            }}
          />
        </div>

        {/* Bottom Right: Effect-Selection Controls */}
        <div className="effect-switch">
          {/* @ts-expect-error Custom Web Component */}
          <segmented-control
            id="effect-control"
            appearance="light"
            options="Stretch, Drum, Shatter, Dust"
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

      {/* Scripts */}
      <Script src="/vendor/card-carousel.js?v=6" strategy="afterInteractive" />
      <Script src="/vendor/segmented-control.js?v=6" strategy="afterInteractive" />
      <Script src="/js/sound.js?v=6" strategy="afterInteractive" />
      <Script src="/js/home.js?v=6" strategy="afterInteractive" />
    </>
  );
}
