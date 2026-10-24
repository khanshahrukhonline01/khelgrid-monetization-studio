/**
 * Minimal in-memory localStorage for SSR-oriented tests running in Vitest's Node environment.
 * This deliberately implements only the browser storage API used by the CV features.
 */
const values = new Map<string, string>();

export const testLocalStorage = {
  get length(): number {
    return values.size;
  },
  clear(): void {
    values.clear();
  },
  getItem(key: string): string | null {
    return values.get(String(key)) ?? null;
  },
  key(index: number): string | null {
    return Array.from(values.keys())[index] ?? null;
  },
  removeItem(key: string): void {
    values.delete(String(key));
  },
  setItem(key: string, value: string): void {
    values.set(String(key), String(value));
  },
};

export function installLocalStorageTestDouble(): void {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: testLocalStorage,
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: { localStorage: testLocalStorage },
  });
  testLocalStorage.clear();
}

export function resetLocalStorageTestDouble(): void {
  testLocalStorage.clear();
}
