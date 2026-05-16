import { useMemo, useState } from "react";
import MentorList from "./MentorList";
import { mentors } from "./mentorData";
import NavBar from "../navbar/NavBar";
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

const Mentor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");

  const departments = useMemo(() => {
    const uniqueDepartments = new Set(
      mentors.map((mentor) => mentor.role.split("|")[1]?.trim() ?? "Other")
    );

    return ["All", ...Array.from(uniqueDepartments).sort()];
  }, []);

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
  }, [activeDepartment, searchTerm]);

  return (
    <main className="min-h-screen bg-black px-6 py-50 text-amber-50 lg:px-10">
      <NavBar />
      <section className="mx-auto max-w-7xl">
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
          mentors={filteredMentors}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentIcons={departmentIcons}
        />

        {filteredMentors.length === 0 && (
          <div className="mt-8 rounded-2xl border border-amber-50/20 bg-zinc-900 p-6 text-center text-amber-50/70">
            No mentors matched your search or filter.
          </div>
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
    </main>
  );
};

export default Mentor;
