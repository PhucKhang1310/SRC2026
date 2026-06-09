
export type MilestoneItem = {
  id: number;
  date: string;
  title: string;
  detail?: string;
};

export type WorkshopItem = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  scheduleLabel: string;
  date: string;
  note: string;
  sessionTitle: string;
  sessionSubtitle: string;
  time: string;
};

export type HeroContent = {
  titleLines: string[];
  taglinePrimary: string;
  taglineSecondary: string;
  countdownLabel: string;
  registrationDeadline: string;
  ctaLabel: string;
  ctaUrl: string;
  partnerLabel: string;
  closingLinePrimary: string;
  closingLineSecondary: string;
};

export type AboutContent = {
  sectionLabel: string;
  title: string;
  highlightOne: string;
  paragraphOne: string;
  highlightTwo: string;
  paragraphTwo: string;
  paragraphThree: string;
};

export type ResearchFieldItem = {
  id: number;
  icon: "code" | "chip" | "design" | "business" | "language";
  title: string;
  accordionItems: string[];
  carouselItems: string[];
};

export type AwardTier = {
  id: number;
  label: string;
  amount: string;
  count: number;
  icon: "trophy" | "medal";
  color: string;
};

export type AwardCommittee = {
  id: number;
  name: string;
  nameVi: string;
  color: string;
  accentGradient: string;
  borderColor: string;
  standardAwards: AwardTier[];
  smallAwards: AwardTier[];
  expandedNote?: string;
  expandedAwards?: AwardTier[];
};

export type RegulationSection = {
  id: number;
  title: string;
  items: string[];
};

export type PublicationsHomeContent = {
  eyebrow: string;
  badge: string;
  readMoreLabel: string;
  viewAllLabel: string;
};

export type FooterContent = {
  headlineOne: string;
  headlineTwo: string;
  headlineThree: string;
  ctaLabel: string;
  ctaUrl: string;
  contactHeading: string;
  facebookLabel: string;
  facebookUrl: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  copyrightLine: string;
  rightsLine: string;
};

export type PageSectionKind =
  | "hero"
  | "about"
  | "research"
  | "awards"
  | "regulations"
  | "milestones"
  | "news"
  | "publications"
  | "workshops"
  | "footer";

export type PageLayoutSection = {
  id: PageSectionKind;
  enabled: boolean;
};

export const defaultPageLayout: PageLayoutSection[] = [
  { id: "hero", enabled: true },
  { id: "about", enabled: true },
  { id: "research", enabled: true },
  { id: "awards", enabled: true },
  { id: "regulations", enabled: true },
  { id: "milestones", enabled: true },
  { id: "news", enabled: true },
  { id: "publications", enabled: true },
  { id: "workshops", enabled: true },
  { id: "footer", enabled: true },
];

export type EditableContent = {
  layout: PageLayoutSection[];
  hero: HeroContent;
  about: AboutContent;
  researchTitle: string;
  researchFields: ResearchFieldItem[];
  awardsTitle: string;
  awardsStandardLabel: string;
  awardsSmallLabel: string;
  awards: AwardCommittee[];
  awardsNote: string;
  regulationsTitle: string;
  regulationsSubtitle: string;
  regulations: RegulationSection[];
  newsTitle: string;
  newsSubtitle: string;
  newsReadAllLabel: string;
  milestonesTitle: string;
  milestonesNote: string;
  milestones: MilestoneItem[];
  publicationsHome: PublicationsHomeContent;
  workshops: WorkshopItem[];
  footer: FooterContent;
};

export const contentStorageKey = "resfes2026-editable-content";

