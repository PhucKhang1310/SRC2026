import {
  API_ENDPOINTS,
  fetchWithRetry,
  readErrorMessage,
  readString,
  type ApiRecord,
} from "./apiClient";

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

const normalizeNewsRecord = (payload: unknown): NewsRecord | null => {
  const records = normalizeNewsRecords(payload);
  if (records[0]) {
    return records[0];
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    if (record.data && typeof record.data === "object") {
      return normalizeNewsRecords([record.data])[0] ?? null;
    }
  }

  return null;
};

export const fetchNews = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.news, { signal });

  if (!response.ok) {
    throw new Error(`News request failed with ${response.status}`);
  }

  return normalizeNewsRecords(await response.json());
};

export const getNews = fetchNews;

export const fetchNewsById = async (id: string, signal?: AbortSignal) => {
  const response = await fetchWithRetry(`${API_ENDPOINTS.news}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News request failed with ${response.status}`));
  }

  const news = normalizeNewsRecord(await response.json());

  if (!news) {
    throw new Error("News response did not contain a usable record");
  }

  return news;
};

const buildNewsFormData = (payload: NewsSubmissionPayload) => {
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

  formData.append("images", payload.images.join(","));

  payload.imageFiles?.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

export const submitNews = async (
  payload: NewsSubmissionPayload,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.news, {
    method: "POST",
    credentials: "include",
    body: buildNewsFormData(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News submission failed with ${response.status}`));
  }

  return response.json() as Promise<{ message: string; data: NewsRecord }>;
};

export const updateNews = async (
  id: string,
  payload: NewsSubmissionPayload,
  signal?: AbortSignal,
) => {
  const response = await fetch(`${API_ENDPOINTS.news}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: buildNewsFormData(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News update failed with ${response.status}`));
  }

  return response.json() as Promise<{ message: string; data: NewsRecord }>;
};
