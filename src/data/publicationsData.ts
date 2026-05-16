export interface PublicationItem {
  id: number;
  title: string;
  journalName: string;
  description: string;
  date: string;
  source: string;
  image: string;
  newsId?: number;
}

const publicationImage = (seed: number) =>
  `https://picsum.photos/seed/resfes-pub-${seed}/800/600`;

export const publicationsData: PublicationItem[] = [
  {
    id: 1,
    title: "Knowledge-Based Systems (KBS) (Q1 Journal)",
    journalName: "Knowledge-Based Systems",
    description:
      'Our paper, "From Object Difficulty to Image Scoring: A Strategy for Active Learning in Object Detection", has been accepted for publication in the Knowledge-Based Systems journal.',
    date: "2026-04-03",
    source: "KBS",
    image: publicationImage(1),
    newsId: 1,
  },
  {
    id: 2,
    title:
      "Engineering Applications of Artificial Intelligence (EAAI) (Q1 Journal)",
    journalName: "Engineering Applications of Artificial Intelligence",
    description:
      'Our paper, "Enhancing multimodal emotion recognition with dynamic fuzzy membership and attention fusion", has been accepted by the "Engineering Applications of Artificial Intelligence" Journal.',
    date: "2025-11-27",
    source: "EAAI",
    image: publicationImage(2),
    newsId: 2,
  },
  {
    id: 3,
    title:
      "Isogeometric evaluation of higher-order shear deformation theories for functionally graded magneto-electro-elastic nanoplates under nonlocal strain gradient elasticity",
    journalName: "International Applied Science & Technology",
    description:
      "A comprehensive study on isogeometric analysis methods applied to functionally graded nanoplates with magneto-electro-elastic properties.",
    date: "2026-04-21",
    source: "IAST",
    image: publicationImage(3),
    newsId: 3,
  },
  {
    id: 4,
    title:
      "A refined size-dependent modified strain gradient analysis of graphene platelet-reinforced functionally graded triply periodic minimal surface microplates using isogeometric analysis",
    journalName: "International Applied Science & Technology",
    description:
      "Novel approach to analyzing graphene-reinforced microplates using modified strain gradient theory and isogeometric methods.",
    date: "2026-04-21",
    source: "IAST",
    image: publicationImage(4),
  },
  {
    id: 5,
    title:
      "Nonlinear thermo-mechanical buckling and postbuckling behavior of FG-GPLRC panels with auxetic core and piezoelectric layers",
    journalName: "International Applied Science & Technology",
    description:
      "Investigation of nonlinear buckling behavior in functionally graded panels with auxetic cores under thermo-mechanical loading.",
    date: "2026-04-20",
    source: "IAST",
    image: publicationImage(5),
  },
  {
    id: 6,
    title:
      "Interlayer coupling and exciton dynamics in vertically stacked CdZnTe/ZnTe quantum dots",
    journalName: "International Applied Science & Technology",
    description:
      "Study of quantum dot interactions and exciton behavior in vertically stacked semiconductor nanostructures.",
    date: "2026-04-06",
    source: "IAST",
    image: publicationImage(6),
  },
  {
    id: 7,
    title:
      "High-efficient wideband and switchable multifunctional vanadium dioxide-based metasurface",
    journalName: "International Applied Science & Technology",
    description:
      "Development of a multifunctional metasurface based on vanadium dioxide with switchable wideband properties.",
    date: "2026-04-06",
    source: "IAST",
    image: publicationImage(7),
  },
  {
    id: 8,
    title:
      "Red-emitting YVO4:Eu nanophosphors for agricultural luminescent converting films: synthesis and properties",
    journalName: "International Applied Science & Technology",
    description:
      "Synthesis and characterization of luminescent nanophosphors for agricultural film applications.",
    date: "2026-04-06",
    source: "IAST",
    image: publicationImage(8),
  },
  {
    id: 9,
    title:
      "Deep learning-based speech emotion recognition with attention mechanism for Vietnamese language",
    journalName: "Applied Intelligence",
    description:
      "A novel deep learning architecture for recognizing emotions in Vietnamese speech using attention-based feature extraction.",
    date: "2026-03-15",
    source: "APIN",
    image: publicationImage(9),
    newsId: 1,
  },
  {
    id: 10,
    title:
      "Blockchain-based supply chain traceability for Vietnamese coffee industry",
    journalName: "Computers & Industrial Engineering",
    description:
      "Implementation of blockchain technology for end-to-end traceability in the Vietnamese coffee supply chain.",
    date: "2026-02-28",
    source: "CIE",
    image: publicationImage(10),
    newsId: 2,
  },
];
