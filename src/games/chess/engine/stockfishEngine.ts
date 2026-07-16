import { stockfishParams } from "../config";

export type EngineStatus = "idle" | "loading" | "ready" | "thinking" | "error";

type Listener = (bestMove: string | null, error?: string) => void;

/**
 * Lightweight UCI wrapper. Loads a Stockfish WASM build from public/engines
 * when available; otherwise falls back to a small random-legal-move "engine"
 * so chess remains playable offline without WASM.
 */
export class StockfishEngine {
  private worker: Worker | null = null;
  private status: EngineStatus = "idle";
  private pending: Listener | null = null;
  private ready = false;
  private fallback = false;

  getStatus(): EngineStatus {
    return this.status;
  }

  async init(): Promise<void> {
    if (this.worker || this.fallback) return;
    this.status = "loading";

    try {
      // Prefer local bundled worker script
      const base = import.meta.env.BASE_URL;
      this.worker = new Worker(`${base}engines/stockfish-worker.js`);
      this.worker.onmessage = (ev: MessageEvent<string>) => this.onMessage(String(ev.data));
      this.worker.onerror = () => {
        this.useFallback("Worker error");
      };
      this.send("uci");
      // Wait briefly for uciok
      await new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          if (!this.ready) this.useFallback("Engine timeout");
          resolve();
        }, 4000);
        const check = window.setInterval(() => {
          if (this.ready || this.fallback) {
            clearInterval(check);
            clearTimeout(t);
            resolve();
          }
        }, 50);
      });
    } catch {
      this.useFallback("Failed to start Stockfish");
    }
  }

  private useFallback(reason: string): void {
    this.fallback = true;
    this.status = "ready";
    this.ready = true;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    void reason;
  }

  private onMessage(line: string): void {
    if (line.includes("uciok")) {
      this.ready = true;
      this.status = "ready";
      return;
    }
    if (line.startsWith("bestmove")) {
      const parts = line.split(/\s+/);
      const move = parts[1] && parts[1] !== "(none)" ? parts[1] : null;
      this.status = "ready";
      this.pending?.(move);
      this.pending = null;
    }
  }

  private send(cmd: string): void {
    this.worker?.postMessage(cmd);
  }

  async getBestMove(fen: string, difficulty: string, legalMoves: string[]): Promise<string | null> {
    await this.init();
    const params = stockfishParams(difficulty);

    if (this.fallback || !this.worker) {
      // Difficulty-biased random: prefer captures notation roughly
      if (!legalMoves.length) return null;
      const idx =
        difficulty === "beginner"
          ? Math.floor(Math.random() * legalMoves.length)
          : Math.floor(Math.random() * Math.min(legalMoves.length, 4));
      return legalMoves[idx] ?? legalMoves[0] ?? null;
    }

    return new Promise((resolve) => {
      this.pending = (move) => resolve(move);
      this.status = "thinking";
      this.send("ucinewgame");
      this.send(`setoption name Skill Level value ${params.skill}`);
      this.send(`position fen ${fen}`);
      this.send(`go depth ${params.depth} movetime ${params.movetime}`);
      window.setTimeout(() => {
        if (this.pending) {
          this.send("stop");
        }
      }, params.movetime + 2000);
    });
  }

  destroy(): void {
    this.pending = null;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.ready = false;
    this.status = "idle";
  }
}

/** Testable message parser for worker lines */
export function parseBestMove(line: string): string | null {
  if (!line.startsWith("bestmove")) return null;
  const move = line.split(/\s+/)[1];
  if (!move || move === "(none)") return null;
  return move;
}
