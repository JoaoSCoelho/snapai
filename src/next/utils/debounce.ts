export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
) {
  let timeoutId: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  } as T;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
) {
  let inThrottle = false;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}
