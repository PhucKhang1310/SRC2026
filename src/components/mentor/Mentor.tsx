import { useEffect, useMemo, useState } from "react";
import MentorList from "./MentorList";
import type { MentorItem } from "../../data/mentorData";
import Pagination from "../pagination/Pagination";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import {
  FaLaptopCode,
  FaLanguage,
  FaChalkboardUser,
  FaLightbulb,
  FaPaintbrush,
  FaMicrochip,
  FaBriefcase,
  FaCalculator,
  FaHandshake,
  FaCode,
  FaGlobe,
  FaListUl,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const departmentIcons: Record<string, IconType> = {
  "All": FaListUl,
  "Computing Fundamental": FaLaptopCode,
  "English": FaLanguage,
  "English Preparation Course": FaChalkboardUser,
  "Entrepreneurship Development": FaLightbulb,
  "Graphic Design": FaPaintbrush,
  "Information Technology": FaMicrochip,
  "Information Technology Specialization": FaMicrochip,
  "International Business": FaBriefcase,
  "Japanese": FaGlobe,
  "Mathematics": FaCalculator,
  "Soft Skill": FaHandshake,
  "Software Engineering": FaCode,
};

const mentorsEndpoint =
  "https://src2026backendmain.vercel.app/mentor";

type MentorApiRecord = Record<string, unknown>;

const readString = (
  record: MentorApiRecord,
  fields: string[],
  fallback?: string
): string => {
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback ?? "";
};

const readLinks = (record: MentorApiRecord): NonNullable<MentorItem["links"]> => {
  const links =
    record.links && typeof record.links === "object"
      ? (record.links as MentorApiRecord)
      : {};

  return {
    website: readString(record, ["website", "websiteUrl", "profileUrl"]) ||
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
    const record = payload as MentorApiRecord;
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

      const record = item as MentorApiRecord;
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
      const links = readLinks(record);
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
      const image = readString(
        record,
        ["image", "imageUrl", "photo", "photoUrl", "avatar", "avatarUrl"]
      );

      return {
        name: readString(
          record,
          ["name", "fullName", "fullname", "Full Name (Họ và tên)"]
        ),
        role,
        description:
          readString(record, ["description", "bio"]) ||
          [researchAreas, researchTopics].filter(Boolean).join(". "),
        ...(image ? { image } : {}),
        ...(hasLinks ? { links } : {}),
      };
    })
    .filter((mentor): mentor is MentorItem => Boolean(mentor?.name));

const Mentor = () => {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const controller = new AbortController();

    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const response = await fetch(mentorsEndpoint, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Mentors request failed with ${response.status}`);
        }

        const payload = await response.json();
        const remoteMentors = normalizeMentors(payload);

        if (remoteMentors.length === 0) {
          throw new Error("Mentors response did not contain a usable list");
        }

        setMentors(remoteMentors);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMentors([]);
        setFetchError("Unable to load live mentor data.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMentors();

    return () => controller.abort();
  }, []);

  const departments = useMemo(() => {
    const uniqueDepartments = new Set(
      mentors.map((mentor) => mentor.role.split("|")[1]?.trim() ?? "Other")
    );

    return ["All", ...Array.from(uniqueDepartments).sort()];
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const department = mentor.role.split("|")[1]?.trim() ?? "Other";
      const matchesDepartment =
        activeDepartment === "All" || department === activeDepartment;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        mentor.name.toLowerCase().includes(normalizedSearch) ||
        mentor.role.toLowerCase().includes(normalizedSearch) ||
        mentor.description.toLowerCase().includes(normalizedSearch);

      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, mentors, searchTerm]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeDepartment, searchTerm]);

  const paginatedMentors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMentors.slice(start, start + pageSize);
  }, [filteredMentors, currentPage]);

  return (
    <main className="min-h-screen bg-black px-6 text-amber-50 lg:px-10">
      <NavBar />
      <section className="mx-auto max-w-7xl pt-50 pb-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-amber-50/60">
            Mentors
          </p>
          <h1 className="text-4xl font-black leading-tight text-amber-50 lg:text-6xl">
            Meet the mentors guiding SRC 2026
          </h1>
          <p className="mt-6 text-base leading-7 text-amber-50/75 lg:text-lg">
            A multidisciplinary mentoring team of {mentors.length} experts
            supporting research, creativity, and presentation quality across
            every field in the competition.
          </p>
          {(isLoading || fetchError) && (
            <p className="mt-4 text-sm text-amber-50/55">
              {isLoading ? "Loading live mentor data..." : fetchError}
            </p>
          )}
        </div>

        <div className="mb-8 space-y-4 text-amber-50">
          <div className="filter mx-auto flex max-w-7xl flex-wrap justify-center gap-2">
            {departments.map((department) => {
              const Icon = departmentIcons[department];
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => setActiveDepartment(department)}
                  className={`btn btn-sm rounded-full border flex items-center gap-1.5 ${
                    activeDepartment === department
                      ? "border-white bg-white text-black hover:bg-white/90"
                      : "border-white bg-transparent text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {Icon && <Icon className="size-3.5" />}
                  {department}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-amber-50/70">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </div>

        <MentorList
          mentors={paginatedMentors}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentIcons={departmentIcons}
        />

        {!isLoading && filteredMentors.length === 0 && (
          <div className="mt-8 rounded-2xl border border-amber-50/20 bg-zinc-900 p-6 text-center text-amber-50/70">
            {fetchError || "No mentors matched your search or filter."}
          </div>
        )}

        {filteredMentors.length > pageSize && (
          <Pagination
            className="mt-10"
            currentPage={currentPage}
            totalCount={filteredMentors.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}

        <div className="mt-12 text-center">
          <a
            href="/"
            className="btn btn-primary border-none bg-[#ff6a1f] text-white hover:bg-[#e85f1b]"
          >
            Back to home
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Mentor;
