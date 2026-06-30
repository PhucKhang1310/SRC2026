import {
  API_ENDPOINTS,
  readErrorMessage,
  readString,
  type ApiRecord,
} from "./apiClient";
import { clearMentorsCache } from "./mentorApi";
import { clearPublicationsCache } from "./publicationApi";

export type AdminMentorRecord = {
  _id: string;
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
  feedback: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminPublicationImage = {
  url: string;
  publicId: string;
};

export type AdminPublicationRecord = {
  _id: string;
  publishTitle: string;
  publishDate: string;
  content: string;
  title: string;
  author: string;
  journal: string;
  year: string;
  doi: string;
  abstract: string;
  authorGmail: string;
  feedback: string;
  images: AdminPublicationImage[];
  entryType?: string;
  citationKey?: string;
  booktitle?: string;
  volume?: string;
  number?: string;
  pages?: string;
  keywords?: string;
  publisher?: string;
  url?: string;
  rawBibtex?: string;
  createdAt?: string;
  updatedAt?: string;
};

const readList = <Item>(payload: unknown): Item[] => {
  if (Array.isArray(payload)) return payload as Item[];

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const list = record.data ?? record.items ?? record.results;
    if (Array.isArray(list)) return list as Item[];
  }

  return [];
};

const readRecord = <Item>(payload: unknown): Item => {
  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    return (record.data && typeof record.data === "object"
      ? record.data
      : record) as Item;
  }

  throw new Error("Response did not contain a usable record");
};

