import {
  normalizeEditableContent,
  type EditableContent,
} from "../data/contentData";
import {
  API_ENDPOINTS,
  fetchWithRetry,
  readErrorMessage,
  readString,
  type ApiRecord,
} from "./apiClient";

const PAGE_CONTENT_CACHE_NAME = "resfes-page-content-v1";
const PAGE_CONTENT_CACHE_KEY = "resfes-page-content";
const PAGE_CONTENT_CACHE_TTL = 5 * 60 * 1000;

type PageContentCacheEntry = {
  data: EditableContent;
  cachedAt: number;
};

export type ContentVersionSummary = {
  id: string;
  label: string;
  createdAt: string;
  content?: EditableContent;
};

let pageContentMemoryCache: PageContentCacheEntry | null = null;

const isPageContentCacheFresh = (entry: PageContentCacheEntry) =>
  Date.now() - entry.cachedAt < PAGE_CONTENT_CACHE_TTL;

const isPageContentCacheEntry = (
  value: unknown,
): value is PageContentCacheEntry =>
  Boolean(
    value &&
    typeof value === "object" &&
    "data" in value &&
    "cachedAt" in value &&
    typeof (value as PageContentCacheEntry).cachedAt === "number",
  );

const getPageContentCacheRequest = () =>
  new Request(API_ENDPOINTS.content, { method: "GET" });

