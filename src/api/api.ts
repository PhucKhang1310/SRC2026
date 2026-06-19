import type { MentorItem } from "../data/mentorData";
import type { PublicationItem } from "../data/publicationsData";
import {
  normalizeEditableContent,
  type EditableContent,
} from "../data/contentData";

const API_BASE_URL =
  import.meta.env.VITE_TEST_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://src2026backendmain.vercel.app/api/v1";
// "http://localhost:3000/api/v1";


export const API_ENDPOINTS = {
  mentors: `${API_BASE_URL}/mentor`,
  mentorSubmit: `${API_BASE_URL}/mentor/submit`,
  news: `${API_BASE_URL}/news`,
  content: `${API_BASE_URL}/content`,
  contentVersions: `${API_BASE_URL}/content/versions`,
  publications: `${API_BASE_URL}/publication`,
  publicationSubmit: `${API_BASE_URL}/publication/submit`,
  signup: `${API_BASE_URL}/auth/signup`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/auth/me`,
  logout: `${API_BASE_URL}/auth/logout`,
} as const;

type ApiRecord = Record<string, unknown>;

const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);
const PAGE_CONTENT_CACHE_NAME = "resfes-page-content-v1";
const PAGE_CONTENT_CACHE_KEY = "resfes-page-content";
const PAGE_CONTENT_CACHE_TTL = 5 * 60 * 1000;

type PageContentCacheEntry = {
  data: EditableContent;
  cachedAt: number;
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

const delay = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(resolve, milliseconds);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });

const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = 2,
) => {
  const signal = options.signal as AbortSignal | undefined;
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok || !retryableStatuses.has(response.status) || attempt === retries) {
        return response;
      }

      lastResponse = response;
    } catch (error) {
      if (signal?.aborted || attempt === retries) {
        throw error;
      }

      lastError = error;
    }

    await delay(350 * (attempt + 1), signal);
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
};

const stripHtml = (value: string) =>
  value
    .replace(/<img[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const readString = (record: ApiRecord, fields: string[], fallback = "") => {
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
};

const getPublicationRecords = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const wrappedList =
      record.publications ?? record.data ?? record.items ?? record.results;

    if (Array.isArray(wrappedList)) {
      return wrappedList;
    }
  }

  return [];
};

const getPublicationImage = (record: ApiRecord, id: string) => {
  const images = record.images;

  if (Array.isArray(images)) {
    const firstImage = images.find(
      (image): image is ApiRecord =>
        Boolean(image) && typeof image === "object",
    );

    if (firstImage) {
      const imageUrl = readString(firstImage, ["url", "src"]);
      if (imageUrl) {
        return imageUrl;
      }
    }
  }

  const contentImage = readString(record, ["content"]).match(
    /<img[^>]+src=["']([^"']+)["']/i,
  )?.[1];

  return (
    contentImage ??
    `https://picsum.photos/seed/resfes-publication-${id}/800/600`
  );
};

const normalizePublications = (payload: unknown): PublicationItem[] =>
  getPublicationRecords(payload)
    .map<PublicationItem | null>((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as ApiRecord;
      const id = readString(record, ["_id", "id"]) || String(index + 1);
      const title =
        readString(record, ["publishTitle", "title", "name"]) || "Publication";
      const content = readString(record, ["content", "description", "summary"]);
      const author = readString(record, ["author", "source"]);

      return {
        id,
        title,
        journalName: author || title,
        description: stripHtml(content),
        content,
        author,
        date:
          readString(record, ["publishDate", "date", "createdAt"]) ||
          new Date().toISOString(),
        source: author || "Publication",
        image: getPublicationImage(record, id),
      };
    })
    .filter((publication): publication is PublicationItem =>
      Boolean(publication?.title),
    );

export const fetchPublications = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.publications, { signal });

  if (!response.ok) {
    throw new Error(`Publications request failed with ${response.status}`);
  }

  return normalizePublications(await response.json());
};

export const fetchPublicationById = async (
  id: string,
  signal?: AbortSignal,
) => {
  const publications = await fetchPublications(signal);
  const publication = publications.find(
    (item) => String(item.id) === decodeURIComponent(id),
  );

  if (!publication) {
    throw new Error("Publication was not found");
  }

  return publication;
};