const adminRequest = async (
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal,
) => {
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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

const normalizeMentor = (payload: unknown): AdminMentorRecord => {
  const record = readRecord<ApiRecord>(payload);
  const links =
    record.links && typeof record.links === "object"
      ? (record.links as ApiRecord)
      : {};

  return {
    _id: readString(record, ["_id", "id"]),
    title: readString(record, [
      "title",
      "degree",
      "position",
      "Title (Học hàm/học vị)",
    ]),
    fullName: readString(record, [
      "fullName",
      "name",
      "fullname",
      "Full Name (Họ và tên)",
    ]),
    department: readString(record, [
      "department",
      "field",
      "major",
      "faculty",
      "Department (Đơn vị công tác)",
    ]),
    phone: readString(record, ["phone", "Phone", "Phone Number", "Số điện thoại"]),
    email: readString(record, ["email", "gmail", "Email", "Email Address"]),
    personalWebsite:
      readString(record, ["personalWebsite", "website", "websiteUrl", "profileUrl"]) ||
      readString(record, ["Personal Website"]) ||
      readString(links, ["website", "websiteUrl", "profileUrl"]),
    orcid:
      readString(record, ["orcid", "orcidUrl"]) ||
      readString(record, ["ORCID"]) ||
      readString(links, ["orcid", "orcidUrl"]),
    researchGate:
      readString(record, ["researchGate", "researchgate", "researchGateUrl"]) ||
      readString(record, ["ResearchGate"]) ||
      readString(links, ["researchGate", "researchgate", "researchGateUrl"]),
    googleScholar:
      readString(record, ["googleScholar", "google_scholar", "googleScholarUrl"]) ||
      readString(record, ["Google Scholar"]) ||
      readString(links, ["googleScholar", "google_scholar", "googleScholarUrl"]),
    researchAreas: readString(record, [
      "researchAreas",
      "researchArea",
      "expertise",
      "Research Areas (Lĩnh vực nghiên cứu chính)",
    ]),
    researchTopics: readString(record, [
      "researchTopics",
      "researchTopic",
      "Research Topics (Hướng nghiên cứu cụ thể)",
    ]),
    note: readString(record, ["note", "description", "bio"]),
    avatarImage: readString(record, [
      "avatarImage",
      "avatar",
      "avatarUrl",
      "image",
      "imageUrl",
      "photo",
      "photoUrl",
    ]),
    feedback: readString(record, ["feedback"]),
    createdAt: readString(record, ["createdAt"]),
    updatedAt: readString(record, ["updatedAt"]),
  };
};

const normalizePublication = (payload: unknown): AdminPublicationRecord => {
  const record = readRecord<ApiRecord>(payload);
  const images = Array.isArray(record.images)
    ? record.images
        .filter((image): image is ApiRecord =>
          Boolean(image && typeof image === "object"),
        )
        .map((image) => ({
          url: readString(image, ["url"]),
          publicId: readString(image, ["publicId"]),
        }))
        .filter((image) => image.url)
    : [];

  return {
    _id: readString(record, ["_id", "id"]),
    publishTitle: readString(record, ["publishTitle", "title"]),
    publishDate: readString(record, ["publishDate", "date", "year"]),
    content: readString(record, ["content", "abstract"]),
    title: readString(record, ["title", "publishTitle"]),
    author: readString(record, ["author"]),
    journal: readString(record, ["journal"]),
    year: readString(record, ["year", "publishDate"]),
    doi: readString(record, ["doi"]),
    abstract: readString(record, ["abstract", "content"]),
    authorGmail: readString(record, ["authorGmail", "email"]),
    feedback: readString(record, ["feedback"]),
    images,
    entryType: readString(record, ["entryType"]),
    citationKey: readString(record, ["citationKey"]),
    booktitle: readString(record, ["booktitle"]),
    volume: readString(record, ["volume"]),
    number: readString(record, ["number"]),
    pages: readString(record, ["pages"]),
    keywords: readString(record, ["keywords"]),
    publisher: readString(record, ["publisher"]),
    url: readString(record, ["url"]),
    rawBibtex: readString(record, ["rawBibtex"]),
    createdAt: readString(record, ["createdAt"]),
    updatedAt: readString(record, ["updatedAt"]),
  };
};

export const fetchAdminMentors = async (signal?: AbortSignal) =>
  readList<unknown>(await adminRequest(API_ENDPOINTS.adminMentors, {}, signal)).map(
    normalizeMentor,
  );

export const createAdminMentor = async (
  payload: Omit<AdminMentorRecord, "_id" | "createdAt" | "updatedAt">,
  signal?: AbortSignal,
) => {
  const result = normalizeMentor(
    await adminRequest(
      API_ENDPOINTS.adminMentors,
      { method: "POST", body: JSON.stringify(payload) },
      signal,
    ),
  );
  await clearMentorsCache();
  return result;
};

export const updateAdminMentor = async (
  id: string,
  payload: Omit<AdminMentorRecord, "_id" | "createdAt" | "updatedAt">,
  signal?: AbortSignal,
) => {
  const result = normalizeMentor(
    await adminRequest(
      `${API_ENDPOINTS.adminMentors}/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      signal,
    ),
  );
  await clearMentorsCache();
  return result;
};

export const deleteAdminMentor = async (id: string, signal?: AbortSignal) => {
  await adminRequest(
    `${API_ENDPOINTS.adminMentors}/${id}`,
    { method: "DELETE" },
    signal,
  );
  await clearMentorsCache();
};

export const fetchAdminPublications = async (signal?: AbortSignal) =>
  readList<unknown>(
    await adminRequest(API_ENDPOINTS.adminPublications, {}, signal),
  ).map(normalizePublication);

export const createAdminPublication = async (
  payload: Omit<AdminPublicationRecord, "_id" | "createdAt" | "updatedAt">,
  signal?: AbortSignal,
) => {
  const result = normalizePublication(
    await adminRequest(
      API_ENDPOINTS.adminPublications,
      { method: "POST", body: JSON.stringify(payload) },
      signal,
    ),
  );
  await clearPublicationsCache();
  return result;
};

export const updateAdminPublication = async (
  id: string,
  payload: Omit<AdminPublicationRecord, "_id" | "createdAt" | "updatedAt">,
  signal?: AbortSignal,
) => {
  const result = normalizePublication(
    await adminRequest(
      `${API_ENDPOINTS.adminPublications}/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      signal,
    ),
  );
  await clearPublicationsCache();
  return result;
};

export const deleteAdminPublication = async (
  id: string,
  signal?: AbortSignal,
) => {
  await adminRequest(
    `${API_ENDPOINTS.adminPublications}/${id}`,
    { method: "DELETE" },
    signal,
  );
  await clearPublicationsCache();
};
