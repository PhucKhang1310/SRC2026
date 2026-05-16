import { FaGlobe } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate } from "react-icons/si";
import type { MentorItem } from "./mentorData";

interface MentorListProps {
  mentors: MentorItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MentorList = ({
  mentors,
  searchTerm,
  onSearchChange,
}: MentorListProps) => {
  return (
    <ul className="list max-h-[70vh] overflow-y-auto rounded-box border border-amber-50/20 bg-zinc-900 text-amber-50">
      <li className="sticky top-0 z-20 border-b border-amber-50/15 bg-zinc-900 px-4 py-3">
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
            placeholder="Search mentors by name or role"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </li>

      {mentors.map((mentor, index) => (
        <li
          key={`${mentor.name}-${index}`}
          className="list-row border-b border-amber-50/10"
        >
          <div>
            <img
              className="size-12 rounded-box object-cover"
              src={mentor.image}
              alt={mentor.name}
              loading="lazy"
            />
          </div>
          <div>
            <div className="font-semibold uppercase">{mentor.name}</div>
            <div className="text-xs font-semibold capitalize opacity-60">
              {mentor.role}
            </div>
          </div>
          <p className="list-col-wrap text-xs">{mentor.description}</p>

          {mentor.links?.website && (
            <a
              href={mentor.links.website}
              target="_blank"
              rel="noreferrer"
              className="btn btn-square btn-ghost"
              aria-label={`${mentor.name} website`}
            >
              <FaGlobe className="size-[1.2em]" />
            </a>
          )}
          {mentor.links?.orcid && (
            <a
              href={mentor.links.orcid}
              target="_blank"
              rel="noreferrer"
              className="btn btn-square btn-ghost"
              aria-label={`${mentor.name} ORCID`}
            >
              <SiOrcid className="size-[1.2em]" />
            </a>
          )}
          {mentor.links?.researchgate && (
            <a
              href={mentor.links.researchgate}
              target="_blank"
              rel="noreferrer"
              className="btn btn-square btn-ghost"
              aria-label={`${mentor.name} ResearchGate`}
            >
              <SiResearchgate className="size-[1.2em]" />
            </a>
          )}
          {mentor.links?.googleScholar && (
            <a
              href={mentor.links.googleScholar}
              target="_blank"
              rel="noreferrer"
              className="btn btn-square btn-ghost"
              aria-label={`${mentor.name} Google Scholar`}
            >
              <SiGooglescholar className="size-[1.2em]" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MentorList;
