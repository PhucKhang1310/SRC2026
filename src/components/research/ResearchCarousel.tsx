import type { RefObject } from "react";
import type { ResearchFieldItem } from "../../data/contentData";

interface ResearchCarouselProps {
  carouselRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  fields: ResearchFieldItem[];
}

const ResearchCarousel = ({ carouselRef, onScroll, fields }: ResearchCarouselProps) => {
  return (
    <div className="flex-1">
      <div
        ref={carouselRef}
        className="carousel carousel-vertical rounded-box h-[50vh]"
        onScroll={onScroll}
      >
        {fields.map((item, index) => (
          <div key={index} className="carousel-item h-full">
            <div className="card h-full w-[40vw] overflow-hidden rounded-2xl bg-transparent text-black">
              <div className="card-body min-h-0 overflow-hidden">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{item.title}</h2>
                </div>
                <ul className="mt-6 flex min-h-0 flex-col gap-2 overflow-hidden pl-5 text-lg font-thin list-disc">
                  {item.carouselItems.map((listItem, itemIndex) => (
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
