import type { MentorItem } from "../data/mentorData";
import {
  API_ENDPOINTS,
  fetchWithRetry,
  readString,
  submitJson,
  type ApiRecord,
} from "./apiClient";
import { createBrowserCache } from "./browserCache";

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

const MENTORS_CACHE_TTL = 5 * 60 * 1000;

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
      readString(record, ["ORCID"]) ||
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

const mentorsCache = createBrowserCache<MentorItem[]>({
  cacheName: "resfes-mentors-v1",
  normalize: (data) => normalizeMentors(data),
  requestUrl: API_ENDPOINTS.mentors,
  storageKey: "resfes-mentors",
  ttlMs: MENTORS_CACHE_TTL,
});

export const clearMentorsCache = () => mentorsCache.clear();

export const fetchMentors = async (
  signal?: AbortSignal,
  options: { forceRefresh?: boolean } = {},
) => {
  if (!options.forceRefresh) {
    const cachedMentors = await mentorsCache.read();
    if (cachedMentors) {
      return cachedMentors;
    }
  }

  const response = await fetchWithRetry(API_ENDPOINTS.mentors, { signal });

  if (!response.ok) {
    throw new Error(`Mentors request failed with ${response.status}`);
  }

  const mentors = normalizeMentors(await response.json());

  if (mentors.length === 0) {
    throw new Error("Mentors response did not contain a usable list");
  }

  await mentorsCache.write(mentors);
  return mentors;
};

export const submitMentor = (
  payload: MentorSubmissionPayload,
  signal?: AbortSignal,
) =>
  submitJson(API_ENDPOINTS.mentorSubmit, payload, signal).then(async (result) => {
    await clearMentorsCache();
    return result;
  });
