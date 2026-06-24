import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  FaArrowRight,
  FaClockRotateLeft,
  FaEye,
  FaFloppyDisk,
  FaInbox,
  FaPen,
  FaPlus,
  FaRotateRight,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/newsApi";
import {
  createContentVersion,
  fetchContentVersions,
  getPageContent,
  updatePageContent,
  type ContentVersionSummary,
} from "../../api/pageContentApi";
import type {
  AwardCommittee,
  AwardTier,
  EditableContent,
  PageSectionKind,
  RegulationSection,
  ResearchFieldItem,
  WorkshopItem,
} from "../../data/contentData";
import { useUser } from "../../hook/useUser";
import LoadingPage from "../../components/loading/LoadingPage";

const dateFormatter = new Intl.DateTimeFormat("vi-VN");
const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const sectionLabels: Record<PageSectionKind, string> = {
  hero: "Hero",
  about: "About",
  research: "Research Fields",
  awards: "Awards",
  regulations: "Regulations",
  milestones: "Milestones",
  news: "News",
  publications: "Publications Preview",
  workshops: "Workshop",
  footer: "Footer",
};

const getNewsTime = (item: NewsRecord) => {
  const date = new Date(item.date || item.createdAt || item.updatedAt || "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatNewsDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "No date" : dateFormatter.format(date);
};

const listToText = (items: string[]) => items.join("\n");

const textToList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const AdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [content, setContent] = useState<EditableContent | null>(null);
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveBarVisible, setIsSaveBarVisible] = useState(false);
  const [contentError, setContentError] = useState("");
  const [newsError, setNewsError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [versions, setVersions] = useState<ContentVersionSummary[]>([]);
  const [versionsError, setVersionsError] = useState("");
  const [selectedVersion, setSelectedVersion] =
    useState<ContentVersionSummary | null>(null);
  const lastScrollY = useRef(0);

  const latestNews = useMemo(
    () => [...news].sort((a, b) => getNewsTime(b) - getNewsTime(a)).slice(0, 5),
    [news],
  );

  const updateContent = (updater: (current: EditableContent) => EditableContent) => {
    setContent((current) => (current ? updater(current) : current));
    setSaveMessage("");
  };

  const updateLayout = (
    updater: (layout: EditableContent["layout"]) => EditableContent["layout"],
  ) => {
    updateContent((current) => ({
      ...current,
      layout: updater(current.layout),
    }));
  };

  const moveLayoutSection = (sectionId: PageSectionKind, direction: -1 | 1) => {
    updateLayout((layout) => {
      const nextLayout = [...layout];
      const currentIndex = nextLayout.findIndex((section) => section.id === sectionId);
      const nextIndex = currentIndex + direction;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= nextLayout.length) {
        return layout;
      }

      [nextLayout[currentIndex], nextLayout[nextIndex]] = [
        nextLayout[nextIndex],
        nextLayout[currentIndex],
      ];
      return nextLayout;
    });
  };

  const setLayoutSectionEnabled = (
    sectionId: PageSectionKind,
    enabled: boolean,
  ) => {
    updateLayout((layout) =>
      layout.map((section) =>
        section.id === sectionId ? { ...section, enabled } : section,
      ),
    );
  };

  const loadVersions = async (signal?: AbortSignal) => {
    try {
      setVersionsError("");
      setVersions(await fetchContentVersions(signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setVersions([]);
      setVersionsError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load page history.",
      );
    }
  };

  const loadContent = async (
    signal?: AbortSignal,
    options: { forceRefresh?: boolean } = {},
  ) => {
    try {
      setIsContentLoading(true);
      setContentError("");
      setContent(await getPageContent(signal, options));
    } catch (loadError) {
      if (signal?.aborted) return;
      setContentError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load page content.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsContentLoading(false);
      }
    }
  };

  const loadNews = async (
    signal?: AbortSignal,
    options: { forceRefresh?: boolean } = {},
  ) => {
    try {
      setIsNewsLoading(true);
      setNewsError("");
      setNews(await fetchNews(signal, options));
    } catch (loadError) {
      if (signal?.aborted) return;
      setNewsError(
        loadError instanceof Error ? loadError.message : "Could not load news.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsNewsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setIsSaving(true);
      setContentError("");
      setSaveMessage("");
      const savedContent = await updatePageContent(content);
      setContent(savedContent);

      try {
        await createContentVersion(
          `Saved ${new Date().toLocaleString()}`,
          savedContent,
        );
        await loadVersions();
        setSaveMessage("Page content saved and versioned.");
      } catch (versionError) {
        setVersionsError(
          versionError instanceof Error
            ? versionError.message
            : "Could not save page version.",
        );
        setSaveMessage("Page content saved. Version history was not updated.");
      }

      setIsEditing(false);
      setIsSaveBarVisible(false);
    } catch (saveError) {
      setContentError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save page content.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadContent(controller.signal);
    void loadNews(controller.signal);
    void loadVersions(controller.signal);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setIsSaveBarVisible(false);
      return;
    }

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isNearBottom =
        window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 24;

      if (currentScrollY > lastScrollY.current + 8 || isNearBottom) {
        setIsSaveBarVisible(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsSaveBarVisible(false);
      }

      lastScrollY.current = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEditing]);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isContentLoading || isNewsLoading) {
    return <LoadingPage label="Loading admin content" />;
  }

  const renderEditableSection = (sectionId: PageSectionKind) => {
    if (!content) return null;

    switch (sectionId) {
      case "hero":
        return (
          <HeroSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "about":
        return (
          <AboutSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "research":
        return (
          <ResearchSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "awards":
        return (
          <AwardsSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "regulations":
        return (
          <RegulationsSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "milestones":
        return (
          <MilestonesSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "news":
        return (
          <AdminSection
            title="News"
            action={
              <button
                type="button"
                onClick={() => navigate("/admin/news")}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-50/25 px-3 py-2 text-sm font-semibold cursor-pointer text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10"
              >
                Manage news
                <FaArrowRight />
              </button>
            }
          >
            {newsError ? <ErrorMessage>{newsError}</ErrorMessage> : null}
            <NewsList news={latestNews} />
          </AdminSection>
        );
      case "publications":
        return (
          <PublicationsPreviewSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "workshops":
        return (
          <WorkshopSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "footer":
        return (
          <FooterSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-amber-50">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-amber-50/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6a1f]">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              <a href="/">SRC2026</a>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-amber-50/60">
              Review and update public page content from the backend API.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/submissions")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-50/25 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10 cursor-pointer"
            >
              <FaInbox />
              Review submissions
            </button>
            <button
              type="button"
              onClick={() => {
                void loadContent(undefined, { forceRefresh: true });
                void loadNews(undefined, { forceRefresh: true });
                setIsEditing(false);
                setIsSaveBarVisible(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-50/25 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10 cursor-pointer"
            >
              <FaRotateRight />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing((value) => {
                  const nextValue = !value;
                  setIsSaveBarVisible(nextValue);
                  return nextValue;
                });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b] cursor-pointer"
            >
              {isEditing ? <FaXmark /> : <FaPen />}
              {isEditing ? "Stop editing" : "Edit content"}
            </button>
          </div>
        </div>

        {contentError ? <ErrorMessage>{contentError}</ErrorMessage> : null}
        {saveMessage ? <SuccessMessage>{saveMessage}</SuccessMessage> : null}

        {content ? (
          <>
            <LayoutSection
              content={content}
              isEditing={isEditing}
              onAdd={(sectionId) => setLayoutSectionEnabled(sectionId, true)}
              onMove={moveLayoutSection}
              onRemove={(sectionId) => setLayoutSectionEnabled(sectionId, false)}
            />
            {content.layout
              .filter((section) => section.enabled)
              .map((section) => (
                <div key={section.id}>{renderEditableSection(section.id)}</div>
              ))}
            <HistorySection
              error={versionsError}
              onSelectVersion={setSelectedVersion}
              selectedVersion={selectedVersion}
              versions={versions}
            />
          </>
        ) : (
          <p className="py-12 text-center text-sm text-amber-50/60">
            No page content was returned.
          </p>
        )}



      </section>
      {content ? (
        <SaveBar
          isSaving={isSaving}
          isVisible={isSaveBarVisible}
          onSave={() => void handleSave()}
        />
      ) : null}
    </main>
  );
};

type ContentUpdater = (updater: (current: EditableContent) => EditableContent) => void;

type EditableSectionProps = {
  content: EditableContent;
  isEditing: boolean;
  updateContent: ContentUpdater;
};

type LayoutSectionProps = {
  content: EditableContent;
  isEditing: boolean;
  onAdd: (sectionId: PageSectionKind) => void;
  onMove: (sectionId: PageSectionKind, direction: -1 | 1) => void;
  onRemove: (sectionId: PageSectionKind) => void;
};

const LayoutSection = ({
  content,
  isEditing,
  onAdd,
  onMove,
  onRemove,
}: LayoutSectionProps) => {
  const enabledSections = content.layout.filter((section) => section.enabled);
  const disabledSections = content.layout.filter((section) => !section.enabled);

  return (
    <AdminSection title="Page Layout">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <ContentCard>
          <ul className="list">
            {enabledSections.map((section, index) => (
              <li
                key={section.id}
                className="list-row border-b border-amber-50/10 last:border-b-0"
              >
                <div className="list-col-grow">
                  <div className="font-semibold text-amber-50">
                    {sectionLabels[section.id]}
                  </div>
                  <div className="text-xs text-amber-50/45">
                    Position {index + 1}
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={!isEditing || index === 0}
                    onClick={() => onMove(section.id, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={!isEditing || index === enabledSections.length - 1}
                    onClick={() => onMove(section.id, 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-red-200"
                    disabled={!isEditing}
                    onClick={() => onRemove(section.id)}
                  >
                    <FaTrash className="size-3" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </ContentCard>

        <ContentCard>
          <div className="flex items-center gap-2">
            <FaPlus className="text-[#ff6a1f]" />
            <h3 className="font-semibold">Add section</h3>
          </div>
          {disabledSections.length === 0 ? (
            <p className="mt-4 text-sm text-amber-50/55">
              All page sections are active.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {disabledSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="btn btn-outline btn-sm border-amber-50/25 text-amber-50"
                  disabled={!isEditing}
                  onClick={() => onAdd(section.id)}
                >
                  <FaPlus className="size-3" />
                  {sectionLabels[section.id]}
                </button>
              ))}
            </div>
          )}
          {!isEditing ? (
            <p className="mt-4 text-xs text-amber-50/40">
              Enable edit mode to change the page layout.
            </p>
          ) : null}
        </ContentCard>
      </div>
    </AdminSection>
  );
};

type HistorySectionProps = {
  error: string;
  onSelectVersion: (version: ContentVersionSummary) => void;
  selectedVersion: ContentVersionSummary | null;
  versions: ContentVersionSummary[];
};

const HistorySection = ({
  error,
  onSelectVersion,
  selectedVersion,
  versions,
}: HistorySectionProps) => (
  <AdminSection title="History">
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <ContentCard>
        <div className="flex items-center gap-2">
          <FaClockRotateLeft className="text-[#ff6a1f]" />
          <h3 className="font-semibold">Saved versions</h3>
        </div>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        {!error && versions.length === 0 ? (
          <p className="mt-4 text-sm text-amber-50/55">
            No saved page versions were returned by the database.
          </p>
        ) : (
          <div className="mt-4 grid gap-2">
            {versions.map((version) => (
              <button
                key={version.id}
                type="button"
                className={`btn justify-start border-amber-50/15 bg-zinc-950 text-left text-amber-50 hover:border-[#ff6a1f] ${selectedVersion?.id === version.id ? "border-[#ff6a1f]" : ""
                  }`}
                onClick={() => onSelectVersion(version)}
              >
                <FaEye className="size-4 shrink-0" />
                <span className="min-w-0 truncate">{version.label}</span>
              </button>
            ))}
          </div>
        )}
      </ContentCard>

      <ContentCard>
        {selectedVersion ? (
          <VersionPreview version={selectedVersion} />
        ) : (
          <p className="text-sm text-amber-50/55">
            Select a saved version to view a previous competition page layout.
          </p>
        )}
      </ContentCard>
    </div>
  </AdminSection>
);

const VersionPreview = ({ version }: { version: ContentVersionSummary }) => {
  const content = version.content;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge badge-outline border-[#ff6a1f] text-[#ff6a1f]">
          {new Date(version.createdAt).toLocaleString()}
        </span>
        <h3 className="text-lg font-semibold">{version.label}</h3>
      </div>
      {content ? (
        <div className="mt-5 grid gap-5">
          <div>
            <p className={labelClass}>Section order</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {content.layout
                .filter((section) => section.enabled)
                .map((section) => (
                  <span key={section.id} className="badge badge-ghost">
                    {sectionLabels[section.id]}
                  </span>
                ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ReadOnlyMetric label="Hero" value={content.hero.titleLines.join(" ")} />
            <ReadOnlyMetric label="About" value={content.about.title} />
            <ReadOnlyMetric label="Research Fields" value={String(content.researchFields.length)} />
            <ReadOnlyMetric label="Milestones" value={String(content.milestones.length)} />
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-amber-50/55">
          This version did not include an inspectable content snapshot.
        </p>
      )}
    </div>
  );
};

const ReadOnlyMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded border border-amber-50/10 bg-black p-3">
    <p className={labelClass}>{label}</p>
    <p className="mt-1 line-clamp-2 text-sm text-amber-50/80">{value}</p>
  </div>
);

const HeroSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Hero">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableListField
          isEditing={isEditing}
          label="Title lines"
          value={content.hero.titleLines}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              hero: { ...current.hero, titleLines: value },
            }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Registration deadline"
          value={content.hero.registrationDeadline}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              hero: { ...current.hero, registrationDeadline: value },
            }))
          }
        />
        {(["taglinePrimary", "taglineSecondary", "countdownLabel", "ctaLabel", "ctaUrl", "partnerLabel", "closingLinePrimary", "closingLineSecondary"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.hero[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                hero: { ...current.hero, [field]: value },
              }))
            }
          />
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const AboutSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="About">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["sectionLabel", "title", "highlightOne", "highlightTwo"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.about[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                about: { ...current.about, [field]: value },
              }))
            }
          />
        ))}
        {(["paragraphOne", "paragraphTwo", "paragraphThree"] as const).map((field) => (
          <div key={field} className="md:col-span-2">
            <EditableField
              isEditing={isEditing}
              label={field}
              textarea
              value={content.about[field]}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  about: { ...current.about, [field]: value },
                }))
              }
            />
          </div>
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const ResearchSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Research Fields">
    <ContentCard>
      <EditableField
        isEditing={isEditing}
        label="Section title"
        value={content.researchTitle}
        onChange={(value) =>
          updateContent((current) => ({ ...current, researchTitle: value }))
        }
      />
    </ContentCard>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {content.researchFields.map((item) => (
        <ResearchFieldCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const ResearchFieldCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: ResearchFieldItem;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (
    updater: (item: ResearchFieldItem) => ResearchFieldItem,
  ) => {
    updateContent((current) => ({
      ...current,
      researchFields: current.researchFields.map((field) =>
        field.id === item.id ? updater(field) : field,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Title"
          value={item.title}
          onChange={(value) => updateItem((field) => ({ ...field, title: value }))}
        />
        <EditableField
          isEditing={isEditing}
          label="Icon"
          value={item.icon}
          onChange={(value) =>
            updateItem((field) => ({
              ...field,
              icon: value as ResearchFieldItem["icon"],
            }))
          }
        />
        <EditableListField
          isEditing={isEditing}
          label="Accordion items"
          value={item.accordionItems}
          onChange={(value) =>
            updateItem((field) => ({ ...field, accordionItems: value }))
          }
        />
        <EditableListField
          isEditing={isEditing}
          label="Carousel items"
          value={item.carouselItems}
          onChange={(value) =>
            updateItem((field) => ({ ...field, carouselItems: value }))
          }
        />
      </div>
    </ContentCard>
  );
};

const AwardsSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Awards">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-3">
        {(["awardsTitle", "awardsStandardLabel", "awardsSmallLabel"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content[field]}
            onChange={(value) =>
              updateContent((current) => ({ ...current, [field]: value }))
            }
          />
        ))}
      </div>
      <div className="mt-4">
        <EditableField
          isEditing={isEditing}
          label="Awards note"
          textarea
          value={content.awardsNote}
          onChange={(value) =>
            updateContent((current) => ({ ...current, awardsNote: value }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {content.awards.map((award) => (
        <AwardCard
          key={award.id}
          award={award}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const AwardCard = ({
  award,
  isEditing,
  updateContent,
}: {
  award: AwardCommittee;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateAward = (updater: (award: AwardCommittee) => AwardCommittee) => {
    updateContent((current) => ({
      ...current,
      awards: current.awards.map((item) =>
        item.id === award.id ? updater(item) : item,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Name"
          value={award.name}
          onChange={(value) => updateAward((item) => ({ ...item, name: value }))}
        />
        <EditableField
          isEditing={isEditing}
          label="Vietnamese name"
          value={award.nameVi}
          onChange={(value) => updateAward((item) => ({ ...item, nameVi: value }))}
        />
        <AwardTierFields
          isEditing={isEditing}
          label="Standard awards"
          tiers={award.standardAwards}
          onChange={(tiers) =>
            updateAward((item) => ({ ...item, standardAwards: tiers }))
          }
        />
        <AwardTierFields
          isEditing={isEditing}
          label="Small awards"
          tiers={award.smallAwards}
          onChange={(tiers) =>
            updateAward((item) => ({ ...item, smallAwards: tiers }))
          }
        />
      </div>
    </ContentCard>
  );
};

const AwardTierFields = ({
  isEditing,
  label,
  onChange,
  tiers,
}: {
  isEditing: boolean;
  label: string;
  onChange: (tiers: AwardTier[]) => void;
  tiers: AwardTier[];
}) => (
  <div>
    <p className={labelClass}>{label}</p>
    <div className="mt-2 grid gap-2">
      {tiers.map((tier) => (
        <div key={tier.id} className="grid gap-2 rounded border border-amber-50/10 p-3 md:grid-cols-2">
          <EditableField
            isEditing={isEditing}
            label="Label"
            value={tier.label}
            onChange={(value) =>
              onChange(tiers.map((item) => (item.id === tier.id ? { ...item, label: value } : item)))
            }
          />
          <EditableField
            isEditing={isEditing}
            label="Amount"
            value={tier.amount}
            onChange={(value) =>
              onChange(tiers.map((item) => (item.id === tier.id ? { ...item, amount: value } : item)))
            }
          />
        </div>
      ))}
    </div>
  </div>
);

const RegulationsSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Regulations">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableField
          isEditing={isEditing}
          label="Section title"
          value={content.regulationsTitle}
          onChange={(value) =>
            updateContent((current) => ({ ...current, regulationsTitle: value }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Subtitle"
          value={content.regulationsSubtitle}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              regulationsSubtitle: value,
            }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4">
      {content.regulations.map((item) => (
        <RegulationCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const RegulationCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: RegulationSection;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (updater: (item: RegulationSection) => RegulationSection) => {
    updateContent((current) => ({
      ...current,
      regulations: current.regulations.map((regulation) =>
        regulation.id === item.id ? updater(regulation) : regulation,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Title"
          value={item.title}
          onChange={(value) => updateItem((current) => ({ ...current, title: value }))}
        />
        <EditableListField
          isEditing={isEditing}
          label="Rules"
          value={item.items}
          onChange={(value) => updateItem((current) => ({ ...current, items: value }))}
        />
      </div>
    </ContentCard>
  );
};

const MilestonesSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Milestones">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableField
          isEditing={isEditing}
          label="Section title"
          value={content.milestonesTitle}
          onChange={(value) =>
            updateContent((current) => ({ ...current, milestonesTitle: value }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Note"
          textarea
          value={content.milestonesNote}
          onChange={(value) =>
            updateContent((current) => ({ ...current, milestonesNote: value }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {content.milestones.map((item) => (
        <ContentCard key={item.id}>
          <div className="grid gap-3">
            <EditableField
              isEditing={isEditing}
              label="Date"
              value={item.date}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, date: value } : milestone,
                  ),
                }))
              }
            />
            <EditableField
              isEditing={isEditing}
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, title: value } : milestone,
                  ),
                }))
              }
            />
            <EditableField
              isEditing={isEditing}
              label="Detail"
              value={item.detail ?? ""}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, detail: value || undefined } : milestone,
                  ),
                }))
              }
            />
          </div>
        </ContentCard>
      ))}
    </div>
  </AdminSection>
);

const PublicationsPreviewSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Publications Preview">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["eyebrow", "badge", "readMoreLabel", "viewAllLabel"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.publicationsHome[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                publicationsHome: { ...current.publicationsHome, [field]: value },
              }))
            }
          />
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const WorkshopSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Workshop">
    <div className="grid gap-4">
      {content.workshops.map((item) => (
        <WorkshopCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const WorkshopCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: WorkshopItem;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (updater: (item: WorkshopItem) => WorkshopItem) => {
    updateContent((current) => ({
      ...current,
      workshops: current.workshops.map((workshop) =>
        workshop.id === item.id ? updater(workshop) : workshop,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["eyebrow", "title", "scheduleLabel", "date", "note", "sessionTitle", "sessionSubtitle", "time"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={item[field]}
            onChange={(value) =>
              updateItem((workshop) => ({ ...workshop, [field]: value }))
            }
          />
        ))}
        <div className="md:col-span-2">
          <EditableField
            isEditing={isEditing}
            label="Description"
            textarea
            value={item.description}
            onChange={(value) =>
              updateItem((workshop) => ({ ...workshop, description: value }))
            }
          />
        </div>
      </div>
    </ContentCard>
  );
};

const FooterSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Footer">
    <ContentCard>
      <div className="grid gap-3 mb-12 md:grid-cols-2">
        {(["headlineOne", "headlineTwo", "headlineThree", "ctaLabel", "ctaUrl", "contactHeading", "facebookLabel", "facebookUrl", "emailLabel", "email", "phoneLabel", "phone", "copyrightLine", "rightsLine"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.footer[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                footer: { ...current.footer, [field]: value },
              }))
            }
          />
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const NewsList = ({
  news,
}: {
  news: NewsRecord[];
}) => (
  <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
    <div className="grid grid-cols-[96px_1fr] gap-4 border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid-cols-[120px_1fr_180px_140px]">
      <span>Image</span>
      <span>Title</span>
      <span className="hidden md:block">Author</span>
      <span className="hidden md:block">Date</span>
    </div>

    {news.length === 0 ? (
      <p className="px-4 py-10 text-center text-sm text-slate-400">
        No news articles found.
      </p>
    ) : (
      news.map((item) => (
        <article
          key={item._id}
          className="grid grid-cols-[96px_1fr] gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0 md:grid-cols-[120px_1fr_180px_140px] md:items-center"
        >
          {item.thumbNailImage ? (
            <img
              src={item.thumbNailImage}
              alt={item.title}
              className="h-16 w-24 rounded object-cover md:h-20 md:w-28"
            />
          ) : (
            <div className="h-16 w-24 rounded bg-slate-800 md:h-20 md:w-28" />
          )}
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-400">
              {item.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 md:hidden">
              <span>{item.author}</span>
              <span>{formatNewsDate(item.date)}</span>
            </div>
          </div>
          <span className="hidden text-sm text-slate-300 md:block">{item.author}</span>
          <span className="hidden text-sm text-slate-400 md:block">
            {formatNewsDate(item.date)}
          </span>
        </article>
      ))
    )}
  </div>
);

type AdminSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

const AdminSection = ({ action, children, title }: AdminSectionProps) => (
  <section className="mt-8">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

type SaveBarProps = {
  isSaving: boolean;
  isVisible: boolean;
  onSave: () => void;
};

const SaveBar = ({ isSaving, isVisible, onSave }: SaveBarProps) => (
  <div
    className={`fixed inset-x-0 bottom-0 z-50 border-t border-amber-50/15 bg-black/90 px-5 py-4 backdrop-blur transition-transform duration-200 ${isVisible ? "translate-y-0" : "translate-y-full"
      }`}
  >
    <div className="mx-auto flex max-w-6xl justify-end">
      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaFloppyDisk />
        {isSaving ? "Saving..." : "Save page content"}
      </button>
    </div>
  </div>
);

const ContentCard = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
    {children}
  </div>
);

const EditableField = ({
  isEditing,
  label,
  onChange,
  textarea = false,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  value: string;
}) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    {isEditing ? (
      textarea ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    ) : (
      <span className="text-sm leading-6 text-amber-50/80">{value || "-"}</span>
    )}
  </label>
);

const EditableListField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string[]) => void;
  value: string[];
}) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    {isEditing ? (
      <textarea
        className={`${inputClass} min-h-28 resize-y`}
        value={listToText(value)}
        onChange={(event) => onChange(textToList(event.target.value))}
      />
    ) : (
      <span className="text-sm leading-6 text-amber-50/80">
        {value.length > 0 ? value.join(", ") : "-"}
      </span>
    )}
  </label>
);

const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
    {children}
  </div>
);

const SuccessMessage = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-md border border-emerald-500/40 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">
    {children}
  </div>
);

export default AdminPage;
