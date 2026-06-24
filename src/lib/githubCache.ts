interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Ephemeral, in-memory only — never written to disk. Avoids re-fetching the
 * same repository tree/contents from GitHub on every dashboard tab within a
 * warm server instance, since there is no local clone to read from instead.
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const hit = cache.get(key);

  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }

  const value = await fn();
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });

  return value;
}
