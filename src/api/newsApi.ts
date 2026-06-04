const API_BASE_URL =
    import.meta.env.VITE_TEST_API_BASE_URL?.replace(/\/+$/, "") ??
    // "https://src2026backendmain.vercel.app/api/v1";
    "http://localhost:3000/api/v1";

type ApiRecord = Record<string, unknown>;

export type NewsApiItem = {
    _id: string;
    title: string;
    description: string;
    thumbNailImage: string;
    images: string[];
    date: string;
    content: string;
    author: string;
};

const readString = (record: ApiRecord, fields: string[], fallback = "") => {
    for (const field of fields) {
        const value = record[field];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }

    return fallback;
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

const normalizeNews = (payload: unknown): NewsApiItem[] =>
    getNewsRecords(payload)
        .map<NewsApiItem | null>((item) => {
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
                title: readString(record, ["title"], "Untitled news"),
                description: readString(record, ["description"]),
                thumbNailImage: readString(record, ["thumbNailImage", "thumbnailImage"]),
                images,
                date: readString(record, ["date", "createdAt"], new Date().toISOString()),
                content: readString(record, ["content"]),
                author: readString(record, ["author"], "SRC Committee"),
            };
        })
        .filter((news): news is NewsApiItem => Boolean(news));

export const getNews = async (signal?: AbortSignal): Promise<NewsApiItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/news`, { signal });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return normalizeNews(await response.json());
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
};
