import type { PublicationItem } from "../data/publicationsData";
import {
  API_ENDPOINTS,
  fetchWithRetry,
  readString,
  submitJson,
  type ApiRecord,
} from "./apiClient";
import { createBrowserCache } from "./browserCache";

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

const PUBLICATIONS_CACHE_TTL = 5 * 60 * 1000;

const stripHtml = (value: string) =>
  value
    .replace(/<img[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
  const directImage = readString(record, [
    "image",
    "imageUrl",
    "thumbNailImage",
    "thumbnailImage",
  ]);
  if (directImage) {
    return directImage;
  }

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

const publicationsCache = createBrowserCache<PublicationItem[]>({
  cacheName: "resfes-publications-v1",
  normalize: (data) => normalizePublications(data),
  requestUrl: API_ENDPOINTS.publications,
  storageKey: "resfes-publications",
  ttlMs: PUBLICATIONS_CACHE_TTL,
});

export const clearPublicationsCache = () => publicationsCache.clear();

export const fetchPublications = async (
  signal?: AbortSignal,
  options: { forceRefresh?: boolean } = {},
) => {
  if (!options.forceRefresh) {
    const cachedPublications = await publicationsCache.read();
    if (cachedPublications) {
      return cachedPublications;
    }
  }

  const response = await fetchWithRetry(API_ENDPOINTS.publications, { signal });

  if (!response.ok) {
    throw new Error(`Publications request failed with ${response.status}`);
  }

  const publications = normalizePublications(await response.json());
  await publicationsCache.write(publications);
  return publications;
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

export const submitPublication = (
  payload: PublicationSubmissionPayload,
  signal?: AbortSignal,
) =>
  submitJson(API_ENDPOINTS.publicationSubmit, payload, signal).then(async (result) => {
    await clearPublicationsCache();
    return result;
  });

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
