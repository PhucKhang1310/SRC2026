import { useState } from "react";
import {
  FaCheck,
  FaPen,
  FaPlus,
  FaRotateLeft,
  FaTrash,
} from "react-icons/fa6";
import {
  defaultContent,
  resetEditableContent,
  saveEditableContent,
  type EditableContent,
  type FooterContent,
  type HeroContent,
  type MilestoneItem,
  type PublicationsHomeContent,
  type RegulationSection,
  type ResearchFieldItem,
  type WorkshopItem,
} from "../../data/contentData";
import type { NewsItem } from "../../data/newsData";
import { useEditableContent } from "../../hook/useEditableContent";
import { useUser } from "../../hook/useUser";
import { Navigate } from "react-router-dom";

type SectionKey = keyof EditableContent;
type ArraySectionKey =
  | "news"
  | "milestones"
  | "workshops"
  | "researchFields"
  | "awards"
  | "regulations";
type EditingKey = `${SectionKey}-${number}`;

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const createEditingKey = (section: SectionKey, id: number): EditingKey =>
  `${section}-${id}`;

const getNextId = (items: { id: number }[]) =>
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const listToText = (items: string[]) => items.join("\n");

const textToList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const awardsToText = (items: { label: string; amount: string }[]) =>
  items.map((award) => `${award.label} | ${award.amount}`).join("\n");