const readMentorLinks = (
  record: ApiRecord,
): NonNullable<MentorItem["links"]> => {
  const links =
    record.links && typeof record.links === "object"
      ? (record.links as ApiRecord)
      : {};

  return {
    website:
      readString(record, ["website", "websiteUrl", "profileUrl"]) ||
      readString(record, ["Personal Website"]) ||
      readString(links, ["website", "websiteUrl", "profileUrl"]),
    orcid:
      readString(record, ["orcid", "orcidUrl"]) ||
      readString(record, ["OrCID"]) ||
      readString(links, ["orcid", "orcidUrl"]),
    researchgate:
      readString(record, ["researchgate", "researchGate", "researchGateUrl"]) ||
      readString(record, ["ResearchGate"]) ||
      readString(links, ["researchgate", "researchGate", "researchGateUrl"]),
    googleScholar:
      readString(record, [
        "googleScholar",
        "google_scholar",
        "googleScholarUrl",
      ]) ||
      readString(record, ["Google Scholar"]) ||
      readString(links, [
        "googleScholar",
        "google_scholar",
        "googleScholarUrl",
      ]),
  };
};

const getMentorRecords = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const wrappedList =
      record.mentors ?? record.data ?? record.items ?? record.results;

    if (Array.isArray(wrappedList)) {
      return wrappedList;
    }
  }

  return [];
};

const normalizeMentors = (payload: unknown): MentorItem[] =>
  getMentorRecords(payload)
    .map<MentorItem | null>((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as ApiRecord;
      const department = readString(record, [
        "department",
        "field",
        "major",
        "faculty",
        "Department (Đơn vị công tác)",
      ]);
      const title = readString(record, [
        "title",
        "degree",
        "position",
        "Title (Học hàm/học vị)",
      ]);
      const role =
        readString(record, ["role"]) ||
        [title, department].filter(Boolean).join(" | ") ||
        "Mentor";
      const links = readMentorLinks(record);
      const hasLinks = Object.values(links).some(Boolean);
      const researchAreas = readString(record, [
        "researchArea",
        "researchAreas",
        "expertise",
        "Research Areas (Lĩnh vực nghiên cứu chính)",
      ]);
      const researchTopics = readString(record, [
        "researchTopic",
        "researchTopics",
        "Research Topics (Hướng nghiên cứu cụ thể)",
      ]);
      const image = readString(record, [
        "image",
        "imageUrl",
        "photo",
        "photoUrl",
        "avatar",
        "avatarUrl",
      ]);

      return {
        name: readString(record, [
          "name",
          "fullName",
          "fullname",
          "Full Name (Họ và tên)",
        ]),
        role,
        description:
          readString(record, ["description", "bio"]) ||
          [researchAreas, researchTopics].filter(Boolean).join(". "),
        ...(image ? { image } : {}),
        ...(hasLinks ? { links } : {}),
      };
    })
    .filter((mentor): mentor is MentorItem => Boolean(mentor?.name));

export const fetchMentors = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.mentors, { signal });

  if (!response.ok) {
    throw new Error(`Mentors request failed with ${response.status}`);
  }

  const mentors = normalizeMentors(await response.json());

  if (mentors.length === 0) {
    throw new Error("Mentors response did not contain a usable list");
  }

  return mentors;
};

const submitJson = async <Payload>(
  endpoint: string,
  payload: Payload,
  signal?: AbortSignal,
) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Submission failed with ${response.status}`),
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export type MentorSubmissionPayload = {
  title: string;
  fullName: string;
  department: string;
  phone: string;
  email: string;
  personalWebsite: string;
  orcid: string;
  researchGate: string;
  googleScholar: string;
  researchAreas: string;
  researchTopics: string;
  note: string;
  avatarImage: string;
  turnstileToken?: string;
};

export type PublicationSubmissionPayload = {
  publishTitle: string;
  author: string;
  publishDate: string;
  content: string;
  authorGmail: string;
  doi: string;
  journal: string;
  images?: {
    url: string;
    publicId: string;
  }[];
  turnstileToken?: string;
};

export type NewsRecord = {
  _id: string;
  title: string;
  description: string;
  thumbNailImage: string;
  images: string[];
  date: string;
  content: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsSubmissionPayload = {
  title: string;
  description: string;
  thumbNailImage: string;
  images: string[];
  date: string;
  content: string;
  author: string;
  thumbNailImageFile?: File | null;
  imageFiles?: File[];
};

export type CurrentUser = {
  id: string;
  email: string;
  role: string;
};

const readErrorMessage = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json()) as ApiRecord;
    return readString(payload, ["message"], fallback);
  }

  return fallback;
};

export const callEmailSignup = async (
  email: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.signup, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Email signup failed with ${response.status}`,
      ),
    );
  }

  return response.json() as Promise<{ message: string }>;
};

