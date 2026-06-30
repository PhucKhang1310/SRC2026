import { useState } from "react";
import { FaBullseye, FaGlobe, FaGraduationCap, FaLayerGroup } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate } from "react-icons/si";
import type { MentorItem } from "../../data/mentorData";
import type { IconType } from "react-icons";

interface MentorListProps {
  mentors: MentorItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentIcons?: Record<string, IconType>;
  themeMode?: "dark" | "light";
}

const darkTheme = {
  searchShell: "border-amber-50/20 bg-zinc-900",
  searchInput: "border-amber-50/20 bg-zinc-800 text-amber-50 placeholder:text-amber-50/35",
  card: "border-amber-50/10 bg-zinc-900 hover:border-amber-400/30 hover:shadow-amber-400/5",
  avatarFallback: "bg-amber-400/15 text-amber-200 ring-amber-400/20",
  imageRing: "ring-amber-400/20",
  title: "text-amber-50",
  role: "text-amber-400/80",
  detailBorder: "border-amber-400/30",
  detailText: "text-amber-50/70",
  icon: "text-amber-400/70",
  linkBorder: "border-amber-50/5",
  readMore: "text-amber-400/80 hover:text-amber-200",
};

const lightTheme = {
  searchShell: "border-slate-200 bg-white",
  searchInput: "border-slate-300 bg-slate-50 text-slate-950 placeholder:text-slate-400",
  card: "border-slate-200 bg-white hover:border-orange-300 hover:shadow-orange-100",
  avatarFallback: "bg-orange-100 text-orange-700 ring-orange-200",
  imageRing: "ring-orange-200",
  title: "text-slate-950",
  role: "text-orange-700",
  detailBorder: "border-orange-300",
  detailText: "text-slate-700",
  icon: "text-orange-600",
  linkBorder: "border-slate-200",
  readMore: "text-orange-700 hover:text-orange-900",
};

const MentorList = ({
  mentors,
  searchTerm,
  onSearchChange,
  departmentIcons,
  themeMode = "dark",
}: MentorListProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const toggleExpanded = (cardId: string) => {
    setExpandedCards((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className={`sticky top-0 z-20 rounded-xl border px-4 py-3 ${theme.searchShell}`}>
        <label className={`input input-bordered flex w-full items-center gap-2 ${theme.searchInput}`}>
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
        {mentors.map((mentor, index) => {
          const cardId = `${mentor.name}-${index}`;
          const isExpanded = expandedCards[cardId] ?? false;
          const canExpand = mentor.description.length > 180;
          const links = mentor.links;
          const detailRows = [
            { icon: FaLayerGroup, title: "Research areas", value: mentor.researchAreas },
            { icon: FaBullseye, title: "Research topics", value: mentor.researchTopics },
          ].filter((row): row is { icon: typeof FaLayerGroup; title: string; value: string } =>
            Boolean(row.value),
          );

          return (
            <div
              key={cardId}
              className={`group flex flex-col rounded-xl border p-5 transition-all duration-300 hover:shadow-lg ${theme.card} ${isExpanded ? "min-h-60" : "min-h-[15.5rem]"
                }`}
            >
              {/* Top section: photo + name + role */}
              <div className="flex h-16 shrink-0 items-start gap-4 overflow-hidden">
                {mentor.image ? (
                  <img
                    className={`size-14 rounded-lg object-cover ring-2 ${theme.imageRing}`}
                    src={mentor.image}
                    alt={mentor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-lg text-sm font-bold ring-2 ${theme.avatarFallback}`}>
                    {getInitials(mentor.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className={`line-clamp-1 text-base font-bold uppercase tracking-wide wrap-anywhere ${theme.title}`}>
                    {mentor.name}
                  </h3>
                  <div className={`mt-1 flex items-start gap-1.5 overflow-hidden text-sm ${theme.role}`}>
                    {(() => {
                      const dept = mentor.role.split("|")[1]?.trim() ?? "";
                      const DeptIcon = departmentIcons?.[dept] ?? FaGraduationCap;
                      return <DeptIcon className="mt-0.5 size-3.5 shrink-0" />;
                    })()}
                    <span className="line-clamp-2 wrap-anywhere">
                      {mentor.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description with research icon */}
              <div
                className={`mt-4 mb-4 flex border-l-2 pl-3 ${theme.detailBorder} ${isExpanded
                    ? "flex-none overflow-visible"
                    : "flex-1"
                  }`}
              >
                <div
                  className={`space-y-2 text-sm leading-relaxed wrap-anywhere ${theme.detailText} ${isExpanded
                      ? "overflow-visible"
                      : ""
                    }`}
                >
                  {detailRows.length ? (
                    detailRows.map((row) => (
                      <p key={row.title} className="flex gap-2">
                        <row.icon
                          className={`mt-1 size-3.5 shrink-0 ${theme.icon}`}
                          aria-label={row.title}
                        />
                        <span
                          className={
                            isExpanded
                              ? ""
                              : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                          }
                        >
                          {row.value}
                        </span>
                      </p>
                    ))
                  ) : (
                    <p
                      className={
                        isExpanded
                          ? ""
                          : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]"
                      }
                    >
                      {mentor.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Links row */}
              {(canExpand || links) && (
                <div className={`mt-auto flex shrink-0 items-center gap-1 border-t pt-3 ${theme.linkBorder}`}>
                  {links?.website && (
                    <a
                      href={links.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                      aria-label={`${mentor.name} website`}
                    >
                      <FaGlobe className="size-3.5" />
                    </a>
                  )}
                  {links?.orcid && (
                    <a
                      href={links.orcid}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                      aria-label={`${mentor.name} ORCID`}
                    >
                      <SiOrcid className="size-3.5" />
                    </a>
                  )}
                  {links?.researchgate && (
                    <a
                      href={links.researchgate}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                      aria-label={`${mentor.name} ResearchGate`}
                    >
                      <SiResearchgate className="size-3.5" />
                    </a>
                  )}
                  {links?.googleScholar && (
                    <a
                      href={links.googleScholar}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost btn-xs rounded-lg opacity-60 hover:opacity-100"
                      aria-label={`${mentor.name} Google Scholar`}
                    >
                      <SiGooglescholar className="size-3.5" />
                    </a>
                  )}
                  {canExpand && (
                    <button
                      type="button"
                      className={`btn btn-ghost btn-xs ml-auto rounded-lg px-0 ${theme.readMore}`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleExpanded(cardId)}
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentorList;
