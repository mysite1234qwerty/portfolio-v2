/**
 * PFSound: Zero-latency Web Audio API Sound Engine
 * Inspired by gahan.earth sound subsystem
 * 
 * Supports polyphonic voice allocation, custom gain curves,
 * and synthesized tactile audio feedback without external audio files.
 */

type SoundType = "swipe" | "snap" | "select" | "tab-hover" | "tab-select" | "photo-close" | "toggle";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private voiceCount: number = 0;
  private readonly maxVoices: number = 5;

  constructor() {
    if (typeof window !== "undefined") {
      const savedSound = localStorage.getItem("pf.sound");
      // Default to unmuted (or muted if saved)
      this.isMuted = savedSound === "muted";
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("pf.sound", this.isMuted ? "muted" : "unmuted");
    }
    if (!this.isMuted) {
      this.play("toggle");
    }
    return this.isMuted;
  }

  public play(type: SoundType) {
    if (this.isMuted || typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx) return;

    if (this.voiceCount >= this.maxVoices) return;
    this.voiceCount++;

    const now = this.ctx.currentTime;

    try {
      switch (type) {
        case "swipe": {
          // Tactile frequency sweep for carousel scrub (short, subtle, organic click)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = "sine";
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.045);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.05);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "snap": {
          // Crisp resting card click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.065);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "select": {
          // Resonant card open tap
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(440, now);
          osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(660, now);
          osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.15);
          osc2.stop(now + 0.15);
          osc1.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "tab-hover": {
          // Micro tick on hover
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(1400, now);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.025);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "tab-select": {
          // Clean whoosh / filter sweep
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.1);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "photo-close": {
          // Soft reverse tap
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 0.07);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }

        case "toggle": {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.09);
          osc.onended = () => { this.voiceCount = Math.max(0, this.voiceCount - 1); };
          break;
        }
      }
    } catch {
      this.voiceCount = Math.max(0, this.voiceCount - 1);
    }
  }
}

export const sound = new SoundEngine();
