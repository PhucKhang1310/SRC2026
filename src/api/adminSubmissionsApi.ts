import {
  API_ENDPOINTS,
  readErrorMessage,
  type ApiRecord,
} from "./apiClient";
import { clearMentorsCache } from "./mentorApi";
import { clearPublicationsCache } from "./publicationApi";

export type PendingPublication = {
  _id: string;
  publishTitle: string;
  author: string;
  publishDate: string;
  content: string;
  authorGmail: string;
  doi?: string;
  journal?: string;
  images?: {
    url: string;
    publicId: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
};

export type PendingMentor = {
  _id: string;
  title: string;
  fullName: string;
  department?: string;
  phone?: string;
  email: string;
  personalWebsite?: string;
  orcid?: string;
  researchGate?: string;
  googleScholar?: string;
  researchAreas?: string;
  researchTopics?: string;
  note?: string;
  avatarImage?: string;
  createdAt?: string;
  updatedAt?: string;
};

const readList = <Item>(payload: unknown): Item[] => {
  if (Array.isArray(payload)) {
    return payload as Item[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const list = record.data ?? record.items ?? record.results;

    if (Array.isArray(list)) {
      return list as Item[];
    }
  }

  return [];
};

const adminRequest = async (
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal,
) => {
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Request failed with ${response.status}`),
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const fetchPendingPublications = async (signal?: AbortSignal) =>
  readList<PendingPublication>(
    await adminRequest(API_ENDPOINTS.pendingPublications, {}, signal),
  );

export const fetchPendingMentors = async (signal?: AbortSignal) =>
  readList<PendingMentor>(
    await adminRequest(API_ENDPOINTS.pendingMentors, {}, signal),
  );

export const approvePendingPublication = async (id: string, signal?: AbortSignal) => {
  const result = await adminRequest(
    `${API_ENDPOINTS.pendingPublications}/${id}/approve`,
    { method: "POST" },
    signal,
  );
  await clearPublicationsCache();
  return result;
};

export const declinePendingPublication = (id: string, signal?: AbortSignal) =>
  adminRequest(
    `${API_ENDPOINTS.pendingPublications}/${id}`,
    { method: "DELETE" },
    signal,
  );

export const approvePendingMentor = async (id: string, signal?: AbortSignal) => {
  const result = await adminRequest(
    `${API_ENDPOINTS.pendingMentors}/${id}/approve`,
    { method: "POST" },
    signal,
  );
  await clearMentorsCache();
  return result;
};

export const declinePendingMentor = (id: string, signal?: AbortSignal) =>
  adminRequest(
    `${API_ENDPOINTS.pendingMentors}/${id}`,
    { method: "DELETE" },
    signal,
  );