export const defaultContent: EditableContent = {
  layout: defaultPageLayout,
  hero: {
    titleLines: ["STUDENT", "RESEARCH", "COMPETITION", "2026"],
    taglinePrimary: "RBL in Action, Researchers Ready",
    taglineSecondary: "Triển khai RBL, Triển vọng trong nghiên cứu",
    countdownLabel: "Registration closes 01.06.2026",
    registrationDeadline: "2026-06-01T23:59:59+07:00",
    ctaLabel: "Register Now",
    ctaUrl: "/register",
    partnerLabel: "WE ARE",
    closingLinePrimary: "Empowering minds to turn research into",
    closingLineSecondary: "progress, innovation, and change",
  },
  about: {
    sectionLabel: "ABOUT SRC 2026",
    title: "Research-Based Learning, Real-World Impact",
    highlightOne: "Research-Based Learning (RBL)",
    paragraphOne:
      "places students at the center of educational activity, shifting the focus from teacher-centered delivery to student-driven inquiry. Through active research practice, students strengthen core skills in problem definition, data collection, analysis, and evidence-based explanation.",
    highlightTwo: "Student Research Competition 2026",
    paragraphTwo:
      "students are encouraged to move from passive learners to active participants in the scientific journey. SRC 2026 integrates RBL into major-specific curricula to cultivate practical, relevant capabilities for each field.",
    paragraphThree:
      "We encourage research teams across majors and sub-committees to apply research-based learning in authentic contexts, equipping students with the mindset and skills needed to meet evolving industry demands.",
  },
  researchTitle: "RESEARCH FIELDS",
  researchFields: [
    {
      id: 1,
      icon: "code",
      title: "Information Technology",
      accordionItems: [
        "Software Engineering",
        "Artificial Intelligence",
        "Data Science & Analytics",
        "Information Systems",
      ],
      carouselItems: [
        "AI-powered campus assistant for student services and advising",
        "Secure IoT architecture for smart classroom infrastructure",
        "Full-stack web and mobile application development",
        "Data Science, Machine Learning and Analytics",
      ],
    },
    {
      id: 2,
      icon: "chip",
      title: "Semiconductor IC & Digital Automotive",
      accordionItems: [
        "Semiconductor IC Design",
        "Digital Automotive Systems",
        "Embedded Systems",
      ],
      carouselItems: [
        "Low-power semiconductor prototype for edge sensing workloads",
        "Digital twin simulation for predictive automotive maintenance",
        "Embedded systems design and optimization",
        "VLSI circuit design and verification",
      ],
    },
    {
      id: 3,
      icon: "design",
      title: "Graphic Design & Digital Art, Multimedia Communication",
      accordionItems: [
        "Graphic Design & Digital Art",
        "Multimedia Communication",
      ],
      carouselItems: [
        "Brand identity system for science communication campaigns",
        "Short-form multimedia storytelling for public research impact",
        "Accessible infographic design for technical findings",
        "Cross-platform motion graphics for event promotion",
      ],
    },
    {
      id: 4,
      icon: "business",
      title: "Economics & Business Administration",
      accordionItems: ["Economics", "Business Administration"],
      carouselItems: [
        "Consumer behavior analysis for education technology adoption",
        "Financial feasibility model for student-led startup ideas",
        "Operations optimization for campus service workflows",
        "Market entry strategy for sustainable youth-focused products",
      ],
    },
    {
      id: 5,
      icon: "language",
      title: "Languages (English & Japanese)",
      accordionItems: [
        "English Language Studies and research topics",
        "Japanese Language Studies and research topics",
      ],
      carouselItems: [
        "Project-based English writing outcomes in research contexts",
        "Academic presentation anxiety and speaking performance factors",
        "Pragmatics in Japanese business email communication",
        "Intercultural communication challenges in JP-VN teamwork",
      ],
    },
  ],
  awardsTitle: "AWARDS",
  awardsStandardLabel: "★ 6+ topics at the Final Round ★",
  awardsSmallLabel: "4–5 topics at the Final Round",
  awards: [
    {
      id: 1,
      name: "Information Technology",
      nameVi: "Công nghệ thông tin",
      color: "from-blue-500 to-cyan-400",
      accentGradient: "from-blue-500/20 to-cyan-400/10",
      borderColor: "border-blue-400/30",
      standardAwards: [
        { id: 1, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 2, label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
        { id: 3, label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
      ],
      smallAwards: [
        { id: 4, label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
      ],
      expandedNote: "If 10+ final presentations, award structure expands:",
      expandedAwards: [
        { id: 5, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 6, label: "2nd Prize", amount: "6,000,000 VND", count: 2, icon: "medal", color: "text-gray-300" },
        { id: 7, label: "3rd Prize", amount: "4,000,000 VND", count: 2, icon: "medal", color: "text-amber-600" },
      ],
    },
    {
      id: 2,
      name: "Semiconductor IC & Digital Automotive",
      nameVi: "Vi mạch bán dẫn và ô tô số",
      color: "from-indigo-500 to-blue-400",
      accentGradient: "from-indigo-500/20 to-blue-400/10",
      borderColor: "border-indigo-400/30",
      standardAwards: [
        { id: 1, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 2, label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
        { id: 3, label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
      ],
      smallAwards: [
        { id: 4, label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
      ],
    },
    {
      id: 3,
      name: "Graphic Design & Digital Art, Multimedia Communication",
      nameVi: "Thiết kế đồ hoạ & mỹ thuật số, Công nghệ truyền thông",
      color: "from-pink-500 to-rose-400",
      accentGradient: "from-pink-500/20 to-rose-400/10",
      borderColor: "border-pink-400/30",
      standardAwards: [
        { id: 1, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 2, label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
        { id: 3, label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
      ],
      smallAwards: [
        { id: 4, label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
      ],
    },
    {
      id: 4,
      name: "Economics & Business Administration",
      nameVi: "Kinh tế & Quản trị kinh doanh",
      color: "from-emerald-500 to-teal-400",
      accentGradient: "from-emerald-500/20 to-teal-400/10",
      borderColor: "border-emerald-400/30",
      standardAwards: [
        { id: 1, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 2, label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
        { id: 3, label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
      ],
      smallAwards: [
        { id: 4, label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
      ],
    },
    {
      id: 5,
      name: "Languages (English & Japanese)",
      nameVi: "Ngôn ngữ (Ngôn ngữ Anh, Ngôn ngữ Nhật)",
      color: "from-violet-500 to-purple-400",
      accentGradient: "from-violet-500/20 to-purple-400/10",
      borderColor: "border-violet-400/30",
      standardAwards: [
        { id: 1, label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
        { id: 2, label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
        { id: 3, label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
      ],
      smallAwards: [
        { id: 4, label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
      ],
    },
  ],
  awardsNote:
    "Important: Teams that submit papers on time must present at the Final Round and attend the full program, especially the closing ceremony. Absence may affect award structure and can lead to cancellation of the team's result.",
  regulationsTitle: "Regulations",
  regulationsSubtitle:
    "Official rules and submission requirements for SRC 2026 (FPTU HCMC).",
  regulations: [
    {
      id: 1,
      title: "1. Eligible Participants",
      items: [
        "Students from all majors at FPT University HCMC are eligible.",
        "The competition includes 5 sub-committees: Information Technology; Semiconductor IC & Digital Automotive; Graphic Design & Digital Art, Multimedia Communication; Economics & Business Administration; Languages (English Language, Japanese Language).",
        "Sub-committee split mechanism: Combined sub-committees will be considered for splitting into separate sub-committees if each field group has 6 or more valid registered topics.",
      ],
    },
    {
      id: 2,
      title: "2. General Rules",
      items: [
        "Teams can register as individuals or groups (max 4 members/group).",
        "Each student can join up to 2 research topics.",
        "Each topic can only join one sub-committee.",
        "Topics that previously won awards at ResFes, or have been published in journals, conferences, or other FPTU HCMC scientific research competitions are not accepted.",
        "The official language for report presentation, oral presentation, and Q&A is English.",
        "Turnitin similarity must not exceed 25%.",
        "Teams must present at the Final Round and attend the closing ceremony where results are announced.",
      ],
    },
    {
      id: 3,
      title: "3. Submission Requirements",
      items: [
        "Teams submit a full research paper.",
        "Use IEEE/IEEE Word template, single-column format, maximum 10 A4 pages excluding References and Appendices.",
        "Citation style: IEEE for Information Technology; APA for Economics & Business Administration, Languages, Multimedia Communication and Digital Art/Design.",
        "Prepare presentation slides for the Final Round.",
        "Presentation language: English, or Japanese for the Japanese Language sub-committee.",
        "Full paper writing instructions are available in the official guideline.",
      ],
    },
  ],
  newsTitle: "News",
  newsSubtitle: "Latest news about SRC2026",
  newsReadAllLabel: "Read all news",
  milestonesTitle: "MILESTONES",
  milestonesNote:
    "All dates are announced according to the official SRC 2026 schedule from FPT University HCMC.",
  milestones: [
    {
      id: 1,
      date: "26.01.2026 - 20.02.2026",
      title: "Competition registration period",
      detail: "START",
    },
    {
      id: 2,
      date: "01.03.2026",
      title: "Workshop: Scientific research methodology",
    },
    {
      id: 3,
      date: "10.03.2026 - 05.04.2026",
      title: "Full research paper submission",
    },
    {
      id: 4,
      date: "19.04.2026",
      title: "Final Round",
    },
  ],
  publicationsHome: {
    eyebrow: "Latest Posts",
    badge: "Latest",
    readMoreLabel: "Keep Reading",
    viewAllLabel: "View all publications",
  },
  workshops: [
    {
      id: 1,
      eyebrow: "Workshops",
      title: "Scientific Research Guidance Workshops",
      description:
        "Huong dan thong tin chuong trinh va pho bien. Neu sinh vien co thac mac co the den Phong Lab de duoc FARPC ho tro.",
      scheduleLabel: "Upcoming workshop",
      date: "22.05.2026",
      note: "Date may change after Preliminary Round",
      sessionTitle: "Scientific Research Guidance Workshop",
      sessionSubtitle: "Competition Rules, Submission Guidelines & More",
      time: "TBA",
    },
  ],
  footer: {
    headlineOne: "Think bigger",
    headlineTwo: "Build Smarter",
    headlineThree: "Join SRC",
    ctaLabel: "Register Now",
    ctaUrl: "/register",
    contactHeading: "Contact us",
    facebookLabel: "Follow us on Facebook",
    facebookUrl: "https://www.facebook.com/fpt.resfes",
    emailLabel: "Email us at src@fe.edu.vn",
    email: "src@fe.edu.vn",
    phoneLabel: "(+84) 246.654.9806",
    phone: "+842465549806",
    copyrightLine: "© 2026 Student Research Competition",
    rightsLine: "All rights reserved",
  },
};

export const normalizePageLayout = (
  layout?: PageLayoutSection[],
): PageLayoutSection[] => {
  const incoming = Array.isArray(layout) ? layout : [];
  const knownIds = new Set(defaultPageLayout.map((section) => section.id));
  const normalized = incoming
    .filter((section): section is PageLayoutSection =>
      Boolean(section && knownIds.has(section.id)),
    )
    .map((section) => ({
      id: section.id,
      enabled: section.enabled !== false,
    }));

  for (const section of defaultPageLayout) {
    if (!normalized.some((item) => item.id === section.id)) {
      normalized.push(section);
    }
  }

  return normalized;
};

export const normalizeEditableContent = (
  content: Partial<EditableContent>,
): EditableContent => ({
  ...defaultContent,
  ...content,
  layout: normalizePageLayout(content.layout),
  hero: { ...defaultContent.hero, ...content.hero },
  about: { ...defaultContent.about, ...content.about },
  publicationsHome: {
    ...defaultContent.publicationsHome,
    ...content.publicationsHome,
  },
  footer: { ...defaultContent.footer, ...content.footer },
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

const readStoredContent = (): Partial<EditableContent> => {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(contentStorageKey);
  if (!stored) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) {
      return {};
    }

    return {
      layout: Array.isArray(parsed.layout)
        ? (parsed.layout as PageLayoutSection[])
        : undefined,
      hero: isRecord(parsed.hero) ? (parsed.hero as HeroContent) : undefined,
      about: isRecord(parsed.about) ? (parsed.about as AboutContent) : undefined,
      researchTitle:
        typeof parsed.researchTitle === "string"
          ? parsed.researchTitle
          : undefined,
      researchFields: Array.isArray(parsed.researchFields)
        ? (parsed.researchFields as ResearchFieldItem[])
        : undefined,
      awardsTitle:
        typeof parsed.awardsTitle === "string" ? parsed.awardsTitle : undefined,
      awardsStandardLabel:
        typeof parsed.awardsStandardLabel === "string"
          ? parsed.awardsStandardLabel
          : undefined,
      awardsSmallLabel:
        typeof parsed.awardsSmallLabel === "string"
          ? parsed.awardsSmallLabel
          : undefined,
      awards: Array.isArray(parsed.awards)
        ? (parsed.awards as AwardCommittee[])
        : undefined,
      awardsNote:
        typeof parsed.awardsNote === "string" ? parsed.awardsNote : undefined,
      regulationsTitle:
        typeof parsed.regulationsTitle === "string"
          ? parsed.regulationsTitle
          : undefined,
      regulationsSubtitle:
        typeof parsed.regulationsSubtitle === "string"
          ? parsed.regulationsSubtitle
          : undefined,
      regulations: Array.isArray(parsed.regulations)
        ? (parsed.regulations as RegulationSection[])
        : undefined,
      newsTitle:
        typeof parsed.newsTitle === "string" ? parsed.newsTitle : undefined,
      newsSubtitle:
        typeof parsed.newsSubtitle === "string"
          ? parsed.newsSubtitle
          : undefined,
      newsReadAllLabel:
        typeof parsed.newsReadAllLabel === "string"
          ? parsed.newsReadAllLabel
          : undefined,

      milestonesTitle:
        typeof parsed.milestonesTitle === "string"
          ? parsed.milestonesTitle
          : undefined,
      milestonesNote:
        typeof parsed.milestonesNote === "string"
          ? parsed.milestonesNote
          : undefined,
      milestones: Array.isArray(parsed.milestones)
        ? (parsed.milestones as MilestoneItem[])
        : undefined,
      publicationsHome: isRecord(parsed.publicationsHome)
        ? (parsed.publicationsHome as PublicationsHomeContent)
        : undefined,
      workshops: Array.isArray(parsed.workshops)
        ? (parsed.workshops as WorkshopItem[])
        : undefined,
      footer: isRecord(parsed.footer)
        ? (parsed.footer as FooterContent)
        : undefined,
    };
  } catch {
    return {};
  }
};

export const getEditableContent = (): EditableContent =>
  normalizeEditableContent(readStoredContent());

export const saveEditableContent = (content: EditableContent) => {
  window.localStorage.setItem(contentStorageKey, JSON.stringify(content));
  window.dispatchEvent(new Event("editable-content-change"));
};

export const resetEditableContent = () => {
  window.localStorage.removeItem(contentStorageKey);
  window.dispatchEvent(new Event("editable-content-change"));
};
