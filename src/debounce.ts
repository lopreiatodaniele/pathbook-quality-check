export function scheduleHint(callback: () => void, delay = 250) {
  const timer = setTimeout(callback, delay);
  return () => clearTimeout(timer);
}
