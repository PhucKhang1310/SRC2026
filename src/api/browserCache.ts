type CacheEntry<Data> = {
  data: Data;
  cachedAt: number;
};

type BrowserCacheConfig<Data> = {
  cacheName: string;
  storageKey: string;
  requestUrl: string;
  ttlMs: number;
  normalize: (data: Data) => Data;
};

const isBrowser = () => typeof window !== "undefined";

const isCacheEntry = <Data>(value: unknown): value is CacheEntry<Data> =>
  Boolean(
    value &&
    typeof value === "object" &&
    "data" in value &&
    "cachedAt" in value &&
    typeof (value as CacheEntry<Data>).cachedAt === "number",
  );

export const createBrowserCache = <Data>({
  cacheName,
  normalize,
  requestUrl,
  storageKey,
  ttlMs, // Time to live in milliseconds
}: BrowserCacheConfig<Data>) => {
  let memoryCache: CacheEntry<Data> | null = null;

  const isFresh = (entry: CacheEntry<Data>) => Date.now() - entry.cachedAt < ttlMs;
  const getCacheRequest = () => new Request(requestUrl, { method: "GET" });

  const writeCacheStorage = async (entry: CacheEntry<Data>) => {
    if (!isBrowser() || !("caches" in window)) {
      return;
    }

    const cache = await window.caches.open(cacheName);
    await cache.put(
      getCacheRequest(),
      new Response(JSON.stringify(entry), {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  };

  const readCacheStorage = async () => {
    if (!isBrowser() || !("caches" in window)) {
      return null;
    }

    const cache = await window.caches.open(cacheName);
    const response = await cache.match(getCacheRequest());
    if (!response) {
      return null;
    }

    const parsed = (await response.json()) as unknown;
    if (!isCacheEntry<Data>(parsed) || !isFresh(parsed)) {
      await cache.delete(getCacheRequest());
      return null;
    }

    return parsed;
  };

  const readLocalStorage = async () => {
    if (!isBrowser()) {
      return null;
    }

    const cachedValue = window.localStorage.getItem(storageKey);
    if (!cachedValue) {
      return null;
    }

    const parsed = JSON.parse(cachedValue) as unknown;
    if (!isCacheEntry<Data>(parsed) || !isFresh(parsed)) {
      window.localStorage.removeItem(storageKey);
      memoryCache = null;
      return null;
    }

    try {
      await writeCacheStorage(parsed);
    } catch {
      // Cache Storage backfill is optional when localStorage is already valid.
    }

    return parsed;
  };

  const read = async () => {
    if (memoryCache && isFresh(memoryCache)) {
      return normalize(memoryCache.data);
    }

    try {
      const cachedEntry = await readCacheStorage();
      if (cachedEntry) {
        memoryCache = cachedEntry;
        return normalize(cachedEntry.data);
      }
    } catch {
      // Fall back to localStorage if Cache Storage is unavailable or unreadable.
    }

    try {
      const cachedEntry = await readLocalStorage();
      if (cachedEntry) {
        memoryCache = cachedEntry;
        return normalize(cachedEntry.data);
      }
    } catch {
      return null;
    }

    return null;
  };

  const write = async (data: Data) => {
    const entry = {
      data: normalize(data),
      cachedAt: Date.now(),
    };

    memoryCache = entry;

    if (!isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch {
      // localStorage may be unavailable or full; the in-memory cache still works.
    }

    try {
      await writeCacheStorage(entry);
    } catch {
      // Cache Storage may be unavailable; memory/localStorage cache still works.
    }
  };

  const clear = async () => {
    memoryCache = null;

    if (!isBrowser()) {
      return;
    }

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage cleanup failures.
    }

    try {
      if ("caches" in window) {
        const cache = await window.caches.open(cacheName);
        await cache.delete(getCacheRequest());
      }
    } catch {
      // Ignore Cache Storage cleanup failures.
    }
  };

  return { clear, read, write };
};