const writePageContentCacheStorage = async (cacheEntry: PageContentCacheEntry) => {
  if (!("caches" in window)) {
    return;
  }

  const cache = await window.caches.open(PAGE_CONTENT_CACHE_NAME);
  await cache.put(
    getPageContentCacheRequest(),
    new Response(JSON.stringify(cacheEntry), {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
};

const readPageContentCacheStorage = async () => {
  if (!("caches" in window)) {
    return null;
  }

  const cache = await window.caches.open(PAGE_CONTENT_CACHE_NAME);
  const response = await cache.match(getPageContentCacheRequest());
  if (!response) {
    return null;
  }

  const parsedCache = (await response.json()) as unknown;
  if (!isPageContentCacheEntry(parsedCache) || !isPageContentCacheFresh(parsedCache)) {
    await cache.delete(getPageContentCacheRequest());
    return null;
  }

  return parsedCache;
};

const readCachedPageContent = async () => {
  if (pageContentMemoryCache && isPageContentCacheFresh(pageContentMemoryCache)) {
    return normalizeEditableContent(pageContentMemoryCache.data);
  }

  try {
    const cachedEntry = await readPageContentCacheStorage();
    if (cachedEntry) {
      pageContentMemoryCache = cachedEntry;
      return normalizeEditableContent(cachedEntry.data);
    }
  } catch {
    // Fall back to localStorage if Cache Storage is unavailable or unreadable.
  }

  try {
    const cachedValue = window.localStorage.getItem(PAGE_CONTENT_CACHE_KEY);
    if (!cachedValue) return null;

    const parsedCache = JSON.parse(cachedValue) as unknown;
    if (!isPageContentCacheEntry(parsedCache) || !isPageContentCacheFresh(parsedCache)) {
      window.localStorage.removeItem(PAGE_CONTENT_CACHE_KEY);
      pageContentMemoryCache = null;
      return null;
    }

    pageContentMemoryCache = parsedCache;
    try {
      await writePageContentCacheStorage(parsedCache);
    } catch {
      // Cache Storage backfill is optional when localStorage is already valid.
    }
    return normalizeEditableContent(parsedCache.data);
  } catch {
    return null;
  }
};

const writeCachedPageContent = async (data: EditableContent) => {
  const cacheEntry = {
    data,
    cachedAt: Date.now(),
  };

  pageContentMemoryCache = cacheEntry;

  try {
    window.localStorage.setItem(PAGE_CONTENT_CACHE_KEY, JSON.stringify(cacheEntry));
  } catch {
    // localStorage may be unavailable or full; the in-memory cache still works.
  }

  try {
    if (!("caches" in window)) {
      return;
    }

    await writePageContentCacheStorage(cacheEntry);
  } catch {
    // Cache Storage may be unavailable; memory/localStorage cache still works.
  }
};

export const getPageContent = async (
  signal?: AbortSignal,
  options: { forceRefresh?: boolean } = {},
): Promise<EditableContent> => {
  if (!options.forceRefresh) {
    const cachedContent = await readCachedPageContent();
    if (cachedContent) {
      return cachedContent;
    }
  }

  const response = await fetchWithRetry(API_ENDPOINTS.content, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch page content: ${response.status}`);
  }

  const payload = (await response.json()) as { data: EditableContent };
  const normalizedContent = normalizeEditableContent(payload.data);
  await writeCachedPageContent(normalizedContent);
  return normalizedContent;
};

export const updatePageContent = async (
  content: EditableContent,
  signal?: AbortSignal,
): Promise<EditableContent> => {
  const {
    hero,
    about,
    researchTitle,
    researchFields,
    awardsTitle,
    awardsStandardLabel,
    awardsSmallLabel,
    awards,
    awardsNote,
    regulationsTitle,
    regulationsSubtitle,
    regulations,
    newsTitle,
    newsSubtitle,
    newsReadAllLabel,
    milestonesTitle,
    milestonesNote,
    milestones,
    publicationsHome,
    workshops,
    footer,
    layout,
  } = content;

  const response = await fetch(API_ENDPOINTS.content, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hero,
      about,
      researchTitle,
      researchFields,
      awardsTitle,
      awardsStandardLabel,
      awardsSmallLabel,
      awards,
      awardsNote,
      regulationsTitle,
      regulationsSubtitle,
      regulations,
      newsTitle,
      newsSubtitle,
      newsReadAllLabel,
      milestonesTitle,
      milestonesNote,
      milestones,
      publicationsHome,
      workshops,
      footer,
      layout,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to update page content: ${response.status}`),
    );
  }

  const payload = (await response.json()) as { data: EditableContent };
  const normalizedContent = normalizeEditableContent(payload.data);
  await writeCachedPageContent(normalizedContent);
  return normalizedContent;
};

const normalizeContentVersion = (value: unknown): ContentVersionSummary | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as ApiRecord;
  const id = readString(record, ["_id", "id", "versionId"]);
  if (!id) return null;

  const createdAt =
    readString(record, ["createdAt", "date", "timestamp"]) ||
    new Date().toISOString();
  const label =
    readString(record, ["label", "name", "title"]) ||
    `Version ${new Date(createdAt).toLocaleString()}`;
  const rawContent = record.content ?? record.snapshot ?? record.data;

  return {
    id,
    label,
    createdAt,
    content:
      rawContent && typeof rawContent === "object"
        ? normalizeEditableContent(rawContent as Partial<EditableContent>)
        : undefined,
  };
};

const getContentVersionRecords = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const record = payload as ApiRecord;
  const wrapped = record.versions ?? record.data ?? record.items ?? record.results;
  return Array.isArray(wrapped) ? wrapped : [];
};

export const fetchContentVersions = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.contentVersions, { signal });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to load content versions: ${response.status}`),
    );
  }

  return getContentVersionRecords(await response.json())
    .map(normalizeContentVersion)
    .filter((version): version is ContentVersionSummary => Boolean(version));
};

export const createContentVersion = async (
  label: string,
  content: EditableContent,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.contentVersions, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ label, content }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Failed to save content version: ${response.status}`),
    );
  }

  const payload = await response.json();
  const version = normalizeContentVersion(payload);
  if (version) return version;

  const nestedVersion = normalizeContentVersion((payload as { data?: unknown }).data);
  if (!nestedVersion) {
    throw new Error("Content version response was not usable.");
  }

  return nestedVersion;
};
