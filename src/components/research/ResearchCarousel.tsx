import type { RefObject } from "react";

interface ResearchCarouselProps {
  carouselRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

const ResearchCarousel = ({ carouselRef, onScroll }: ResearchCarouselProps) => {
  const carouselItems = [
    {
      title: "Information Technology",
      items: [
        "AI-powered campus assistant for student services and advising",
        "Secure IoT architecture for smart classroom infrastructure",
        "Full-stack web and mobile application development",
        "Data Science, Machine Learning and Analytics",
      ],
    },
    {
      title: "Semiconductor IC & Digital Automotive",
      items: [
        "Low-power semiconductor prototype for edge sensing workloads",
        "Digital twin simulation for predictive automotive maintenance",
        "Embedded systems design and optimization",
        "VLSI circuit design and verification",
      ],
    },
    {
      title: "Graphic Design & Digital Art, Multimedia Communication",
      items: [
        "Brand identity system for science communication campaigns",
        "Short-form multimedia storytelling for public research impact",
        "Accessible infographic design for technical findings",
        "Cross-platform motion graphics for event promotion",
      ],
    },
    {
      title: "Economics & Business Administration",
      items: [
        "Consumer behavior analysis for education technology adoption",
        "Financial feasibility model for student-led startup ideas",
        "Operations optimization for campus service workflows",
        "Market entry strategy for sustainable youth-focused products",
      ],
    },
    {
      title: "Languages (English & Japanese)",
      items: [
        "Project-based English writing outcomes in research contexts",
        "Academic presentation anxiety and speaking performance factors",
        "Pragmatics in Japanese business email communication",
        "Intercultural communication challenges in JP-VN teamwork",
      ],
    },
  ];

  return (
    <div className="flex-1">
      <div
        ref={carouselRef}
        className="carousel carousel-vertical rounded-box h-[50vh]"
        onScroll={onScroll}
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="carousel-item h-full">
            <div className="card h-full w-[40vw] overflow-hidden rounded-2xl bg-transparent text-black">
              <div className="card-body min-h-0 overflow-hidden">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{item.title}</h2>
                </div>
                <ul className="mt-6 flex min-h-0 flex-col gap-2 overflow-hidden pl-5 text-lg font-thin list-disc">
                  {item.items.map((listItem, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="whitespace-nowrap"
                    >
                      <span className="block truncate">{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchCarousel;
