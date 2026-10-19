# Aditi Sharma — Product & UX Design Portfolio

A dynamic, interaction-focused portfolio inspired by the tactile WebGL and sound architecture of [gahan.earth](https://gahan.earth). Built with custom Web Components, Three.js custom shaders, polyphonic Web Audio API, and an integrated AI Design Assistant powered by Gemini.

---

## ✦ Key Features

- **WebGL 3D Card Carousel (`<card-carousel>`)**:
  - Powered by Three.js (r160+).
  - 5 real-time GPU distortion shaders: *Stretch*, *Bulge*, *Drum*, *Shatter*, and *Dust/Thanos*.
  - Spring physics with inertia and momentum flinging.
- **Micro-Interaction Segmented Controls (`<segmented-control>`)**:
  - Haptic-inspired fluid indicator tray.
  - Multi-state animations and Brockmann typography.
- **Polyphonic Web Audio Engine (`PFSound`)**:
  - Web Audio API zero-latency playback.
  - Zen sound bank mapped to carousel swiping, snapping, card taps, and drawer triggers.
- **Case Study Drawer & IA Storytelling**:
  - Deep-dive drawers for featured case studies: **Canteen 2.0**, **Breez**, **Evaara**, **Lumina**, and **Chronos**.
- **AI Design Assistant**:
  - Embedded bottom-left brainstorming companion.
  - Strictly guardrailed for UI/UX, interaction design, information architecture, and Aditi's case studies.
  - Powered by Google Gemini (`gemini-flash-lite-latest`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Gemini API key:
```bash
cp .env.example .env.local
```
Add your key:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Graphics**: Three.js, WebGL GLSL Shaders
- **Audio**: Web Audio API (`AudioContext`, `AudioBuffer`)
- **Styling**: Vanilla CSS tokens, Brockmann & Clash Grotesk fonts
- **AI**: Google Gemini API via Next.js Server Route (`/api/chat`)
