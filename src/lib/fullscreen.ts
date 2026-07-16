export function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement);
}

export async function toggleFullscreen(element?: HTMLElement | null): Promise<boolean> {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return false;
    }
    const target = element ?? document.documentElement;
    await target.requestFullscreen();
    return true;
  } catch {
    return isFullscreen();
  }
}
