export interface MentorItem {
  name: string;
  role: string;
  image?: string;
  description: string;
  links?: {
    website?: string;
    orcid?: string;
    researchgate?: string;
    googleScholar?: string;
  };
}

const mentorImage = (seed: number) =>
  `https://picsum.photos/seed/resfes-mentor-${seed}/800/1000`;

export const mentors: MentorItem[] = [
  {
    name: "Dang Ngoc Minh Duc",
    role: "Assoc. Prof. | Information Technology",
    image: mentorImage(1),
    description:
      "Wireless Networks, Artificial Intelligence, Internet of Things. Topics include AI-integrated MAC protocols, speech emotion recognition, medical image segmentation, and quantum machine learning.",
    links: {
      website: "https://dnmduc.github.io/",
      orcid: "https://orcid.org/0000-0001-9302-3129",
      researchgate: "https://www.researchgate.net/profile/Duc-Dang-6",
      googleScholar: "https://scholar.google.com/citations?user=2UKP440AAAAJ",
    },
  },
  {
    name: "Huynh Cong Viet Ngu",
    role: "Dr. | Computing Fundamental",
    image: mentorImage(2),
    description:
      "Deep Learning, Time Series Analysis, Computer Vision. Focus areas: anomaly detection, super resolution, and AutoML.",
    links: {
      googleScholar:
        "https://scholar.google.com/citations?user=sYLjuT4AAAAJ&hl=en&oi=ao",
    },
  },
  {
    name: "Pham Minh Tri",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(3),
    description:
      "AI, bioinformatics, computational science, and quantum computing with work in optimization, data mining, simulation modeling, and computer vision.",
    links: {
      orcid: "https://orcid.org/0009-0006-4256-6530",
      researchgate: "https://www.researchgate.net/profile/Tri-Minh-Pham",
      googleScholar:
        "https://scholar.google.com/citations?user=f1LXlW8AAAAJ&hl=vi&authuser=1",
    },
  },
  {
    name: "Trinh Huy Hiep",
    role: "MA | Computing Fundamental",
    image: mentorImage(4),
    description:
      "Artificial Intelligence, Software Engineering, and education, with interest in adaptive learning systems.",
    links: {
      orcid: "https://orcid.org/0009-0006-5771-2406",
    },
  },
  {
    name: "Le Nhat Tung",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(5),
    description:
      "Artificial Intelligence and Data Science. Topics include social network analysis, text mining, chatbot development, sentiment analysis, NER, and computer vision.",
    links: {
      website: "https://titv.vn",
      orcid: "https://orcid.org/my-orcid?orcid=0000-0002-7210-3426",
      researchgate: "https://www.researchgate.net/profile/Nhat-Tung-Le-2/",
      googleScholar: "https://scholar.google.com/citations?user=goc4CBEAAAAJ",
    },
  },
  {
    name: "Nguyen Thanh Dien",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(6),
    description:
      "Ontology, AI, IoT systems, smart systems, and knowledge modeling.",
    links: {
      orcid: "https://orcid.org/0009-0007-1441-4086",
      researchgate:
        "https://www.researchgate.net/profile/Dien-Nguyen-44?ev=prf_overview",
    },
  },
  {
    name: "Le Vu Truong",
    role: "MA | Computing Fundamental",
    image: mentorImage(7),
    description: "AI and deep learning.",
    links: {
      orcid: "https://orcid.org/0000-0001",
    },
  },
  {
    name: "Kieu Hoang Long",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(8),
    description:
      "Artificial Intelligence and Data Science, with focus on applied and domain-specific AI.",
    links: {
      orcid: "https://orcid.org/0009-0008-8243-5695",
      researchgate: "https://www.researchgate.net/profile/Long-Kieu-5",
    },
  },
  {
    name: "Truong Thi My Ngoc",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(9),
    description:
      "NLP and ASR with work on Vietnamese automatic speech recognition, speech data augmentation, and preprocessing.",
  },
  {
    name: "Vu Thi Thuy Duong",
    role: "MSc. | Computing Fundamental",
    image: mentorImage(10),
    description:
      "Data mining, AI in education, and human-centered AI, including adaptive learning systems with mental health awareness features.",
    links: {
      orcid: "https://orcid.org/0000-0001-8614-8732",
      researchgate: "https://www.researchgate.net/profile/Duong-Vu-Thi-Thuy",
      googleScholar: "https://scholar.google.com/citations?user=7EpIWJcAAAAJ",
    },
  },
  {
    name: "Le Ha Van",
    role: "Dr. | English",
    image: mentorImage(11),
    description:
      "TESOL, EdTech, and literacy, with research on 21st-century skills and AI integration in English teaching and learning.",
    links: {
      orcid: "https://orcid.org/0000-0001-6704-7194",
      googleScholar:
        "https://scholar.google.com/citations?user=frfE8zAAAAAJ&hl=en",
    },
  },
  {
    name: "Nguyen Thi Nhu Ngoc",
    role: "M.Ed | English",
    image: mentorImage(12),
    description:
      "Technology-enhanced learning, AI in education, literacy, online learning, and language education.",
    links: {
      orcid: "https://orcid.org/0009-0005-6223-3605",
      researchgate: "https://www.researchgate.net/profile/Tn-Ngoc-Nguyen",
      googleScholar:
        "https://scholar.google.com/citations?user=46jkWIEAAAAJ&hl=en",
    },
  },
  {
    name: "Do Huynh Bao Ngoc",
    role: "M.Ed | English Preparation Course",
    image: mentorImage(13),
    description: "English as a Second Language (ESL).",
  },
  {
    name: "Ngo Tan Lam Huy",
    role: "MSc. | Entrepreneurship Development",
    image: mentorImage(14),
    description:
      "Financial economics, banking, macroeconomics, and entrepreneurship with focus on monetary policy, digital transformation, and sustainability.",
    links: {
      orcid: "https://orcid.org/0000-0003-4574-7258",
      googleScholar:
        "https://scholar.google.com/citations?user=InZTacoAAAAJ&hl=vi",
    },
  },
  {
    name: "Nguyen Quang Luan",
    role: "MA | Graphic Design",
    image: mentorImage(15),
    description: "History of Art and deep learning for medical imaging.",
  },
  {
    name: "Truong Long",
    role: "MBA | Information Technology Specialization",
    image: mentorImage(16),
    description:
      "Artificial Intelligence, Internet of Things, and Education with topics in medical imaging, smart farming IoT systems, and blockchain-based supply chains.",
    links: {
      orcid: "https://orcid.org/0009-0007-0928-2015",
    },
  },
  {
    name: "Nguyen Tuan Cuong",
    role: "Dr. | Information Technology Specialization",
    image: mentorImage(17),
    description:
      "Artificial Intelligence and Data Science with interests in pattern recognition, time-series prediction, graph neural networks, and object detection.",
    links: {
      website: "https://ntcuong2103.github.io/",
      orcid: "https://orcid.org/0000-0003-2556-9191",
      researchgate: "https://www.researchgate.net/profile/Cuong-Nguyen-17",
      googleScholar: "https://scholar.google.co.jp/citations?user=Kx5aOYkAAAAJ",
    },
  },
  {
    name: "Ho Dinh Duan",
    role: "Dr. | Information Technology Specialization",
    image: mentorImage(18),
    description:
      "Artificial Intelligence, image processing, computer vision, and remote sensing, including wetland ecosystem classification and WebGIS application development.",
    links: {
      orcid: "https://orcid.org/0000-0002-8809-7155",
      researchgate: "https://www.researchgate.net/profile/Ho-Duan",
    },
  },
  {
    name: "Nguyen Hoang Linh",
    role: "MA | International Business",
    image: mentorImage(19),
    description:
      "Management control systems, international business, and supply chain management.",
    links: {
      orcid: "https://orcid.org/0009-0000-8165-1283",
    },
  },
  {
    name: "Dang Diem Phuong",
    role: "Others | International Business",
    image: mentorImage(20),
    description:
      "Marketing in tourism and hospitality with focus on metaverse applications and smart technologies in tourism.",
    links: {
      orcid: "https://orcid.org/0009-0004-7997-2175",
      researchgate:
        "https://www.researchgate.net/profile/Phuong-Dang-40?ev=hdr_xprf",
    },
  },
  {
    name: "Nguyen Hoang Dung",
    role: "Dr. | International Business",
    image: mentorImage(21),
    description:
      "Logistics and supply chain management with research on online retail consumer behavior and supply chain risk management.",
    links: {
      orcid: "https://orcid.org/0000-0003-0005-9080",
      researchgate: "https://www.researchgate.net/profile/Dung-Nguyen-148",
      googleScholar:
        "https://scholar.google.com/citations?user=3MvR72oAAAAJ&hl=en",
    },
  },
  {
    name: "Nguyen Hoai Khanh",
    role: "MA | Japanese",
    image: mentorImage(22),
    description:
      "Education and language studies, including educational management and Japanese language and culture.",
    links: {
      orcid: "https://orcid.org/my-orcid?orcid=0009-0007-6790-3131",
      researchgate:
        "https://www.researchgate.net/profile/Nguyen-Hoai-Khanh?ev=hdr_xprf",
    },
  },
  {
    name: "Nguyen Vo Tam Nhu",
    role: "MA | Japanese",
    image: mentorImage(23),
    description:
      "Linguistics, cultural linguistics, pragmatics, and comparative religion with work on Vietnamese and Japanese folk belief language-culture schemas.",
    links: {
      orcid: "https://orcid.org/0000-0002-3137-2611",
      researchgate:
        "https://www.researchgate.net/profile/Nhu-Nguyen-375?ev=hdr_xprf",
      googleScholar: "https://www.researchgate.net/profile/Nhu-Nguyen-375",
    },
  },
  {
    name: "Duong Thi Thuy",
    role: "Dr. | Japanese",
    image: mentorImage(24),
    description:
      "Business administration, international business, and language education with interests in Japanese management studies and foreign language teaching.",
    links: {
      orcid: "https://orcid.org/0009-0006-1576-2296",
      researchgate:
        "https://www.researchgate.net/profile/Duong-Thuy-4?ev=hdr_xprf",
    },
  },
  {
    name: "Mai Van Duy",
    role: "MSc. | Mathematics",
    image: mentorImage(25),
    description:
      "Robust and adjustable robust optimization, subdifferentials, optimality conditions, duality, and Farkas lemmas.",
    links: {
      researchgate: "https://www.researchgate.net/profile/Mai-Duy-3",
      googleScholar:
        "https://scholar.google.com/citations?user=7UZgYtcAAAAJ&hl=en",
    },
  },
  {
    name: "Ta Hoang Thang",
    role: "Dr. | Mathematics",
    image: mentorImage(26),
    description:
      "NLP, neural networks, SciML, applied mathematics, and AI with topics in sentiment analysis and Kolmogorov-Arnold Networks.",
    links: {
      website: "https://www.tahoangthang.com/",
      orcid: "https://orcid.org/0000-0003-0321-5106",
      researchgate: "https://www.researchgate.net/profile/Thang-Ta-2",
      googleScholar:
        "https://scholar.google.com/citations?user=WM2kMbsAAAAJ&hl=vi",
    },
  },
  {
    name: "Tran Thanh Hiep",
    role: "MSc. | Mathematics",
    image: mentorImage(27),
    description:
      "Operations research and optimization, especially algorithms for scheduling, positioning, and allocation problems.",
    links: {
      orcid: "https://orcid.org/0009-0008-6698-917X",
      researchgate: "https://www.researchgate.net/profile/Hiep-Tran-28",
    },
  },
  {
    name: "Doan Thi Ngan",
    role: "Dr. | Soft Skill",
    image: mentorImage(28),
    description: "Philosophy and political philosophy.",
  },
  {
    name: "Nguyen Van Binh",
    role: "MSc. | Soft Skill",
    image: mentorImage(29),
    description:
      "Philosophy, economics, political economy, and political theory, including practical applications in Vietnam.",
  },
  {
    name: "Nguyen Thi Cam Huong",
    role: "Dr. | Software Engineering",
    image: mentorImage(30),
    description:
      "Machine learning and deep learning, with research on data mining in education.",
    links: {
      orcid: "https://orcid.org/0009-0009-1275-740X",
      googleScholar:
        "https://scholar.google.com/citations?user=L7jdKxoAAAAJ&hl=en",
    },
  },
  {
    name: "Bui Huu Dong",
    role: "MSc. | Software Engineering",
    image: mentorImage(31),
    description:
      "Software engineering, applied cryptography, blockchain technology, and security/privacy in open banking and open data.",
    links: {
      orcid: "https://orcid.org/0009-0007-6617-8505",
      googleScholar:
        "https://scholar.google.com/citations?hl=en&user=Q1FWBmsAAAAJ",
    },
  },
];
