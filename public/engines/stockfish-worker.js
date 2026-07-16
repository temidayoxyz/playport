/**
 * Stockfish-compatible UCI worker.
 * Attempts to load a full Stockfish WASM build when present; otherwise
 * provides a minimal legal-move UCI stub so messaging still works in tests
 * and offline environments without the large binary.
 *
 * To enable full Stockfish: place stockfish.js + stockfish.wasm beside this file
 * and set USE_FULL_ENGINE = true after verifying the build.
 */
const USE_FULL_ENGINE = false;

let ready = false;

function post(line) {
  self.postMessage(line);
}

if (USE_FULL_ENGINE) {
  try {
    importScripts("stockfish.js");
  } catch (e) {
    post("info string failed to load stockfish.js");
  }
}

// Minimal UCI responder (fallback / default for portable demos)
self.onmessage = function (e) {
  const cmd = String(e.data || "").trim();
  if (cmd === "uci") {
    post("id name PlayPort Stockfish Worker");
    post("id author PlayPort");
    post("option name Skill Level type spin default 10 min 0 max 20");
    post("uciok");
    ready = true;
    return;
  }
  if (cmd === "isready") {
    post("readyok");
    return;
  }
  if (cmd === "ucinewgame") return;
  if (cmd.startsWith("setoption")) return;
  if (cmd.startsWith("position")) return;
  if (cmd.startsWith("go")) {
    // Without full engine, parent provides legal moves via its own fallback path
    // when bestmove is delayed. Still answer promptly with none to trigger fallback.
    post("bestmove (none)");
    return;
  }
  if (cmd === "stop") {
    post("bestmove (none)");
    return;
  }
  if (cmd === "quit") {
    self.close();
  }
};

void ready;
