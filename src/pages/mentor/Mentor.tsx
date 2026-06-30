import { useEffect, useMemo, useState } from "react";
import MentorList from "./MentorList";
import { fetchMentors } from "../../api/mentorApi";
import type { MentorItem } from "../../data/mentorData";
import Pagination from "../../components/pagination/Pagination";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
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
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import LoadingPage from "../../components/loading/LoadingPage";

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

const darkTheme = {
  page: "bg-black text-amber-50",
  eyebrow: "text-amber-50/60",
  title: "text-amber-50",
  body: "text-amber-50/75",
  muted: "text-amber-50/55",
  toolbarText: "text-amber-50",
  filterActive: "border-white bg-white text-black hover:bg-white/90",
  filterInactive: "border-white bg-transparent text-white hover:bg-white hover:text-black",
  toggleButton:
    "border-amber-50/15 text-amber-50/75 hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10 hover:text-amber-50",
  empty: "border-amber-50/20 bg-zinc-900 text-amber-50/70",
};

const lightTheme = {
  page: "bg-slate-50 text-slate-950",
  eyebrow: "text-slate-500",
  title: "text-slate-950",
  body: "text-slate-700",
  muted: "text-slate-500",
  toolbarText: "text-slate-700",
  filterActive: "border-[#ff6a1f] bg-[#ff6a1f] text-white hover:bg-[#e85f1b]",
  filterInactive: "border-slate-300 bg-white text-slate-700 hover:border-[#ff6a1f] hover:bg-orange-50 hover:text-slate-950",
  toggleButton:
    "border-slate-300 text-slate-700 hover:border-[#ff6a1f] hover:bg-orange-50 hover:text-slate-950",
  empty: "border-slate-200 bg-white text-slate-600",
};

const Mentor = () => {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const pageSize = 10;
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    const controller = new AbortController();

    const loadMentors = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        setMentors(await fetchMentors(controller.signal));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMentors([]);
        setFetchError("Unable to load live mentor data.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadMentors();

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

  if (isLoading) {
    return <LoadingPage label="Loading mentors" />;
  }

  return (
    <main className={`min-h-screen px-6 lg:px-10 ${theme.page}`} data-theme={themeMode}>
      <NavBar themeMode={themeMode} />
      <section className="mx-auto max-w-7xl pt-50 pb-16">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={() => setThemeMode((mode) => (mode === "dark" ? "light" : "dark"))}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${theme.toggleButton}`}
            aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
          >
            {themeMode === "dark" ? <FaSun /> : <FaMoon />}
            {themeMode === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className={`mb-4 text-sm font-bold uppercase tracking-[0.35em] ${theme.eyebrow}`}>
            Mentors
          </p>
          <h1 className={`text-4xl font-black leading-tight lg:text-6xl ${theme.title}`}>
            Meet the mentors guiding SRC 2026
          </h1>
          <p className={`mt-6 text-base leading-7 lg:text-lg ${theme.body}`}>
            A multidisciplinary mentoring team of {mentors.length} experts
            supporting research, creativity, and presentation quality across
            every field in the competition.
          </p>
          {fetchError && (
            <p className={`mt-4 text-sm ${theme.muted}`}>
              {fetchError}
            </p>
          )}
        </div>

        <div className={`mb-8 space-y-4 ${theme.toolbarText}`}>
          <div className="filter mx-auto flex max-w-7xl flex-wrap justify-center gap-2">
            {departments.map((department) => {
              const Icon = departmentIcons[department];
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => setActiveDepartment(department)}
                  className={`btn btn-sm rounded-full border flex items-center gap-1.5 ${activeDepartment === department
                      ? theme.filterActive
                      : theme.filterInactive
                    }`}
                >
                  {Icon && <Icon className="size-3.5" />}
                  {department}
                </button>
              );
            })}
          </div>

          <p className={`text-sm ${theme.body}`}>
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </div>

        <MentorList
          mentors={paginatedMentors}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentIcons={departmentIcons}
          themeMode={themeMode}
        />

        {!isLoading && filteredMentors.length === 0 && (
          <div className={`mt-8 rounded-2xl border p-6 text-center ${theme.empty}`}>
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
