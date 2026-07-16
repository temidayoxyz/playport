type ToneKind =
  | "click"
  | "correct"
  | "incorrect"
  | "win"
  | "lose"
  | "draw"
  | "drop"
  | "whoosh"
  | "tick";

interface AudioConfig {
  masterEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private unlocked = false;
  private config: AudioConfig = {
    masterEnabled: true,
    musicVolume: 0.4,
    effectsVolume: 0.7,
  };

  configure(partial: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    return this.ctx;
  }

  async unlock(): Promise<void> {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    this.unlocked = true;
  }

  play(kind: ToneKind): void {
    if (!this.config.masterEnabled || !this.unlocked) return;
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const vol = this.config.effectsVolume * 0.18;

    const presets: Record<ToneKind, { freq: number; type: OscillatorType; dur: number; endFreq?: number }> = {
      click: { freq: 520, type: "triangle", dur: 0.05 },
      correct: { freq: 520, type: "sine", dur: 0.12, endFreq: 780 },
      incorrect: { freq: 220, type: "sawtooth", dur: 0.14, endFreq: 140 },
      win: { freq: 440, type: "sine", dur: 0.35, endFreq: 880 },
      lose: { freq: 300, type: "triangle", dur: 0.3, endFreq: 120 },
      draw: { freq: 360, type: "sine", dur: 0.2 },
      drop: { freq: 180, type: "sine", dur: 0.1, endFreq: 90 },
      whoosh: { freq: 700, type: "sine", dur: 0.15, endFreq: 200 },
      tick: { freq: 880, type: "square", dur: 0.03 },
    };

    const p = presets[kind];
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, now);
    if (p.endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, p.endFreq), now + p.dur);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + p.dur + 0.02);
  }

  dispose(): void {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.unlocked = false;
    }
  }
}

export const audioManager = new AudioManager();
