"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sound } from "@/lib/sound";
import { Project } from "@/content/projects";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Eye } from "lucide-react";

export type ShaderEffect = "stretch" | "bulge" | "drum" | "shatter" | "thanos";

interface CardCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  activeEffect: ShaderEffect;
  onEffectChange: (effect: ShaderEffect) => void;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export function CardCarousel({
  projects,
  onSelectProject,
  activeEffect,
  onEffectChange,
}: CardCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [useCssFallback, setUseCssFallback] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const velocity = useRef(0);
  const lastPointerX = useRef(0);
  const pointerDownTime = useRef(0);
  const lastSoundTickScroll = useRef(0);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    setIsMuted(sound.muted);
  }, []);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const createCardTexture = (p: Project) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#1c1e24");
    grad.addColorStop(0.5, p.secondaryColor || "#101216");
    grad.addColorStop(1, "#0a0b0d");
    ctx.fillStyle = grad;
    drawRoundRect(ctx, 0, 0, canvas.width, canvas.height, 48);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 4;
    drawRoundRect(ctx, 4, 4, canvas.width - 8, canvas.height - 8, 46);
    ctx.stroke();

    const radial = ctx.createRadialGradient(850, 200, 10, 850, 200, 450);
    radial.addColorStop(0, p.themeColor + "66");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
    ctx.fillText(p.index, 72, 140);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "400 36px system-ui, -apple-system, sans-serif";
    ctx.fillText(p.year, 880, 140);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundRect(ctx, 72, 180, 420, 64, 32);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = p.themeColor;
    ctx.font = "600 28px system-ui, -apple-system, sans-serif";
    ctx.fillText(p.category.toUpperCase(), 104, 222);

    ctx.save();
    drawRoundRect(ctx, 72, 280, canvas.width - 144, 600, 28);
    ctx.clip();
    
    const artGrad = ctx.createLinearGradient(72, 280, canvas.width - 72, 880);
    artGrad.addColorStop(0, p.secondaryColor);
    artGrad.addColorStop(1, p.themeColor + "33");
    ctx.fillStyle = artGrad;
    ctx.fillRect(72, 280, canvas.width - 144, 600);

    ctx.beginPath();
    ctx.arc(512, 580, 180, 0, Math.PI * 2);
    ctx.strokeStyle = p.themeColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(512, 580, 90, 0, Math.PI * 2);
    ctx.fillStyle = p.themeColor + "44";
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 84px system-ui, -apple-system, sans-serif";
    ctx.fillText(p.title, 72, 980);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "400 40px system-ui, -apple-system, sans-serif";
    ctx.fillText(p.subtitle, 72, 1040);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "400 30px system-ui, -apple-system, sans-serif";
    ctx.fillText(`ROLE: ${p.role.toUpperCase()}`, 72, 1140);

    ctx.fillStyle = p.themeColor;
    ctx.font = "600 32px system-ui, -apple-system, sans-serif";
    ctx.fillText("VIEW CASE STUDY →", 72, 1310);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const savedSlug = sessionStorage.getItem("pf.lastProject");
    if (savedSlug) {
      const idx = projects.findIndex((p) => p.slug === savedSlug);
      if (idx !== -1) {
        targetScroll.current = idx;
        currentScroll.current = idx;
        setActiveIndex(idx);
        setScrollPos(idx);
      }
    }

    let webglAvailable = false;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (gl) webglAvailable = true;
    } catch {
      webglAvailable = false;
    }

    if (!webglAvailable) {
      setUseCssFallback(true);
    } else {
      try {
        const width = Math.max(container.clientWidth || 900, 320);
        const height = Math.max(container.clientHeight || 520, 420);

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 5.0);
        cameraRef.current = camera;

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;
        container.replaceChildren(renderer.domElement);

        const cardWidth = 2.1;
        const cardHeight = 2.9;
        const cardGeo = new THREE.PlaneGeometry(cardWidth, cardHeight, 32, 32);

        const effectMap: Record<ShaderEffect, number> = {
          stretch: 0,
          bulge: 1,
          drum: 2,
          shatter: 3,
          thanos: 4,
        };

        const vertexShader = `
          uniform float uProgress;
          uniform float uVelocity;
          uniform float uEffect;
          uniform float uTime;
          uniform float uCenterDist;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying float vCenterDist;

          void main() {
            vUv = uv;
            vNormal = normal;
            vec3 pos = position;
            vCenterDist = uCenterDist;

            if (uEffect == 0.0) {
              float stretchFactor = uVelocity * 0.12;
              pos.x += pos.x * abs(stretchFactor) * 0.8 + (pos.y * stretchFactor * 0.3);
              pos.z += cos(pos.x * 0.6) * abs(stretchFactor) * 0.5;
            } else if (uEffect == 1.0) {
              float dist = length(uv - 0.5);
              float bulge = sin((1.0 - clamp(dist * 2.0, 0.0, 1.0)) * 3.14159 * 0.5);
              pos.z += bulge * 0.5 * (1.0 + abs(uVelocity) * 2.0);
            } else if (uEffect == 2.0) {
              float theta = pos.x * 0.6;
              pos.x = sin(theta) * 1.6;
              pos.z += (cos(theta) - 1.0) * 0.9;
            } else if (uEffect == 3.0) {
              float noise = sin(pos.x * 8.0 + uTime * 3.0) * cos(pos.y * 8.0);
              pos += normal * noise * (abs(uVelocity) * 0.35 + 0.05);
            } else if (uEffect == 4.0) {
              float noise = sin(dot(pos.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453;
              pos += normal * fract(noise) * (abs(uVelocity) * 0.2 + 0.04);
            }

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `;

        const fragmentShader = `
          uniform sampler2D uTexture;
          uniform float uEffect;
          uniform float uTime;
          uniform float uVelocity;
          uniform float uCenterDist;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying float vCenterDist;

          void main() {
            vec2 uv = vUv;
            if (uEffect == 4.0) {
              float noise = fract(sin(dot(uv, vec2(12.9898, 78.233)) + uTime * 0.2) * 43758.5453);
              if (noise < abs(uVelocity) * 0.35) discard;
            }
            vec4 texColor = texture2D(uTexture, uv);
            float dimming = 1.0 - clamp(abs(vCenterDist) * 0.45, 0.0, 0.65);
            vec3 finalColor = texColor.rgb * dimming;
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            finalColor += vec3(0.15, 0.18, 0.25) * pow(rim, 3.0);
            gl_FragColor = vec4(finalColor, texColor.a);
          }
        `;

        const meshes: THREE.Mesh[] = [];
        const materials: THREE.ShaderMaterial[] = [];

        projects.forEach((p, i) => {
          const texture = createCardTexture(p);
          const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              uTexture: { value: texture },
              uProgress: { value: 0 },
              uVelocity: { value: 0 },
              uEffect: { value: effectMap[activeEffect] },
              uTime: { value: 0 },
              uCenterDist: { value: 0 },
            },
            transparent: true,
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(cardGeo, material);
          scene.add(mesh);
          meshes.push(mesh);
          materials.push(material);
        });

        materialsRef.current = materials;
      } catch {
        setUseCssFallback(true);
      }
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      lastTime = time;

      const diff = targetScroll.current - currentScroll.current;
      velocity.current = diff * 0.14;
      currentScroll.current += velocity.current;

      setScrollPos(currentScroll.current);

      if (Math.abs(currentScroll.current - lastSoundTickScroll.current) > 0.4) {
        sound.play("swipe");
        lastSoundTickScroll.current = currentScroll.current;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        const spacing = 2.6;
        const effectMap: Record<ShaderEffect, number> = {
          stretch: 0,
          bulge: 1,
          drum: 2,
          shatter: 3,
          thanos: 4,
        };

        sceneRef.current.children.forEach((child, i) => {
          if (child instanceof THREE.Mesh) {
            const offset = i - currentScroll.current;
            child.position.set(offset * spacing, 0, -Math.abs(offset) * 0.6);
            child.rotation.set(0, -offset * 0.22, 0);

            const mat = materialsRef.current[i];
            if (mat) {
              mat.uniforms.uProgress.value = currentScroll.current;
              mat.uniforms.uVelocity.value = velocity.current;
              mat.uniforms.uEffect.value = effectMap[activeEffect];
              mat.uniforms.uTime.value = time * 0.001;
              mat.uniforms.uCenterDist.value = offset;
            }
          }
        });

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      const nearest = Math.round(currentScroll.current);
      const clamped = Math.max(0, Math.min(projects.length - 1, nearest));
      if (clamped !== activeIndex) {
        setActiveIndex(clamped);
        sessionStorage.setItem("pf.lastProject", projects[clamped].slug);
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [projects]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerX.current = e.clientX;
    pointerDownTime.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    targetScroll.current -= deltaX * 0.0045;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const elapsed = Date.now() - pointerDownTime.current;
    if (elapsed < 200 && Math.abs(velocity.current) < 0.05) {
      const nearest = Math.round(targetScroll.current);
      if (nearest >= 0 && nearest < projects.length) {
        sound.play("select");
        onSelectProject(projects[nearest]);
      }
      return;
    }

    const snapIndex = Math.max(0, Math.min(projects.length - 1, Math.round(targetScroll.current)));
    targetScroll.current = snapIndex;
    sound.play("snap");
  };

  const handleWheel = (e: React.WheelEvent) => {
    targetScroll.current += e.deltaY * 0.002;
    const snapIndex = Math.max(0, Math.min(projects.length - 1, Math.round(targetScroll.current)));
    targetScroll.current = snapIndex;
  };

  const goToPrev = () => {
    const next = Math.max(0, activeIndex - 1);
    targetScroll.current = next;
    sound.play("snap");
  };

  const goToNext = () => {
    const next = Math.min(projects.length - 1, activeIndex + 1);
    targetScroll.current = next;
    sound.play("snap");
  };

  const getCardStyle = (i: number) => {
    const offset = i - scrollPos;
    const absOffset = Math.abs(offset);
    const spacing = 320;
    const translateX = offset * spacing;
    const translateZ = -absOffset * 130;
    const rotateY = -offset * 18;
    const scale = Math.max(0.74, 1 - absOffset * 0.14);
    const opacity = Math.max(0.25, 1 - absOffset * 0.45);
    const zIndex = Math.round(100 - absOffset * 10);

    let extraTransform = "";
    let extraFilter = "";

    if (activeEffect === "stretch") {
      const stretchX = 1 + Math.abs(velocity.current) * 0.7;
      extraTransform = ` scaleX(${stretchX}) skewX(${velocity.current * 12}deg)`;
    } else if (activeEffect === "bulge") {
      extraTransform = ` scale(${1 + (1 - Math.min(1, absOffset)) * 0.08})`;
    } else if (activeEffect === "drum") {
      extraTransform = ` rotateX(${offset * 8}deg)`;
    } else if (activeEffect === "shatter") {
      if (absOffset < 0.8 && Math.abs(velocity.current) > 0.02) {
        extraFilter = " drop-shadow(4px 4px 0px rgba(255,0,80,0.5)) drop-shadow(-4px -4px 0px rgba(0,255,255,0.5))";
      }
    } else if (activeEffect === "thanos") {
      if (Math.abs(velocity.current) > 0.04) {
        extraFilter = ` blur(${Math.min(6, Math.abs(velocity.current) * 40)}px)`;
      }
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})${extraTransform}`,
      filter: extraFilter,
      opacity,
      zIndex,
    };
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Top Bar: Card index & Sound Toggle */}
      <div className="z-20 w-full max-w-5xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            [ CARD {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} ]
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            {projects[activeIndex]?.title}
          </span>
        </div>

        <button
          onClick={handleToggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 backdrop-blur-md hover:border-neutral-600 transition-all active:scale-95"
          title="Toggle PFSound Web Audio engine"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">PFSOUND ON</span>
            </>
          )}
        </button>
      </div>

      {/* Main 3D Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full h-[400px] sm:h-[430px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none my-1"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={containerRef}
          className={`absolute inset-0 flex items-center justify-center ${useCssFallback ? "hidden" : "block"}`}
        />

        {useCssFallback && (
          <div
            className="relative w-full h-[380px] flex items-center justify-center pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((p, i) => {
              const isCenter = Math.abs(i - activeIndex) === 0;
              const hasCover = p.slug === "canteen-2";
              return (
                <div
                  key={p.slug}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.play("select");
                    onSelectProject(p);
                  }}
                  style={getCardStyle(i)}
                  className={`absolute w-[280px] sm:w-[310px] h-[370px] rounded-3xl p-5 flex flex-col justify-between transition-transform duration-75 ease-out pointer-events-auto cursor-pointer border backdrop-blur-xl ${
                    isCenter
                      ? "border-neutral-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.08)] bg-gradient-to-b from-[#1c1e24] via-[#121418] to-[#0a0b0d]"
                      : "border-neutral-800/60 bg-neutral-900/90"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-white">{p.index}</span>
                    <span className="font-mono text-xs text-neutral-500">{p.year}</span>
                  </div>

                  <div
                    className="relative w-full h-[150px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
                    style={{
                      background: hasCover ? undefined : `radial-gradient(circle at center, ${p.themeColor}33 0%, ${p.secondaryColor || "#101216"} 100%)`,
                    }}
                  >
                    {hasCover ? (
                      <img
                        src="/images/projects/canteen-2/cover.png"
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center animate-[pulse_4s_infinite]"
                        style={{ borderColor: p.themeColor }}
                      >
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: p.themeColor + "55" }}
                        />
                      </div>
                    )}
                    <span
                      className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md"
                      style={{
                        color: p.themeColor,
                        borderColor: p.themeColor + "44",
                        backgroundColor: p.themeColor + "20",
                      }}
                    >
                      {p.category}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{p.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-1">{p.subtitle}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        ROLE: {p.role.split(" ")[0]}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase"
                        style={{ color: p.themeColor }}
                      >
                        OPEN <Eye className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Controls: Navigation Arrows & 5 Shader Deformation Modes */}
      <div className="z-20 w-full max-w-5xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="p-2.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous Project"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === projects.length - 1}
            className="p-2.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next Project"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sound.play("select");
              onSelectProject(projects[activeIndex]);
            }}
            className="ml-2 px-4 py-2 rounded-full bg-white text-neutral-950 font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
          >
            Open Case Study
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-950/90 border border-neutral-800/80 backdrop-blur-lg">
          {(["stretch", "bulge", "drum", "shatter", "thanos"] as ShaderEffect[]).map((eff) => {
            const isActive = activeEffect === eff;
            return (
              <button
                key={eff}
                onClick={() => {
                  sound.play("tab-select");
                  onEffectChange(eff);
                }}
                onMouseEnter={() => sound.play("tab-hover")}
                className={`relative px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-neutral-800 text-white font-medium shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {eff === "thanos" ? "DUST" : eff}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
