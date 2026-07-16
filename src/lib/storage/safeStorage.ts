const memory = new Map<string, string>();

function canUseLocalStorage(): boolean {
  try {
    const key = "__playport_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const hasStorage = typeof window !== "undefined" && canUseLocalStorage();

export function getItem(key: string): string | null {
  try {
    if (hasStorage) return window.localStorage.getItem(key);
    return memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

export function setItem(key: string, value: string): void {
  try {
    if (hasStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // fall through to memory
  }
  memory.set(key, value);
}

export function removeItem(key: string): void {
  try {
    if (hasStorage) window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  memory.delete(key);
}

export function getJSON<T>(key: string, fallback: T): T {
  const raw = getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  try {
    setItem(key, JSON.stringify(value));
  } catch {
    // quota or serialisation errors — ignore
  }
}

export function clearPlayPortData(): void {
  const keys = [
    "playport:settings",
    "playport:recent",
    "playport:highscores",
    "playport:tutorials",
    "playport:preferences",
  ];
  for (const key of keys) removeItem(key);
  if (hasStorage) {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k?.startsWith("playport:")) toRemove.push(k);
      }
      toRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
  memory.clear();
}
