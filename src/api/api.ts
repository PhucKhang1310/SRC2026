import type { MentorItem } from "../data/mentorData";
import type { PublicationItem } from "../data/publicationsData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://src2026backendmain.vercel.app";

export const API_ENDPOINTS = {
  mentors: `${API_BASE_URL}/api/v1/mentor`,
  mentorSubmit: `${API_BASE_URL}/api/v1/mentor/submit`,
  publications: `${API_BASE_URL}/api/v1/publication`,
  publicationSubmit: `${API_BASE_URL}/api/v1/publication/submit`,
  signup: `${API_BASE_URL}/api/v1/auth/signup`,
  login: `${API_BASE_URL}/api/v1/auth/login`,
} as const;

type ApiRecord = Record<string, unknown>;

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
  const response = await fetch(API_ENDPOINTS.publications, { signal });

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
  const response = await fetch(API_ENDPOINTS.mentors, { signal });

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
    throw new Error(`Submission failed with ${response.status}`);
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

  return response.json() as Promise<{ token: string }>;
};

export const submitMentor = (
  payload: MentorSubmissionPayload,
  signal?: AbortSignal,
) => submitJson(API_ENDPOINTS.mentorSubmit, payload, signal);

export const submitPublication = (
  payload: PublicationSubmissionPayload,
  signal?: AbortSignal,
) => submitJson(API_ENDPOINTS.publicationSubmit, payload, signal);

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