export const login = async (
  email: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Login failed with ${response.status}`,
      ),
    );
  }

  return response.json() as Promise<{ message: string; user: CurrentUser }>;
};

export const getCurrentUser = async (signal?: AbortSignal) => {
  const response = await fetch(API_ENDPOINTS.me, {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }

    throw new Error(
      await readErrorMessage(response, `Could not check login status: ${response.status}`),
    );
  }

  const payload = (await response.json()) as { user: CurrentUser };
  return payload.user;
};

export const logout = async (signal?: AbortSignal) => {
  const response = await fetch(API_ENDPOINTS.logout, {
    method: "POST",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Logout failed with ${response.status}`),
    );
  }

  return response.json() as Promise<{ message: string }>;
};

export const submitMentor = (
  payload: MentorSubmissionPayload,
  signal?: AbortSignal,
) => submitJson(API_ENDPOINTS.mentorSubmit, payload, signal);

export const submitPublication = (
  payload: PublicationSubmissionPayload,
  signal?: AbortSignal,
) => submitJson(API_ENDPOINTS.publicationSubmit, payload, signal);

const getNewsRecords = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const wrappedList = record.news ?? record.data ?? record.items ?? record.results;

    if (Array.isArray(wrappedList)) {
      return wrappedList;
    }
  }

  return [];
};

const normalizeNewsRecords = (payload: unknown): NewsRecord[] =>
  getNewsRecords(payload)
    .map<NewsRecord | null>((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as ApiRecord;
      const id = readString(record, ["_id", "id"]);
      const images = Array.isArray(record.images)
        ? record.images.filter((image): image is string => typeof image === "string")
        : [];

      if (!id) {
        return null;
      }

      return {
        _id: id,
        title: readString(record, ["title"]),
        description: readString(record, ["description"]),
        thumbNailImage: readString(record, ["thumbNailImage", "thumbnailImage"]),
        images,
        date: readString(record, ["date"]),
        content: readString(record, ["content"]),
        author: readString(record, ["author"]),
        createdAt: readString(record, ["createdAt"]),
        updatedAt: readString(record, ["updatedAt"]),
      };
    })
    .filter((news): news is NewsRecord => Boolean(news));

export const fetchNews = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.news, { signal });

  if (!response.ok) {
    throw new Error(`News request failed with ${response.status}`);
  }

  return normalizeNewsRecords(await response.json());
};

export const submitNews = async (
  payload: NewsSubmissionPayload,
  signal?: AbortSignal,
) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("date", payload.date);
  formData.append("content", payload.content);
  formData.append("author", payload.author);

  if (payload.thumbNailImageFile) {
    formData.append("thumbNailImage", payload.thumbNailImageFile);
  } else if (payload.thumbNailImage) {
    formData.append("thumbNailImage", payload.thumbNailImage);
  }

  if (payload.images.length > 0) {
    formData.append("images", payload.images.join(","));
  }

  payload.imageFiles?.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(API_ENDPOINTS.news, {
    method: "POST",
    credentials: "include",
    body: formData,
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News submission failed with ${response.status}`));
  }

  return response.json() as Promise<{ message: string; data: NewsRecord }>;
};

export const parsePublicationDate = (date: string) => {
  const parsedDate = new Date(date);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  const slashParts = date.split("/");
  if (slashParts.length === 3) {
    const [day, month, year] = slashParts.map(Number);
    const normalizedDate = new Date(year, month - 1, day);

    if (!Number.isNaN(normalizedDate.getTime())) {
      return normalizedDate;
    }
  }

  return new Date();
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

export type ContentVersionSummary = {
  id: string;
  label: string;
  createdAt: string;
  content?: EditableContent;
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
    headers: {
      "Content-Type": "application/json",
      "credentials": "include",
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
