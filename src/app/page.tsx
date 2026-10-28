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

  const handleSayHi = () => {
    const carousel = document.getElementById("work-carousel") as any;
    if (carousel && typeof carousel.set === "function") {
      carousel.set({ effect: "drum" });
    }
    if (typeof window !== "undefined" && (window as any).PFSound) {
      (window as any).PFSound.play("effect-drum");
    }

    const email = "aditi.sharma@nift.ac.in";
    const subject = "Collaboration Inquiry";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;

    let nativeAppOpened = false;
    const handleBlur = () => {
      nativeAppOpened = true;
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleBlur);
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleBlur);

    // 1. Primary default action: mailto link for users with configured email clients
    const a = document.createElement("a");
    a.href = mailtoUrl;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 2. Fallback: If no desktop mail client opens (window remains focused and active),
    // open Gmail web-composer in a new tab without duplicate windows
    setTimeout(() => {
      cleanup();
      if (!nativeAppOpened && document.hasFocus()) {
        try {
          window.open(gmailUrl, "_blank", "noopener,noreferrer");
        } catch {
          window.location.href = gmailUrl;
        }
      }
    }, 1000);
  };

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
                <span className="accent">NIFT Bengaluru</span>.
              </span>{" "}
              Bridging deep UX research, information architecture, and front-end engineering.
            </p>

            <nav className="links" aria-label="Elsewhere">
              <a href="https://www.behance.net/gallery/256956757/Canteen-20" target="_blank" rel="noopener noreferrer">
                Behance
              </a>
              <span className="dot" aria-hidden="true">•</span>
              <a
                href="https://www.linkedin.com/in/aditi-sharma-982093304/"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
              >
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
          effect="drum"
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
            onActivate={handleSayHi}
          />
        </div>
      </main>

      {/* Scripts */}
      <Script src="/vendor/card-carousel.js?v=6" strategy="afterInteractive" />
      <Script src="/js/sound.js?v=6" strategy="afterInteractive" />
      <Script src="/js/home.js?v=6" strategy="afterInteractive" />
    </>
  );
}
