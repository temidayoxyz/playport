import { useCallback, useEffect, useRef, useState } from "react";
import type { GameShellProps, GameSession } from "@/types/game";
import { audioManager } from "@/lib/audio/audioManager";
import { announce } from "@/lib/accessibility/announce";
import {
  definitionsStub,
  isValidAnswer,
  pickWord,
  scoreForWord,
  shuffleWord,
} from "./engine/logic";

export default function AnagramRushGame({
  modeId,
  difficultyId,
  onSessionChange,
  sound = true,
}: GameShellProps) {
  const [target, setTarget] = useState(() => pickWord(difficultyId, 0));
  const [scrambled, setScrambled] = useState(() => shuffleWord(target).split(""));
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<GameSession["status"]>("playing");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(modeId === "timed" ? 60 : 0);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const emit = useCallback(
    (partial: Partial<GameSession> = {}) => {
      onSessionChange?.({
        status,
        score,
        level: round,
        elapsedSeconds: elapsed,
        message,
        stats: {
          Streak: streak,
          Round: round,
          Hints: hintsLeft,
          Mistakes: mistakes,
        },
        ...partial,
      });
    },
    [elapsed, hintsLeft, message, mistakes, onSessionChange, round, score, status, streak],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    emit();
  }, [emit]);

  useEffect(() => {
    if (modeId !== "timed" || status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus("won");
          if (sound) audioManager.play("win");
          announce(`Time up. Score ${score}`);
          emit({ status: "won", score });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [emit, modeId, score, sound, status]);

  const nextWord = useCallback(
    (nextRound: number) => {
      if (modeId === "classic" && nextRound > 10) {
        setStatus("won");
        if (sound) audioManager.play("win");
        announce(`Finished. Score ${score}`);
        emit({ status: "won", score });
        return;
      }
      const w = pickWord(difficultyId, nextRound);
      setTarget(w);
      setScrambled(shuffleWord(w).split(""));
      setAnswer("");
      setRound(nextRound);
      setMessage("");
      inputRef.current?.focus();
    },
    [difficultyId, emit, modeId, score, sound],
  );

  const submit = () => {
    if (status !== "playing") return;
    if (isValidAnswer(answer, target)) {
      const gained = scoreForWord(target, streak + 1, modeId === "timed" ? timeLeft : 0);
      const nextScore = score + gained;
      const nextStreak = streak + 1;
      setScore(nextScore);
      setStreak(nextStreak);
      setMessage(definitionsStub(target));
      if (sound) audioManager.play("correct");
      announce(`Correct. ${target}`);
      window.setTimeout(() => nextWord(round + 1), 650);
    } else {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      setStreak(0);
      setMessage("Not quite — try again or skip.");
      if (sound) audioManager.play("incorrect");
      if (modeId === "survival" && nextMistakes >= 3) {
        setStatus("lost");
        if (sound) audioManager.play("lose");
        emit({ status: "lost", score });
      }
    }
  };

  const skip = () => {
    setStreak(0);
    nextWord(round + 1);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex w-full flex-wrap justify-between gap-2 text-sm">
        <span className="rounded-full surface px-3 py-1.5">Score {score}</span>
        <span className="rounded-full surface px-3 py-1.5">Streak {streak}</span>
        {modeId === "timed" && (
          <span className="rounded-full surface px-3 py-1.5">{timeLeft}s</span>
        )}
        {modeId === "survival" && (
          <span className="rounded-full surface px-3 py-1.5">❤ {3 - mistakes}</span>
        )}
      </div>

      <p className="text-muted text-sm">Unscramble the word</p>
      <div className="flex flex-wrap justify-center gap-2" aria-label="Scrambled letters">
        {scrambled.map((ch, i) => (
          <button
            key={`${ch}-${i}`}
            type="button"
            className="touch-target flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-muted)] font-display text-xl font-bold"
            onClick={() => setAnswer((a) => a + ch)}
          >
            {ch.toUpperCase()}
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        value={answer}
        onChange={(e) => setAnswer(e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase())}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-center font-display text-2xl tracking-widest uppercase outline-none focus:ring-2 focus:ring-[var(--ring)]"
        aria-label="Your answer"
        autoCapitalize="none"
        autoComplete="off"
        maxLength={12}
      />

      {message && <p className="text-center text-sm text-muted">{message}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="touch-target rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white" onClick={submit}>
          Submit
        </button>
        <button
          type="button"
          className="touch-target rounded-xl surface px-4 py-2 text-sm"
          onClick={() => setScrambled(shuffleWord(target).split(""))}
        >
          Shuffle
        </button>
        <button
          type="button"
          className="touch-target rounded-xl surface px-4 py-2 text-sm"
          disabled={hintsLeft <= 0}
          onClick={() => {
            if (hintsLeft <= 0) return;
            setHintsLeft((h) => h - 1);
            setAnswer(target.slice(0, Math.ceil(target.length / 2)));
          }}
        >
          Hint ({hintsLeft})
        </button>
        <button type="button" className="touch-target rounded-xl surface px-4 py-2 text-sm" onClick={skip}>
          Skip
        </button>
        <button type="button" className="touch-target rounded-xl surface px-4 py-2 text-sm" onClick={() => setAnswer("")}>
          Clear
        </button>
      </div>
    </div>
  );
}
