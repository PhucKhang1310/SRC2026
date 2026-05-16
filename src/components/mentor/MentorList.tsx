import { FaGlobe, FaGraduationCap, FaFlask } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate } from "react-icons/si";
import type { MentorItem } from "./mentorData";
import type { IconType } from "react-icons";

interface MentorListProps {
  mentors: MentorItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentIcons?: Record<string, IconType>;
}

const MentorList = ({
  mentors,
  searchTerm,
  onSearchChange,
  departmentIcons,
}: MentorListProps) => {
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="sticky top-0 z-20 rounded-xl border border-amber-50/20 bg-zinc-900 px-4 py-3">
        <label className="input input-bordered flex w-full items-center gap-2 border-amber-50/20 bg-zinc-800 text-amber-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5.5 5.5 0 1 1 1.06-1.06l3.474 3.474a.75.75 0 1 1-1.06 1.06l-3.474-3.474ZM10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search mentors by name, role, or research area"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      {/* 2-column grid of mentor cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mentors.map((mentor, index) => (
          <div
            key={`${mentor.name}-${index}`}
            className="group rounded-xl border border-amber-50/10 bg-zinc-900 p-5 transition-all duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/5"
          >
            {/* Top section: photo + name + role */}
            <div className="flex items-start gap-4">
              <img
                className="size-14 rounded-lg object-cover ring-2 ring-amber-400/20"
                src={mentor.image}
                alt={mentor.name}
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold uppercase tracking-wide text-amber-50">
                  {mentor.name}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-amber-400/80">
                  {(() => {
                    const dept = mentor.role.split("|")[1]?.trim() ?? "";
                    const DeptIcon = departmentIcons?.[dept] ?? FaGraduationCap;
                    return <DeptIcon className="size-3.5 shrink-0" />;
                  })()}
                  <span>{mentor.role}</span>
                </div>
              </div>
            </div>

            {/* Description with research icon */}
            <div className="mt-4 flex gap-2.5 border-l-2 border-amber-400/30 pl-3">
              <FaFlask className="mt-0.5 size-3.5 shrink-0 text-amber-400/60" />
              <p className="text-sm leading-relaxed text-amber-50/70">
                {mentor.description}
              </p>
            </div>

            {/* Links row */}
            {mentor.links && (
              <div className="mt-4 flex items-center gap-1 border-t border-amber-50/5 pt-3">
                {mentor.links.website && (
                  <a
                    href={mentor.links.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                    aria-label={`${mentor.name} website`}
                  >
                    <FaGlobe className="size-3.5" />
                  </a>
                )}
                {mentor.links.orcid && (
                  <a
                    href={mentor.links.orcid}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                    aria-label={`${mentor.name} ORCID`}
                  >
                    <SiOrcid className="size-3.5" />
                  </a>
                )}
                {mentor.links.researchgate && (
                  <a
                    href={mentor.links.researchgate}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                    aria-label={`${mentor.name} ResearchGate`}
                  >
                    <SiResearchgate className="size-3.5" />
                  </a>
                )}
                {mentor.links.googleScholar && (
                  <a
                    href={mentor.links.googleScholar}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                    aria-label={`${mentor.name} Google Scholar`}
                  >
                    <SiGooglescholar className="size-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorList;