const AdminPage = () => {
  const { user } = useUser();
  const storedContent = useEditableContent();
  const [content, setContent] = useState<EditableContent>(storedContent);
  const [editingKey, setEditingKey] = useState<EditingKey | null>(null);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const updateContent = (nextContent: EditableContent) => {
    setContent(nextContent);
    saveEditableContent(nextContent);
  };

  const handleReset = () => {
    resetEditableContent();
    setContent(defaultContent);
    setEditingKey(null);
  };

  const deleteItem = (section: ArraySectionKey, id: number) => {
    const nextContent = {
      ...content,
      [section]: content[section].filter((item) => item.id !== id),
    };
    updateContent(nextContent);
    setEditingKey(null);
  };

  const updateHero = (field: keyof HeroContent, value: string) => {
    updateContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: field === "titleLines" ? textToList(value) : value,
      },
    });
  };

  const updateAbout = (field: keyof typeof content.about, value: string) => {
    updateContent({
      ...content,
      about: {
        ...content.about,
        [field]: value,
      },
    });
  };

  const updateResearchField = (
    id: number,
    field: keyof ResearchFieldItem,
    value: string,
  ) => {
    updateContent({
      ...content,
      researchFields: content.researchFields.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]:
              field === "accordionItems" || field === "carouselItems"
                ? textToList(value)
                : value,
          }
          : item,
      ),
    });
  };

  const updateRegulation = (
    id: number,
    field: keyof RegulationSection,
    value: string,
  ) => {
    updateContent({
      ...content,
      regulations: content.regulations.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]: field === "items" ? textToList(value) : value,
          }
          : item,
      ),
    });
  };

  const updatePublicationsHome = (
    field: keyof PublicationsHomeContent,
    value: string,
  ) => {
    updateContent({
      ...content,
      publicationsHome: {
        ...content.publicationsHome,
        [field]: value,
      },
    });
  };

  const updateFooter = (field: keyof FooterContent, value: string) => {
    updateContent({
      ...content,
      footer: {
        ...content.footer,
        [field]: value,
      },
    });
  };

  const updateNewsItem = (
    id: number,
    field: keyof NewsItem,
    value: string,
  ) => {
    updateContent({
      ...content,
      news: content.news.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const updateMilestoneItem = (
    id: number,
    field: keyof MilestoneItem,
    value: string,
  ) => {
    updateContent({
      ...content,
      milestones: content.milestones.map((item) =>
        item.id === id
          ? { ...item, [field]: value || (field === "detail" ? undefined : value) }
          : item,
      ),
    });
  };

  const updateWorkshopItem = (
    id: number,
    field: keyof WorkshopItem,
    value: string,
  ) => {
    updateContent({
      ...content,
      workshops: content.workshops.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const addNewsItem = () => {
    const nextId = getNextId(content.news);
    updateContent({
      ...content,
      news: [
        {
          id: nextId,
          title: "New news title",
          description: "News description",
          author: "SRC Committee",
          date: new Date().toISOString().slice(0, 10),
        },
        ...content.news,
      ],
    });
    setEditingKey(createEditingKey("news", nextId));
  };

  const addMilestoneItem = () => {
    const nextId = getNextId(content.milestones);
    updateContent({
      ...content,
      milestones: [
        ...content.milestones,
        {
          id: nextId,
          date: "TBA",
          title: "New milestone",
        },
      ],
    });
    setEditingKey(createEditingKey("milestones", nextId));
  };

  const addResearchField = () => {
    const nextId = getNextId(content.researchFields);
    updateContent({
      ...content,
      researchFields: [
        ...content.researchFields,
        {
          id: nextId,
          icon: "code",
          title: "New research field",
          accordionItems: ["Topic"],
          carouselItems: ["Example project"],
        },
      ],
    });
    setEditingKey(createEditingKey("researchFields", nextId));
  };

  const addRegulation = () => {
    const nextId = getNextId(content.regulations);
    updateContent({
      ...content,
      regulations: [
        ...content.regulations,
        {
          id: nextId,
          title: "New regulation section",
          items: ["New rule"],
        },
      ],
    });
    setEditingKey(createEditingKey("regulations", nextId));
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
              Edit the text shown on the public page. Changes are saved in this
              browser for now.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b]"
          >
            <FaRotateLeft />
            Reset
          </button>
        </div>

        <AdminSection title="Hero">
          <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextArea
                label="Title lines"
                value={listToText(content.hero.titleLines)}
                onChange={(value) => updateHero("titleLines", value)}
              />
              <TextInput
                label="Registration deadline"
                value={content.hero.registrationDeadline}
                onChange={(value) => updateHero("registrationDeadline", value)}
              />
              <TextInput
                label="Primary tagline"
                value={content.hero.taglinePrimary}
                onChange={(value) => updateHero("taglinePrimary", value)}
              />
              <TextInput
                label="Secondary tagline"
                value={content.hero.taglineSecondary}
                onChange={(value) => updateHero("taglineSecondary", value)}
              />
              <TextInput
                label="Countdown label"
                value={content.hero.countdownLabel}
                onChange={(value) => updateHero("countdownLabel", value)}
              />
              <TextInput
                label="CTA label"
                value={content.hero.ctaLabel}
                onChange={(value) => updateHero("ctaLabel", value)}
              />
              <TextInput
                label="Partner label"
                value={content.hero.partnerLabel}
                onChange={(value) => updateHero("partnerLabel", value)}
              />
              <TextInput
                label="Closing line 1"
                value={content.hero.closingLinePrimary}
                onChange={(value) => updateHero("closingLinePrimary", value)}
              />
              <TextInput
                label="Closing line 2"
                value={content.hero.closingLineSecondary}
                onChange={(value) => updateHero("closingLineSecondary", value)}
              />
            </div>
          </div>
        </AdminSection>

        <AdminSection title="About">
          <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Section label"
                value={content.about.sectionLabel}
                onChange={(value) => updateAbout("sectionLabel", value)}
              />
              <TextInput
                label="Title"
                value={content.about.title}
                onChange={(value) => updateAbout("title", value)}
              />
              <TextInput
                label="Highlight 1"
                value={content.about.highlightOne}
                onChange={(value) => updateAbout("highlightOne", value)}
              />
              <TextInput
                label="Highlight 2"
                value={content.about.highlightTwo}
                onChange={(value) => updateAbout("highlightTwo", value)}
              />
              <div className="md:col-span-2">
                <TextArea
                  label="Paragraph 1"
                  value={content.about.paragraphOne}
                  onChange={(value) => updateAbout("paragraphOne", value)}
                />
              </div>
              <div className="md:col-span-2">
                <TextArea
                  label="Paragraph 2"
                  value={content.about.paragraphTwo}
                  onChange={(value) => updateAbout("paragraphTwo", value)}
                />
              </div>
              <div className="md:col-span-2">
                <TextArea
                  label="Paragraph 3"
                  value={content.about.paragraphThree}
                  onChange={(value) => updateAbout("paragraphThree", value)}
                />
              </div>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Research Fields"
          actionLabel="Add field"
          onAdd={addResearchField}
        >
          <div className="mb-4 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <TextInput
              label="Section title"
              value={content.researchTitle}
              onChange={(value) =>
                updateContent({ ...content, researchTitle: value })
              }
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {content.researchFields.map((item) => {
              const key = createEditingKey("researchFields", item.id);
              const isEditing = editingKey === key;

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
                >
                  <CardActions
                    isEditing={isEditing}
                    onEdit={() => setEditingKey(key)}
                    onDone={() => setEditingKey(null)}
                    onDelete={() => deleteItem("researchFields", item.id)}
                  />
                  {isEditing ? (
                    <div className="mt-4 grid gap-3">
                      <TextInput
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateResearchField(item.id, "title", value)
                        }
                      />
                      <TextInput
                        label="Icon"
                        value={item.icon}
                        onChange={(value) =>
                          updateResearchField(item.id, "icon", value)
                        }
                      />
                      <TextArea
                        label="Accordion items"
                        value={listToText(item.accordionItems)}
                        onChange={(value) =>
                          updateResearchField(item.id, "accordionItems", value)
                        }
                      />
                      <TextArea
                        label="Carousel items"
                        value={listToText(item.carouselItems)}
                        onChange={(value) =>
                          updateResearchField(item.id, "carouselItems", value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-lg font-bold text-[#ff6a1f]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-amber-50/60">
                        {item.accordionItems.join(", ")}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection title="Awards">
          <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Section title"
                value={content.awardsTitle}
                onChange={(value) =>
                  updateContent({ ...content, awardsTitle: value })
                }
              />
              <TextInput
                label="Standard awards label"
                value={content.awardsStandardLabel}
                onChange={(value) =>
                  updateContent({ ...content, awardsStandardLabel: value })
                }
              />
              <TextInput
                label="Small awards label"
                value={content.awardsSmallLabel}
                onChange={(value) =>
                  updateContent({ ...content, awardsSmallLabel: value })
                }
              />
              <div className="md:col-span-2">
                <TextArea
                  label="Award note"
                  value={content.awardsNote}
                  onChange={(value) =>
                    updateContent({ ...content, awardsNote: value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {content.awards.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
              >
                <h3 className="text-lg font-bold text-[#ff6a1f]">
                  {item.name}
                </h3>
                <div className="mt-4 grid gap-3">
                  <TextInput
                    label="Name"
                    value={item.name}
                    onChange={(value) =>
                      updateContent({
                        ...content,
                        awards: content.awards.map((award) =>
                          award.id === item.id ? { ...award, name: value } : award,
                        ),
                      })
                    }
                  />
                  <TextInput
                    label="Vietnamese name"
                    value={item.nameVi}
                    onChange={(value) =>
                      updateContent({
                        ...content,
                        awards: content.awards.map((award) =>
                          award.id === item.id ? { ...award, nameVi: value } : award,
                        ),
                      })
                    }
                  />
                  <TextArea
                    label="Standard awards"
                    value={awardsToText(item.standardAwards)}
                    onChange={(value) => {
                      const lines = textToList(value);
                      const nextStandard = item.standardAwards.map((award, index) => {
                        const [label, amount] = (lines[index] ?? "").split("|");
                        return {
                          ...award,
                          label: label?.trim() || award.label,
                          amount: amount?.trim() || award.amount,
                        };
                      });
                      updateContent({
                        ...content,
                        awards: content.awards.map((award) =>
                          award.id === item.id
                            ? { ...award, standardAwards: nextStandard }
                            : award,
                        ),
                      });
                    }}
                  />
                  <TextArea
                    label="Small awards"
                    value={awardsToText(item.smallAwards)}
                    onChange={(value) => {
                      const lines = textToList(value);
                      const nextSmall = item.smallAwards.map((award, index) => {
                        const [label, amount] = (lines[index] ?? "").split("|");
                        return {
                          ...award,
                          label: label?.trim() || award.label,
                          amount: amount?.trim() || award.amount,
                        };
                      });
                      updateContent({
                        ...content,
                        awards: content.awards.map((award) =>
                          award.id === item.id
                            ? { ...award, smallAwards: nextSmall }
                            : award,
                        ),
                      });
                    }}
                  />
                  <TextInput
                    label="Expanded note"
                    value={item.expandedNote ?? ""}
                    onChange={(value) =>
                      updateContent({
                        ...content,
                        awards: content.awards.map((award) =>
                          award.id === item.id
                            ? {
                              ...award,
                              expandedNote: value || undefined,
                            }
                            : award,
                        ),
                      })
                    }
                  />
                  {item.expandedAwards ? (
                    <TextArea
                      label="Expanded awards"
                      value={awardsToText(item.expandedAwards)}
                      onChange={(value) => {
                        const lines = textToList(value);
                        const nextExpanded = item.expandedAwards?.map(
                          (award, index) => {
                            const [label, amount] = (
                              lines[index] ?? ""
                            ).split("|");
                            return {
                              ...award,
                              label: label?.trim() || award.label,
                              amount: amount?.trim() || award.amount,
                            };
                          },
                        );
                        updateContent({
                          ...content,
                          awards: content.awards.map((award) =>
                            award.id === item.id
                              ? { ...award, expandedAwards: nextExpanded }
                              : award,
                          ),
                        });
                      }}
                    />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          title="Regulations"
          actionLabel="Add regulation"
          onAdd={addRegulation}
        >
          <div className="mb-4 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Title"
                value={content.regulationsTitle}
                onChange={(value) =>
                  updateContent({ ...content, regulationsTitle: value })
                }
              />
              <TextInput
                label="Subtitle"
                value={content.regulationsSubtitle}
                onChange={(value) =>
                  updateContent({ ...content, regulationsSubtitle: value })
                }
              />
            </div>
          </div>
          <div className="grid gap-4">
            {content.regulations.map((item) => {
              const key = createEditingKey("regulations", item.id);
              const isEditing = editingKey === key;

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
                >
                  <CardActions
                    isEditing={isEditing}
                    onEdit={() => setEditingKey(key)}
                    onDone={() => setEditingKey(null)}
                    onDelete={() => deleteItem("regulations", item.id)}
                  />
                  {isEditing ? (
                    <div className="mt-4 grid gap-3">
                      <TextInput
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateRegulation(item.id, "title", value)
                        }
                      />
                      <TextArea
                        label="Rules"
                        value={listToText(item.items)}
                        onChange={(value) =>
                          updateRegulation(item.id, "items", value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-lg font-bold text-[#ff6a1f]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-amber-50/60">
                        {item.items.join(" ")}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection
          title="News"
          actionLabel="Add news"
          onAdd={addNewsItem}
        >
          <div className="mb-4 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-3">
              <TextInput
                label="Section title"
                value={content.newsTitle}
                onChange={(value) =>
                  updateContent({ ...content, newsTitle: value })
                }
              />
              <TextInput
                label="Subtitle"
                value={content.newsSubtitle}
                onChange={(value) =>
                  updateContent({ ...content, newsSubtitle: value })
                }
              />
              <TextInput
                label="Read all label"
                value={content.newsReadAllLabel}
                onChange={(value) =>
                  updateContent({ ...content, newsReadAllLabel: value })
                }
              />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {content.news.map((item) => {
              const key = createEditingKey("news", item.id);
              const isEditing = editingKey === key;

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
                >
                  <CardActions
                    isEditing={isEditing}
                    onEdit={() => setEditingKey(key)}
                    onDone={() => setEditingKey(null)}
                    onDelete={() => deleteItem("news", item.id)}
                  />
                  {isEditing ? (
                    <div className="mt-4 grid gap-3">
                      <TextInput
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateNewsItem(item.id, "title", value)
                        }
                      />
                      <TextArea
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateNewsItem(item.id, "description", value)
                        }
                      />
                      <TextInput
                        label="Author"
                        value={item.author}
                        onChange={(value) =>
                          updateNewsItem(item.id, "author", value)
                        }
                      />
                      <TextInput
                        label="Date"
                        type="date"
                        value={item.date}
                        onChange={(value) =>
                          updateNewsItem(item.id, "date", value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-amber-50/50">
                        {item.author} - {item.date}
                      </p>
                      <h2 className="mt-2 text-lg font-bold text-[#ff6a1f]">
                        {item.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-amber-50/60">
                        {item.description}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection
          title="Milestones"
          actionLabel="Add milestone"
          onAdd={addMilestoneItem}
        >
          <div className="mb-4 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Section title"
                value={content.milestonesTitle}
                onChange={(value) =>
                  updateContent({ ...content, milestonesTitle: value })
                }
              />
              <TextArea
                label="Section note"
                value={content.milestonesNote}
                onChange={(value) =>
                  updateContent({ ...content, milestonesNote: value })
                }
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.milestones.map((item) => {
              const key = createEditingKey("milestones", item.id);
              const isEditing = editingKey === key;

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
                >
                  <CardActions
                    isEditing={isEditing}
                    onEdit={() => setEditingKey(key)}
                    onDone={() => setEditingKey(null)}
                    onDelete={() => deleteItem("milestones", item.id)}
                  />
                  {isEditing ? (
                    <div className="mt-4 grid gap-3">
                      <TextInput
                        label="Date"
                        value={item.date}
                        onChange={(value) =>
                          updateMilestoneItem(item.id, "date", value)
                        }
                      />
                      <TextInput
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateMilestoneItem(item.id, "title", value)
                        }
                      />
                      <TextInput
                        label="Badge"
                        value={item.detail ?? ""}
                        onChange={(value) =>
                          updateMilestoneItem(item.id, "detail", value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      {item.detail ? (
                        <span className="rounded border border-amber-50/30 px-2 py-1 text-xs font-semibold text-amber-50/70">
                          {item.detail}
                        </span>
                      ) : null}
                      <p className="mt-3 text-xs font-bold uppercase text-amber-50/50">
                        {item.date}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold">
                        {item.title}
                      </h2>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection title="Publications Preview">
          <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Eyebrow"
                value={content.publicationsHome.eyebrow}
                onChange={(value) => updatePublicationsHome("eyebrow", value)}
              />
              <TextInput
                label="Badge"
                value={content.publicationsHome.badge}
                onChange={(value) => updatePublicationsHome("badge", value)}
              />
              <TextInput
                label="Read more label"
                value={content.publicationsHome.readMoreLabel}
                onChange={(value) =>
                  updatePublicationsHome("readMoreLabel", value)
                }
              />
              <TextInput
                label="View all label"
                value={content.publicationsHome.viewAllLabel}
                onChange={(value) =>
                  updatePublicationsHome("viewAllLabel", value)
                }
              />
            </div>
          </div>
        </AdminSection>

        <AdminSection title="Workshop">
          <div className="grid gap-4">
            {content.workshops.map((item) => {
              const key = createEditingKey("workshops", item.id);
              const isEditing = editingKey === key;

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg"
                >
                  <CardActions
                    isEditing={isEditing}
                    onEdit={() => setEditingKey(key)}
                    onDone={() => setEditingKey(null)}
                    onDelete={() => deleteItem("workshops", item.id)}
                  />
                  {isEditing ? (
                    <WorkshopForm item={item} onChange={updateWorkshopItem} />
                  ) : (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase text-[#ff6a1f]">
                        {item.eyebrow}
                      </p>
                      <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
                      <p className="mt-2 text-sm text-amber-50/60">
                        {item.description}
                      </p>
                      <p className="mt-4 text-sm font-semibold">
                        {item.scheduleLabel} - {item.date}
                      </p>
                      <p className="text-sm text-orange-300">{item.note}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection title="Footer">
          <div className="rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput
                label="Headline 1"
                value={content.footer.headlineOne}
                onChange={(value) => updateFooter("headlineOne", value)}
              />
              <TextInput
                label="Headline 2"
                value={content.footer.headlineTwo}
                onChange={(value) => updateFooter("headlineTwo", value)}
              />
              <TextInput
                label="Headline 3"
                value={content.footer.headlineThree}
                onChange={(value) => updateFooter("headlineThree", value)}
              />
              <TextInput
                label="CTA label"
                value={content.footer.ctaLabel}
                onChange={(value) => updateFooter("ctaLabel", value)}
              />
              <TextInput
                label="Contact heading"
                value={content.footer.contactHeading}
                onChange={(value) => updateFooter("contactHeading", value)}
              />
              <TextInput
                label="Facebook label"
                value={content.footer.facebookLabel}
                onChange={(value) => updateFooter("facebookLabel", value)}
              />
              <TextInput
                label="Facebook URL"
                value={content.footer.facebookUrl}
                onChange={(value) => updateFooter("facebookUrl", value)}
              />
              <TextInput
                label="Email label"
                value={content.footer.emailLabel}
                onChange={(value) => updateFooter("emailLabel", value)}
              />
              <TextInput
                label="Email"
                value={content.footer.email}
                onChange={(value) => updateFooter("email", value)}
              />
              <TextInput
                label="Phone label"
                value={content.footer.phoneLabel}
                onChange={(value) => updateFooter("phoneLabel", value)}
              />
              <TextInput
                label="Phone"
                value={content.footer.phone}
                onChange={(value) => updateFooter("phone", value)}
              />
              <TextInput
                label="Copyright"
                value={content.footer.copyrightLine}
                onChange={(value) => updateFooter("copyrightLine", value)}
              />
              <TextInput
                label="Rights"
                value={content.footer.rightsLine}
                onChange={(value) => updateFooter("rightsLine", value)}
              />
            </div>
          </div>
        </AdminSection>
      </section>
    </main>
  );
};

type AdminSectionProps = {
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
  onAdd?: () => void;
};

const AdminSection = ({
  title,
  actionLabel,
  children,
  onAdd,
}: AdminSectionProps) => (
  <section className="mt-8">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAdd && actionLabel ? (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-50/25 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10"
        >
          <FaPlus />
          {actionLabel}
        </button>
      ) : null}
    </div>
    {children}
  </section>
);

type CardActionsProps = {
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
  onDelete: () => void;
};

const CardActions = ({
  isEditing,
  onEdit,
  onDone,
  onDelete,
}: CardActionsProps) => (
  <div className="flex justify-end gap-2">
    {isEditing ? (
      <button
        type="button"
        onClick={onDone}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-amber-50/20 text-amber-50/70 transition hover:border-[#ff6a1f] hover:bg-amber-50/10 hover:text-amber-50"
        aria-label="Done"
        title="Done"
      >
        <FaCheck />
      </button>
    ) : (
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-amber-50/20 text-amber-50/70 transition hover:border-[#ff6a1f] hover:bg-amber-50/10 hover:text-amber-50"
        aria-label="Edit"
        title="Edit"
      >
        <FaPen />
      </button>
    )}
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-400/30 text-red-400 transition hover:bg-red-500/10"
      aria-label="Delete"
      title="Delete"
    >
      <FaTrash />
    </button>
  </div>
);

type TextInputProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

const TextInput = ({
  label,
  value,
  type = "text",
  onChange,
}: TextInputProps) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    <input
      className={inputClass}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const TextArea = ({ label, value, onChange }: TextAreaProps) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    <textarea
      className={`${inputClass} min-h-28 resize-y`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);

type WorkshopFormProps = {
  item: WorkshopItem;
  onChange: (id: number, field: keyof WorkshopItem, value: string) => void;
};

const WorkshopForm = ({ item, onChange }: WorkshopFormProps) => (
  <div className="mt-4 grid gap-3 md:grid-cols-2">
    <TextInput
      label="Eyebrow"
      value={item.eyebrow}
      onChange={(value) => onChange(item.id, "eyebrow", value)}
    />
    <TextInput
      label="Title"
      value={item.title}
      onChange={(value) => onChange(item.id, "title", value)}
    />
    <div className="md:col-span-2">
      <TextArea
        label="Description"
        value={item.description}
        onChange={(value) => onChange(item.id, "description", value)}
      />
    </div>
    <TextInput
      label="Schedule label"
      value={item.scheduleLabel}
      onChange={(value) => onChange(item.id, "scheduleLabel", value)}
    />
    <TextInput
      label="Date"
      value={item.date}
      onChange={(value) => onChange(item.id, "date", value)}
    />
    <TextInput
      label="Note"
      value={item.note}
      onChange={(value) => onChange(item.id, "note", value)}
    />
    <TextInput
      label="Session title"
      value={item.sessionTitle}
      onChange={(value) => onChange(item.id, "sessionTitle", value)}
    />
    <TextInput
      label="Session subtitle"
      value={item.sessionSubtitle}
      onChange={(value) => onChange(item.id, "sessionSubtitle", value)}
    />
    <TextInput
      label="Time"
      value={item.time}
      onChange={(value) => onChange(item.id, "time", value)}
    />
  </div>
);

export default AdminPage;
