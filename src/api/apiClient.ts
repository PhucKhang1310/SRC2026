const API_BASE_URL =
  import.meta.env.VITE_TEST_API_BASE_URL?.replace(/\/+$/, "") ??
  "https://src2026backendmain.vercel.app/api/v1";

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

export type ApiRecord = Record<string, unknown>;

const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);

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

export const fetchWithRetry = async (
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

export const readString = (record: ApiRecord, fields: string[], fallback = "") => {
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
};

export const readErrorMessage = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json()) as ApiRecord;
    return readString(payload, ["message"], fallback);
  }

  return fallback;
};

export const submitJson = async <Payload>(
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
